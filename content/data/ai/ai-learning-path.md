---
title: AI Learning path
date: 2025-06-12
ready: true
publish: true
---

List of topics to study that I'm interested in:
1. Build a foundation in AI, as knowing machine learning concepts will improve my capability to develop better pipelines and infrastructure, even if I am not training the models
2. LLM guardrails
3. LLM evaluation
4. Get experience deploying and maintaining LLM-based and machine learning solutions in production using tools like MLflow and SageMaker
5. LLM fine-tuning
6. Prompting
7. RAGs
8. MLOps + Model Deployment
9. MCP
10. Building AI agents
11. Understand feature stores, real-time pipelines (like Kafka and Flink), and serving architectures.




Rough idea of study plan:

|Month|Focus Area|Weekly Plan|Resources / Tools|Project|
|---|---|---|---|---|
|**1**|**ML & DL Foundations**|W1–2: Core ML (regression, trees)W3–4: Intro to Deep Learning (NNs, backprop)|🎓 [Andrew Ng ML](https://www.coursera.org/learn/machine-learning)🎓 [FastAI DL](https://course.fast.ai/)|Build & deploy a regression model (e.g., housing prices) using FastAPI|
|**2**|**Deep Learning + Transformers**|W5–6: PyTorch BasicsW7–8: Transformers, Attention|🎓 [PyTorch Course](https://www.coursera.org/learn/deep-learning-pytorch)📘 [Hugging Face](https://huggingface.co/learn)|Sentiment classifier with BERT (Hugging Face + PyTorch)|
|**3**|**LLMs, Prompting, RAG**|W9: Prompt Engineering + OpenAIW10: Embeddings + Vector SearchW11–12: LangChain + RAG|🛠️ [OpenAI Cookbook](https://github.com/openai/openai-cookbook)📘 [LangChain Docs](https://docs.langchain.com/)|RAG Chatbot using your data + LangChain + ChromaDB|
|**4**|**LLM Fine-Tuning**|W13: LoRA/QLoRA TheoryW14–16: Fine-tune a small LLM|🧠 [PEFT + Datasets](https://huggingface.co/learn/nlp-course/)🧪 [LoRA Fine-tuning](https://github.com/huggingface/peft)|Fine-tune Mistral/LLama on internal domain data|
|**5**|**MLOps + Model Deployment**|W17: Model Serving (FastAPI, Docker)W18: Experiment Tracking (MLflow)W19–20: Monitoring & UI|🛠️ [BentoML](https://docs.bentoml.org/)🎓 [MLflow Guide](https://mlflow.org/docs/latest/quickstart.html)|Deploy model via Docker + monitor with MLflow + Gradio UI|
|**6**|**Capstone Project**|Pick 1-2 ideas and build from scratch|Use combined stack: OpenAI, Hugging Face, ChromaDB, Docker, FastAPI, Streamlit/Gradio|Options:1. Enterprise RAG app2. LLM-powered ETL assistant3. Fine-tuned custom support bot|

