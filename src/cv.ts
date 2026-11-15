// Builds the CV in JSON Resume format (https://jsonresume.org/schema) from the site content,
// so the human page, the machine view and /cv.json never drift apart.
import { SITE } from './site';
import { EXPERIENCE, EDUCATION, SKILLS, PROJECTS, VALUES } from './data';

export function buildResume() {
	return {
		$schema: 'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
		basics: {
			name: SITE.name,
			label: SITE.role,
			email: SITE.email,
			url: SITE.url,
			summary: SITE.description,
			location: { city: 'London', countryCode: 'GB' },
			profiles: [
				{ network: 'GitHub', url: SITE.links.github },
				{ network: 'LinkedIn', url: SITE.links.linkedin },
			],
		},
		work: EXPERIENCE.map((e) => ({
			name: e.company,
			position: e.role,
			location: e.place,
			startDate: e.startDate,
			...(e.endDate ? { endDate: e.endDate } : {}),
			summary: e.summary,
			highlights: e.highlights,
			keywords: e.stack,
		})),
		education: EDUCATION.map((ed) => ({
			institution: ed.institution,
			studyType: ed.studyType,
			area: ed.area,
			startDate: ed.startDate,
			endDate: ed.endDate,
			courses: [ed.note],
		})),
		skills: SKILLS,
		projects: PROJECTS.map((p) => ({
			name: p.title,
			description: p.blurb,
			...(p.url ? { url: p.url } : {}),
			keywords: p.tags,
		})),
		interests: [
			{ name: 'Music', keywords: ['guitar', 'singing', 'open mics', 'live looping (Boss RC-500)'] },
			{ name: 'Scuba diving', keywords: ['Advanced certified', 'worked two months at a dive centre in Malta'] },
		],
		meta: { workingStyle: VALUES.map((v) => v.title) },
	};
}
