// Single source of truth for identity and links used across the site.
// TODO: replace placeholder values (marked TODO) before launch.
export const SITE = {
	url: 'https://ignaciovi.github.io',
	name: 'Ignacio Valdelvira Isla',
	role: 'Data Engineer',
	location: 'London, UK',
	description:
		'Data Engineer who starts with the problem, not the pipeline. dbt, Snowflake and Airflow at enterprise scale, with a startup instinct for owning problems end to end.',
	email: 'ignvaldelvira@gmail.com',
	links: {
		github: 'https://github.com/ignaciovi',
		linkedin: 'https://www.linkedin.com/in/ignaciovaldelviraisla/',
		cv: '', // TODO: add public/cv.pdf and set to '/cv.pdf' to show the CV button
	},
};

export const NAV = [
	{ href: '/#experience', label: 'Experience' },
	{ href: '/#projects', label: 'Projects' },
	{ href: '/#values', label: 'How I work' },
	// { href: '/#about', label: 'About' }, // section hidden for now
];
