/**
 * Content is parsed at build time by ./vite-content-plugin.mjs and served
 * through the `virtual:portfolio-content` module — no YAML/Markdown parser
 * ships to the browser. This file only re-exports it with types.
 */
// @ts-expect-error — provided by the Vite plugin at build time
import { SITE as _SITE, ABOUT as _ABOUT, SKILLS as _SKILLS, PROJECTS as _PROJECTS } from 'virtual:portfolio-content';

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
  formAccessKey: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface AboutContent {
  eyebrow: string;
  heading: string;
  portrait: string;
  summary: string;
  summaryText: string;
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

export const SITE: SiteContent = _SITE;
export const ABOUT: AboutContent = _ABOUT;
export const SKILLS: SkillsContent = _SKILLS;
export const PROJECTS: Project[] = _PROJECTS;
