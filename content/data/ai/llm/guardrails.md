---
title: LLM Guardrails
date: 2025-06-12
ready: true
publish: true
---


Guardrails are secondary checks or validations around the input or output of an LLM.
They ensure that the LLM call is valid.


LLMs can be unreliable in multiple ways:
- Model limitations: hallucinations. Their response not grounded in the text of the knowledge base
- Unintented app use/jailbreaking: asking programming questions to a customer support chat
- Information leakage: displaying pii
- Reputational damage: mentioning competitors in a flattering context

Guardrails can help mitigate those.

![[Screenshot 2025-06-12 at 17.51.37.png]]


Some techniques to improve LLM robustness:
- Prompt engineering
- Fine tuning
- RLFH method
- RAG techniques
- AI validation

![[Screenshot 2025-06-12 at 17.52.51.png]]



# Simple validator
Check for keyword match


```python
@register_validator(name="detect_colosseum", data_type="string")
class ColosseumDetector(Validator):
    def _validate(
        self,
        value: Any,
        metadata: Dict[str, Any] = {}
    ) -> ValidationResult:
        if "colosseum" in value.lower():
            return FailResult(
                error_message="Colosseum detected",
                fix_value="I'm sorry, I can't answer questions about Project Colosseum."
            )
        return PassResult()

guard = Guard().use(
    ColosseumDetector(
        on_fail=OnFailAction.EXCEPTION
    ),
    on="messages"
)

# Create guardrail server (step skipped in this code)

guarded_client = OpenAI(
    base_url="http://127.0.0.1:8000/guards/colosseum_guard/openai/v1/"
)
```


A guardrail server allows to add input and output guards inline around an LLM API.

This example  uses the Guardrails-AI library.
https://www.guardrailsai.com/

Is this the most common library to apply guardrails? I assume that other libraries can be configured in a similar way.

Using `OnFailAction.FIX` fails in a more user-friendly way.


# Validation using Natural Language Inference NLI
Check if the text matches or contradicts a hypothesis

![[Screenshot 2025-06-12 at 18.17.11.png]]


NLI compares the LLM response with the relevant documents and checks if it is similar to them.

1. It splits the LLM text into individual sentences.
2. Find the cosine similarity between the sentence and the sources. Get top 5
3. Check if the sentence is entailed by the sources



```python
@register_validator(name="hallucination_detector", data_type="string")
class HallucinationValidation(Validator):
    def __init__(
            self, 
            embedding_model: Optional[str] = None,
            entailment_model: Optional[str] = None,
            sources: Optional[List[str]] = None,
            **kwargs
        ):
        if embedding_model is None:
            embedding_model = 'all-MiniLM-L6-v2'
        self.embedding_model = SentenceTransformer(embedding_model)

        self.sources = sources
        
        if entailment_model is None:
            entailment_model = 'GuardrailsAI/finetuned_nli_provenance'
        self.nli_pipeline = pipeline("text-classification", model=entailment_model)

        super().__init__(**kwargs)

    def validate(
        self, value: str, metadata: Optional[Dict[str, str]] = None
    ) -> ValidationResult:
        # Split the text into sentences
        sentences = self.split_sentences(value)

        # Find the relevant sources for each sentence
        relevant_sources = self.find_relevant_sources(sentences, self.sources)

        entailed_sentences = []
        hallucinated_sentences = []
        for sentence in sentences:
            # Check if the sentence is entailed by the sources
            is_entailed = self.check_entailment(sentence, relevant_sources)
            if not is_entailed:
                hallucinated_sentences.append(sentence)
            else:
                entailed_sentences.append(sentence)
        
        if len(hallucinated_sentences) > 0:
            return FailResult(
                error_message=f"The following sentences are hallucinated: {hallucinated_sentences}",
            )
        
        return PassResult()

    def split_sentences(self, text: str) -> List[str]:
        if nltk is None:
            raise ImportError(
                "This validator requires the `nltk` package. "
                "Install it with `pip install nltk`, and try again."
            )
        return nltk.sent_tokenize(text)

    def find_relevant_sources(self, sentences: str, sources: List[str]) -> List[str]:
        source_embeds = self.embedding_model.encode(sources)
        sentence_embeds = self.embedding_model.encode(sentences)

        relevant_sources = []

        for sentence_idx in range(len(sentences)):
            # Find the cosine similarity between the sentence and the sources
            sentence_embed = sentence_embeds[sentence_idx, :].reshape(1, -1)
            cos_similarities = np.sum(np.multiply(source_embeds, sentence_embed), axis=1)
            # Find the top 5 sources that are most relevant to the sentence that have a cosine similarity greater than 0.8
            top_sources = np.argsort(cos_similarities)[::-1][:5]
            top_sources = [i for i in top_sources if cos_similarities[i] > 0.8]

            # Return the sources that are most relevant to the sentence
            relevant_sources.extend([sources[i] for i in top_sources])

        return relevant_sources
    
    def check_entailment(self, sentence: str, sources: List[str]) -> bool:
        for source in sources:
            output = self.nli_pipeline({'text': source, 'text_pair': sentence})
            if output['label'] == 'entailment':
                return True
        return False
```