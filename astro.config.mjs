// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://ignaciovi.github.io', // keep in sync with src/site.ts
	integrations: [mdx(), sitemap()],
});
