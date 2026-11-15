import type { APIRoute } from 'astro';
import { buildResume } from '../cv';

export const GET: APIRoute = () =>
	new Response(JSON.stringify(buildResume(), null, 2), {
		headers: { 'Content-Type': 'application/json; charset=utf-8' },
	});
