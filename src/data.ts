// All page content lives here, so editing copy never means touching layout code.

// Playful accent palette (defined as --c-<name> in global.css).
export type Accent = 'coral' | 'blue' | 'green' | 'yellow' | 'teal' | 'grey' | 'purple';

// Hero: "Hey, I'm Ignacio and I …". The first one shows on load; clicks pick another at random.
export const HERO_PHRASES = [
	'do data',
	'build data architectures on AWS with Terraform',
	'help find metrics business can act on',
	'like finding the incentives that make business processes better',
	'enjoy the challenge of turning business knowledge into easy to read documentation',
	'design DBT data quality checks so consumers can trust the data',
	'play guitar and sing',
	'am a scuba diver',
	'build data stacks from scratch',
	'build business models with future change in mind',
	'am always playing with AI to stay at the forefront',
	'bring fun and positive energy to the teams I join',
	'love building little side projects',
];




// ---------- Experience (the filing cabinet) ----------
export type Experience = {
	id: string;
	company: string;
	role: string;
	place: string;
	dates: string;
	startDate: string; // ISO, used by the machine-readable CV
	endDate?: string; // omit = current role
	accent: Accent;
	summary: string;
	highlights: string[];
	stack: string[];
};

export const EXPERIENCE: Experience[] = [
	{
		id: 'natwest',
		company: 'NatWest',
		role: 'Senior Data Engineer (contract)',
		place: 'London, UK',
		dates: 'Oct 2025 – now',
		startDate: '2025-10',
		accent: 'coral',
		summary: 'Shipping data products to the bank’s enterprise data marketplace, in a heavily regulated environment.',
		highlights: [
			'Delivered data products to the enterprise data marketplace, giving self-service access across the bank while meeting internal governance standards. Prioritised requirements by business impact.',
			'Matured the data architecture and data quality practices, championing more efficient tooling like dbt to bring the platform in line with industry best practice.',
			'Investigated and documented legacy processes and undocumented business assumptions, creating a clear knowledge base for governance and onboarding.',
			'Drove adoption of AI-assisted development, coaching colleagues on using it well and freeing up time for architecture and legacy discovery.',
		],
		stack: ['dbt', 'Snowflake', 'Airflow', 'AWS', 'Terraform'],
	},
	{
		id: 'hippo',
		company: 'Hippo',
		role: 'Senior Data Engineer (consultant)',
		place: 'Glasgow, UK',
		dates: 'Feb 2024 – Sep 2025',
		startDate: '2024-02',
		endDate: '2025-09',
		accent: 'blue',
		summary: '~500 dbt models, 1M+ members, 300k queries a day: an event-driven platform I helped design, improve and run.',
		highlights: [
			'Designed and built a secure data exchange hub for ingesting and exporting data across 40+ partner companies, creating one unified, enriched customer view.',
			'Cut SQL query runtimes from hours to minutes by optimising ETL pipelines.',
			'Started from the business use case before building any pipeline.',
			'Made data quality a priority with dbt tests, Monte Carlo monitoring and clear documentation.',
			'Applied Kimball dimensional modelling to define business entities and processes.',
			'Mentored teams on best practice and kept an eye on technical debt.',
		],
		stack: ['dbt', 'Snowflake', 'Airflow', 'dlt', 'AWS', 'Terraform', 'Monte Carlo'],
	},
	{
		id: 'phlo-data',
		company: 'Phlo',
		role: 'Data Engineer & Data Scientist',
		place: 'Glasgow, UK',
		dates: 'Jun 2021 – Feb 2024',
		startDate: '2021-06',
		endDate: '2024-02',
		accent: 'green',
		summary: 'The only data person at a fast-growing online pharmacy. I built the whole data stack, then used it with every team.',
		highlights: [
			'Built the company’s data architecture from scratch with BigQuery, dbt, Airflow, Docker and Airbyte.',
			'Customer service: LTV/RFM prioritisation and churn prediction took churn from 10% to an industry-leading 4%.',
			'Marketing: customer segmentation and campaign design cut acquisition cost by 60%.',
			'Product: introduced A/B testing and KPI monitoring, reducing registration drop-off by 20%.',
			'Pharmacy: time-series demand forecasting reduced stock shortages by 10%; Metabase dashboards exposed workflow bottlenecks.',
			'Finance: automated monthly reporting in Python and surfaced areas of negative profitability.',
			'Data quality through Great Expectations tests, documentation and lightweight governance; cost-optimised SQL with partitions, clustering and incremental models.',
		],
		stack: ['BigQuery', 'dbt', 'Airflow', 'Airbyte', 'Docker', 'Python', 'Metabase', 'Great Expectations'],
	},
	{
		id: 'phlo-dev',
		company: 'Phlo',
		role: 'Full-stack Developer',
		place: 'Glasgow, UK',
		dates: 'Jul 2020 – Jun 2021',
		startDate: '2020-07',
		endDate: '2021-06',
		accent: 'teal',
		summary: 'Built product with designers and product owners. It’s where I picked up the testing habits I now bring to data.',
		highlights: [
			'Delivered product features with product owners and designers using Agile.',
			'Learned industry-standard testing and software practices (unit testing, Jest, React, CSS).',
			'Trained new joiners.',
		],
		stack: ['React', 'Jest', 'TypeScript', 'CSS'],
	},
];

