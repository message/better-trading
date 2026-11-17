import { changelog as slug } from '@/package.json';
import type { ChangelogData } from '@/components/ChangelogBanner';

const markdownFiles = import.meta.glob<string>('/changelogs/*.md', { query: '?raw', import: 'default', eager: true });

// The changelog named by the `changelog` field of package.json (same mechanism as 1.9.1), if its file exists
const markdown = markdownFiles[`/changelogs/${slug}.md`];
const currentChangelog: ChangelogData | undefined = markdown ? { slug, markdown } : undefined;

export { currentChangelog };
