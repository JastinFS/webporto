import yaml from 'js-yaml';
import { marked } from 'marked';

marked.use({ gfm: true, breaks: false });

/* ---------- generic markdown-with-frontmatter parsing ---------- */

interface Parsed<T> {
  data: T;
  bodyHtml: string;
  bodyText: string;
}

function parse<T>(raw: string): Parsed<T> {
  let data = {} as T;
  let body = raw;
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (m) {
    data = (yaml.load(m[1]) as T) ?? ({} as T);
    body = m[2] ?? '';
  }
  const bodyText = body.trim();
  return { data, bodyText, bodyHtml: bodyText ? (marked.parse(bodyText) as string) : '' };
}

/* ---------- content models ---------- */

export interface SiteContent {
  name: string;
  navName: string;
  monogram: string;
  roleLine: string;
  heroKicker: string;
  heroFirst: string;
  heroRest: string;
  heroImage: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  cvFile: string;
  year: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface AboutContent {
  eyebrow: string;
  heading: string;
  portrait: string;
  summary: string; // html
  summaryText: string; // plain
  stats: Stat[];
  education: { school: string; degree: string; detail: string };
  experience: { role: string; org: string; period: string; detail: string }[];
}

export interface SkillCard {
  id: string;
  icon: string;
  title: string;
  image: string;
  desc: string;
}

export interface SkillsContent {
  eyebrow: string;
  heading: string;
  hint: string;
  cards: SkillCard[];
  marquee: string[];
}

export interface Project {
  slug: string;
  title: string;
  short: string;
  order: number;
  featured: boolean;
  category: string;
  tags: string[];
  cover: string;
  gallery: string[];
  repo: string;
  demo: string;
  bodyHtml: string;
  bodyText: string;
  excerpt: string;
}

/** Short, markdown-stripped preview of the body for project cards. */
function toExcerpt(text: string): string {
  const flat = text
    .replace(/^[-*]\s+/gm, '')
    .replace(/[*_`#>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (flat.length <= 200) return flat;
  // prefer a sentence boundary within a comfortable range
  const sentence = flat.slice(0, 240).search(/[.!?]\s/);
  if (sentence >= 120) return flat.slice(0, sentence + 1);
  // otherwise trim to the last word before ~190 chars
  const cut = flat.slice(0, 190);
  return cut.slice(0, cut.lastIndexOf(' ')).trimEnd() + '…';
}

/* ---------- eager glob loads ---------- */

const siteRaw = import.meta.glob('/content/site.md', { eager: true, query: '?raw', import: 'default' });
const aboutRaw = import.meta.glob('/content/about.md', { eager: true, query: '?raw', import: 'default' });
const skillsRaw = import.meta.glob('/content/skills.md', { eager: true, query: '?raw', import: 'default' });
const projectRaw = import.meta.glob('/content/projects/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

function first(map: Record<string, unknown>): string {
  const k = Object.keys(map)[0];
  return (map[k] as string) ?? '';
}

export const SITE: SiteContent = parse<SiteContent>(first(siteRaw)).data;

const aboutParsed = parse<Omit<AboutContent, 'summary' | 'summaryText'>>(first(aboutRaw));
export const ABOUT: AboutContent = {
  ...(aboutParsed.data as AboutContent),
  summary: aboutParsed.bodyHtml,
  summaryText: aboutParsed.bodyText,
};

export const SKILLS: SkillsContent = parse<SkillsContent>(first(skillsRaw)).data;

export const PROJECTS: Project[] = Object.entries(projectRaw)
  .map(([path, raw]) => {
    const slug = path.split('/').pop()!.replace(/\.md$/, '');
    const { data, bodyHtml, bodyText } = parse<Partial<Project>>(raw);
    return {
      slug,
      title: data.title ?? slug,
      short: data.short ?? data.title ?? slug,
      order: typeof data.order === 'number' ? data.order : 99,
      featured: !!data.featured,
      category: data.category ?? '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      cover: data.cover ?? '',
      gallery: Array.isArray(data.gallery) ? data.gallery.filter(Boolean) : [],
      repo: data.repo ?? '',
      demo: data.demo ?? '',
      bodyHtml,
      bodyText,
      excerpt: toExcerpt(bodyText),
    } satisfies Project;
  })
  .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