export const EDUCATION = [
	{
		institution: 'University of Glasgow',
		studyType: 'MSc',
		area: 'Data Science',
		place: 'Glasgow, UK',
		dates: '2017 – 2018',
		startDate: '2017-09',
		endDate: '2018-06',
		note: 'Awarded The Data Lab Scholarship. Team project: Bitcoin price prediction with time series.',
	},
	{
		institution: 'ICAI (Universidad Pontificia Comillas)',
		studyType: 'BEng',
		area: 'Electromechanical Engineering',
		place: 'Madrid, Spain',
		dates: '2012 – 2017',
		startDate: '2012-09',
		endDate: '2017-06',
		note: 'Strong grounding in algebra, calculus and statistics.',
	},
];

export const SKILLS = [
	{ name: 'Data engineering', keywords: ['dbt', 'Snowflake', 'BigQuery', 'Airflow', 'dlt', 'Airbyte', 'Terraform', 'AWS', 'GCP', 'Docker'] },
	{ name: 'Analytics & data science', keywords: ['SQL', 'Python', 'Kimball modelling', 'A/B testing', 'Time series', 'Churn modelling', 'Metabase'] },
	{ name: 'Data quality', keywords: ['dbt tests', 'Great Expectations', 'Monte Carlo', 'Documentation'] },
	{ name: 'Software', keywords: ['TypeScript', 'React', 'Jest', 'AI-assisted development'] },
];

// ---------- Projects ----------
export type Status = 'Live' | 'Building' | 'Idea';
export type ProjectArt = 'tube' | 'river' | 'tracker' | 'enricher' | 'genre' | 'geo' | 'newsletter' | 'songbinator';

export const PROJECTS: {
	title: string;
	status: Status;
	blurb: string;
	url?: string;
	/** Optional screenshot in /public, e.g. '/projects/tube.png'. Falls back to the drawn illustration. */
	image?: string;
	art: ProjectArt;
	accent: Accent;
	tags: string[];
}[] = [
	{
		title: 'London Tube Explained',
		status: 'Live',
		blurb: 'An interactive map of the Underground that tells you where all 270 station names come from, and flies a little train between them along the fastest route. I got this idea from a viral trend where people made fun of Tube station names.',
		url: 'https://london-tube-explained.vercel.app/',
		art: 'tube',
		accent: 'coral',
		tags: ['data viz', 'maps', 'history'],
	},
	{
		title: 'Wikipedia River',
		status: 'Building',
		blurb: 'Wikipedia articles float down a river and you fish them out. Infinite scrolling makes me anxious, so here is something relaxing for once.',
		art: 'river',
		accent: 'teal',
		tags: ['creative', 'wikipedia'],
	},
	{
		title: 'London Activities Tracker',
		status: 'Live',
		blurb: 'My own tool for keeping track of fun things to do in London.',
		art: 'tracker',
		accent: 'green',
		tags: ['AI-built', 'personal tool'],
	},
	// {
	// 	title: 'LinkedIn Company Enricher',
	// 	status: 'Live',
	// 	blurb: 'Takes a list of companies and enriches it with public LinkedIn data.',
	// 	art: 'enricher',
	// 	accent: 'blue',
	// 	tags: ['python', 'scraping'],
	// },
	// {
	// 	title: 'Song Genre Prediction',
	// 	status: 'Live',
	// 	blurb: 'A machine learning model that guesses a song’s genre from its audio features.',
	// 	art: 'genre',
	// 	accent: 'purple',
	// 	tags: ['ML', 'music'],
	// },
	// {
	// 	title: 'Tweet Geolocation Spain',
	// 	status: 'Live',
	// 	blurb: 'Predicts where in Spain a tweet was written, just from its text.',
	// 	art: 'geo',
	// 	accent: 'yellow',
	// 	tags: ['NLP', 'ML'],
	// },
	// {
	// 	title: 'Wikipedia Newsletter',
	// 	status: 'Live',
	// 	blurb: 'A newsletter of interesting Wikipedia articles, delivered automatically.',
	// 	art: 'newsletter',
	// 	accent: 'grey',
	// 	tags: ['automation', 'wikipedia'],
	// },
	{
		title: 'Songbinator',
		status: 'Live',
		blurb: 'Give it a few songs and it builds one playlist that mixes in similar artists for each of them. Made for road trips where everyone wants their own music on, so there is no fights.',
		art: 'songbinator',
		accent: 'coral',
		tags: ['music', 'creative'],
	},
];

