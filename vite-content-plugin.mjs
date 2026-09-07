/**
 * Build-time content pipeline.
 *
 * Parses content/*.md (YAML front-matter + Markdown body) on the server
 * with js-yaml + marked, and exposes the finished plain objects through the
 * virtual module `virtual:portfolio-content`.  Neither js-yaml nor marked
 * ends up in the browser bundle.  HMR re-runs on any content/ change.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import yaml from 'js-yaml';
import { marked } from 'marked';

marked.use({ gfm: true, breaks: false });

const VIRTUAL_ID = 'virtual:portfolio-content';
const RESOLVED_ID = '\0' + VIRTUAL_ID;

function parse(raw) {
  let data = {};
  let body = raw;
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (m) {
    data = yaml.load(m[1]) ?? {};
    body = m[2] ?? '';
  }
  const bodyText = body.trim();
  return { data, bodyText, bodyHtml: bodyText ? marked.parse(bodyText) : '' };
}

function toExcerpt(text) {
  const flat = text
    .replace(/^[-*]\s+/gm, '')
    .replace(/[*_`#>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (flat.length <= 200) return flat;
  const sentence = flat.slice(0, 240).search(/[.!?]\s/);
  if (sentence >= 120) return flat.slice(0, sentence + 1);
  const cut = flat.slice(0, 190);
  return cut.slice(0, cut.lastIndexOf(' ')).trimEnd() + '…';
}

function build(root) {
  const dir = resolve(root, 'content');
  const read = (p) => readFileSync(join(dir, p), 'utf8');

  const site = parse(read('site.md')).data;

  const a = parse(read('about.md'));
  const about = { ...a.data, summary: a.bodyHtml, summaryText: a.bodyText };

  const skills = parse(read('skills.md')).data;

  const projDir = join(dir, 'projects');
  const projects = readdirSync(projDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const slug = f.replace(/\.md$/, '');
      const { data, bodyHtml, bodyText } = parse(readFileSync(join(projDir, f), 'utf8'));
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
      };
    })
    .sort((x, y) => x.order - y.order || x.title.localeCompare(y.title));

  return { site, about, skills, projects };
}

export default function portfolioContent() {
  let root = process.cwd();
  return {
    name: 'portfolio-content',
    configResolved(cfg) {
      root = cfg.root;
    },
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
    },
    load(id) {
      if (id !== RESOLVED_ID) return;
      const { site, about, skills, projects } = build(root);
      return (
        `export const SITE = ${JSON.stringify(site)};\n` +
        `export const ABOUT = ${JSON.stringify(about)};\n` +
        `export const SKILLS = ${JSON.stringify(skills)};\n` +
        `export const PROJECTS = ${JSON.stringify(projects)};\n`
      );
    },
    handleHotUpdate(ctx) {
      if (ctx.file.includes('/content/') || ctx.file.includes('\\content\\')) {
        const mod = ctx.server.moduleGraph.getModuleById(RESOLVED_ID);
        if (mod) {
          ctx.server.moduleGraph.invalidateModule(mod);
          return [mod, ...ctx.modules];
        }
      }
    },
  };
}