// ---------- Values / ways of working ----------
export const VALUES = [
	// incentives. Like business
	{ title: 'Problem before pipeline', text: 'I start with the people, not the tables. What decision are they trying to make, and what is slowing them down?' },
	{ title: 'Own it end to end', text: 'Find the problem, talk to stakeholders, design the solution, build it, then watch how it actually gets used.' },
	{ title: 'Write it down', text: 'I write the docs nobody else wants to. In a world of AI agents, clear context is a superpower.' },
	{ title: 'Small team, fast loops', text: 'A whiteboard, a few curious people, light process. Sketch it, ship it, learn, repeat.' },
	{ title: 'Embrace the chaos', text: 'Modelling data reduces entropy. Making decisions with it often means exploring the mess first.' },
	{ title: 'Make it fun', text: 'Brainstorms, bad puns and good energy. I like teams where people enjoy showing up.' },
];

// ---------- How I work: the stack of notes you read, scrunch up and bin ----------
// kind 'mine' = my own words; 'enjoy' = something I enjoy doing; 'quote' = something I read elsewhere and keep coming back to.
// Add `source` to a quote to credit it on the paper.
export type Note = { kind: 'mine' | 'enjoy' | 'quote'; text: string; source?: string };

export const NOTES: Note[] = [
	{
		kind: 'mine',
		text: 'Before picking which problem to solve first, I always ask which one will have the biggest impact. Big fan of the 80/20 rule.',
	},
	{
		kind: 'mine',
		text: 'In the AI era, documentation matters more than ever. I enjoy the challenge of writing for the audience in front of me.',
	},
	{
		kind: 'mine',
		text: 'In remote teams overcommunication is key',
	},
	{ kind: 'enjoy', text: 'Brainstorming a messy problem with a small team.' },
	{ kind: 'enjoy', text: 'Turning vague questions into the right metrics.' },
	{ kind: 'enjoy', text: 'Helping non-technical people do their jobs better.' },
	{ kind: 'enjoy', text: 'Finding fun, visual ways to explore information.' },
	{ kind: 'enjoy', text: 'Building small tools with AI to fix my own problems.' },
	{ kind: 'enjoy', text: 'UX and design, not just the data underneath.' },
	{ kind: 'quote', text: 'The goal is always to build a robust pipeline… from “exciting” to “boring”.' },
	{
		kind: 'quote',
		text: 'Most of the work we do in data is in an effort to reduce entropy — we model data to remove inaccuracies, we turn commonly asked questions into self-serve reports, and we funnel ad-hoc questions into a formalized request process. This kind of attitude is in our nature as data practitioners and largely serves us well. But in the case of driving decisions with data, we need to challenge our instincts and embrace the chaos.',
	},
	{ kind: 'quote', text: 'Success is helping on making decisions fast, not delivering data.' },
	{
		kind: 'quote',
		text: 'Our job is not to convince others of the value of research – it’s to create value through uncovering information that can change minds.',
	},
	{
		kind: 'quote',
		text: 'The data engineer becomes almost like the keeper of good data habits. For instance, if an analytics engineer reprocesses the warehouse at every run with dbt, they can develop bad habits. The data engineer is the gatekeeper, responsible for educating data teams on best practices, most notably around efficiency (handling incremental loads), data modeling, and coding standards, and relying on data observability and DataOps to ensure that everyone is treating data with the same diligence.',
	},
	{
		kind: 'quote',
		text: 'One thing that worked really well was the ability to create alignment with stakeholders early in the process by writing up clear requirements documents. Scope creep for data tool development is so common, especially when the tool is expected to magically answer any question they might have of the data. Establishing early on what exactly we were going to build and what set of questions that particular data model would answer saved us some frustrating conversations down the line.',
	},
];
