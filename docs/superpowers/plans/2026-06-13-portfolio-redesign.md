# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild me-anmol.github.io as an IntelliJ Darcula + Vim-themed single-page portfolio using Astro + Tailwind CSS, targeting US/international recruiters.

**Architecture:** Single Astro page with four content sections (README.md, experience.java, skills.json, contact.md) rendered inside a fake IDE shell — sidebar, tab bar, line-numbered editor, and Vim statusbar. Static HTML output deployed via GitHub Actions to GitHub Pages (`gh-pages` branch).

**Tech Stack:** Astro 4, Tailwind CSS 3, JetBrains Mono (Google Fonts), Playwright (E2E), GitHub Actions

---

## File Map

| File | Purpose |
|---|---|
| `package.json` | Astro + Tailwind + Playwright deps |
| `astro.config.mjs` | Astro config: Tailwind integration, static adapter, base path |
| `tailwind.config.mjs` | Content paths, Darcula color aliases |
| `tsconfig.json` | TypeScript strict config |
| `src/styles/global.css` | Darcula CSS vars, syntax highlight classes, base reset |
| `src/layouts/IDELayout.astro` | Full IDE shell: titlebar + sidebar + tabbar + editor + statusbar |
| `src/components/Titlebar.astro` | Window titlebar: traffic lights + project name |
| `src/components/Sidebar.astro` | PROJECT file tree + STRUCTURE outline |
| `src/components/TabBar.astro` | File tabs with active-state underline |
| `src/components/EditorArea.astro` | Gutter + content wrapper (takes slot) |
| `src/components/VimStatusBar.astro` | Vim mode indicator + filename + Ln/Col |
| `src/sections/ReadmeSection.astro` | README.md content, markdown syntax-highlighted |
| `src/sections/ExperienceSection.astro` | experience.java content, Java syntax-highlighted |
| `src/sections/SkillsSection.astro` | skills.json content, JSON syntax-highlighted |
| `src/sections/ContactSection.astro` | contact.md content |
| `src/scripts/ide.ts` | Tab switching, scroll tracking, vim mode flash |
| `src/scripts/typing.ts` | README hero typing animation |
| `src/pages/index.astro` | Main page — wires all components |
| `.github/workflows/deploy.yml` | Build Astro → deploy `dist/` to `gh-pages` branch |
| `public/resume.pdf` | Resume (copied from `assets/img/resume.pdf`) |
| `playwright.config.ts` | Playwright base config |
| `tests/portfolio.spec.ts` | E2E smoke tests |

**Deleted at end:** `index.html`, `assets/` (Bootstrap, fonts, old images — resume moved to `public/`)

---

## Task 1: Initialize Astro project

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tailwind.config.mjs`
- Create: `tsconfig.json`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "me-anmol-portfolio",
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "playwright test"
  },
  "dependencies": {
    "astro": "^4.15.0",
    "@astrojs/tailwind": "^5.1.0",
    "tailwindcss": "^3.4.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.47.0",
    "typescript": "^5.5.0"
  }
}
```

- [ ] **Step 2: Create astro.config.mjs**

```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  output: 'static',
});
```

- [ ] **Step 3: Create tailwind.config.mjs**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },
      colors: {
        'darcula-bg':        '#2B2B2B',
        'darcula-panel':     '#3C3F41',
        'darcula-gutter-bg': '#313335',
        'darcula-gutter':    '#606366',
        'darcula-text':      '#A9B7C6',
        'darcula-keyword':   '#CC7832',
        'darcula-string':    '#6A8759',
        'darcula-number':    '#6897BB',
        'darcula-comment':   '#808080',
        'darcula-select':    '#214283',
        'darcula-line':      '#323232',
        'darcula-green':     '#629755',
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 4: Create tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

- [ ] **Step 5: Create src/ directory structure**

```bash
mkdir -p src/{layouts,components,sections,scripts,styles,pages}
mkdir -p public tests .github/workflows
```

- [ ] **Step 6: Install dependencies**

```bash
npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 7: Create placeholder index.astro to verify build**

`src/pages/index.astro`:
```astro
---
---
<html><body><p>hello</p></body></html>
```

- [ ] **Step 8: Verify Astro builds**

```bash
npm run build
```

Expected: `dist/index.html` created, no errors.

- [ ] **Step 9: Commit**

```bash
git add package.json astro.config.mjs tailwind.config.mjs tsconfig.json src/ public/ tests/ .github/
git commit -m "chore: scaffold Astro project with Tailwind"
```

---

## Task 2: Global CSS — Darcula design tokens + syntax highlight classes

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: Create global.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');

:root {
  --bg:        #2B2B2B;
  --panel:     #3C3F41;
  --gutter-bg: #313335;
  --gutter:    #606366;
  --text:      #A9B7C6;
  --kw:        #CC7832;
  --str:       #6A8759;
  --num:       #6897BB;
  --cmt:       #808080;
  --sel:       #214283;
  --line:      #323232;
  --fn:        #FFC66D;
  --cls:       #A9B7C6;
  --ann:       #BBB529;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  height: 100%;
  background: var(--bg);
  color: var(--text);
  font-family: 'JetBrains Mono', Consolas, monospace;
  font-size: 13px;
  line-height: 1.6;
  overflow: hidden;
}

/* Syntax highlight classes — used in section components */
.kw  { color: var(--kw); }
.str { color: var(--str); }
.num { color: var(--num); }
.cmt { color: var(--cmt); font-style: italic; }
.fn  { color: var(--fn); }
.cls { color: var(--cls); }
.ann { color: var(--ann); }
.key { color: var(--kw); }

/* JSON */
.jkey { color: var(--kw); }
.jstr { color: var(--str); }
.jpunct { color: var(--text); }

/* Markdown */
.md-h1    { color: var(--kw); font-weight: 700; }
.md-h2    { color: var(--kw); font-weight: 700; }
.md-bold  { color: var(--text); font-weight: 700; }
.md-italic { color: var(--cmt); font-style: italic; }
.md-quote { color: var(--cmt); font-style: italic; }
.md-link  { color: var(--str); text-decoration: underline; }
.md-link:hover { color: var(--num); }

/* Scrollbar */
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: #555; border-radius: 4px; }
```

- [ ] **Step 2: Import global.css in index.astro**

Replace `src/pages/index.astro` with:
```astro
---
import '../styles/global.css';
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Anmol Badi — Software Engineer</title>
  </head>
  <body>
    <p style="color: var(--kw)">syntax color test</p>
  </body>
</html>
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: no errors, `dist/index.html` contains the JetBrains Mono font import.

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css src/pages/index.astro
git commit -m "feat: add Darcula design tokens and syntax highlight CSS"
```

---

## Task 3: Titlebar component

**Files:**
- Create: `src/components/Titlebar.astro`

- [ ] **Step 1: Create Titlebar.astro**

```astro
---
---
<div class="titlebar">
  <div class="traffic-lights">
    <span class="dot dot-red"></span>
    <span class="dot dot-yellow"></span>
    <span class="dot dot-green"></span>
  </div>
  <span class="title-text">anmol — portfolio</span>
</div>

<style>
.titlebar {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--panel);
  height: 38px;
  padding: 0 16px;
  border-bottom: 1px solid #1e1e1e;
  flex-shrink: 0;
  user-select: none;
}
.traffic-lights {
  display: flex;
  gap: 6px;
}
.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
.dot-red    { background: #FF5F57; }
.dot-yellow { background: #FEBC2E; }
.dot-green  { background: #28C840; }
.title-text {
  font-size: 12px;
  color: var(--gutter);
  flex: 1;
  text-align: center;
}
</style>
```

- [ ] **Step 2: Use Titlebar in index.astro to verify it renders**

```astro
---
import '../styles/global.css';
import Titlebar from '../components/Titlebar.astro';
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Anmol Badi — Software Engineer</title>
  </head>
  <body style="display:flex;flex-direction:column;height:100vh;">
    <Titlebar />
  </body>
</html>
```

- [ ] **Step 3: Build and verify**

```bash
npm run build
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Titlebar.astro src/pages/index.astro
git commit -m "feat: add IDE titlebar with traffic lights"
```

---

## Task 4: Vim statusbar component

**Files:**
- Create: `src/components/VimStatusBar.astro`

- [ ] **Step 1: Create VimStatusBar.astro**

```astro
---
---
<div class="statusbar" id="vim-statusbar">
  <span class="mode" id="vim-mode">-- NORMAL --</span>
  <span class="filename" id="vim-filename">anmol/README.md</span>
  <span class="right-info">
    <span>UTF-8</span>
    <span>LF</span>
    <span id="vim-ln">Ln 1, Col 1</span>
  </span>
</div>

<style>
.statusbar {
  display: flex;
  align-items: center;
  background: var(--sel);
  height: 22px;
  padding: 0 8px;
  flex-shrink: 0;
  font-size: 12px;
  color: #ccc;
  gap: 16px;
  user-select: none;
}
.mode {
  color: #9ac;
  font-weight: 700;
  min-width: 110px;
}
.mode.insert { color: #87d75f; }
.filename {
  flex: 1;
  text-align: center;
  color: var(--text);
}
.right-info {
  display: flex;
  gap: 12px;
  color: var(--gutter);
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/VimStatusBar.astro
git commit -m "feat: add Vim statusbar component"
```

---

## Task 5: Sidebar component

**Files:**
- Create: `src/components/Sidebar.astro`

- [ ] **Step 1: Create Sidebar.astro**

```astro
---
const files = [
  { name: 'README.md',       id: 'readme',     icon: '📄' },
  { name: 'experience.java', id: 'experience', icon: '📄' },
  { name: 'skills.json',     id: 'skills',     icon: '📄' },
  { name: 'contact.md',      id: 'contact',    icon: '📄' },
];

const outline = [
  { label: 'Summary',    target: 'readme' },
  { label: 'Experience', target: 'experience' },
  { label: 'Skills',     target: 'skills' },
  { label: 'Contact',    target: 'contact' },
];
---

<div class="sidebar" id="sidebar">
  <div class="panel-header">PROJECT</div>
  <div class="file-tree">
    <div class="folder-row">
      <span class="folder-icon">▼</span>
      <span class="folder-name">anmol</span>
    </div>
    {files.map(f => (
      <button
        class="file-row"
        data-file-id={f.id}
        data-filename={`anmol/${f.name}`}
        aria-label={`Navigate to ${f.name}`}
      >
        <span class="indent"></span>
        <span class="file-icon">{f.icon}</span>
        <span class="file-name">{f.name}</span>
      </button>
    ))}
  </div>

  <div class="panel-header structure-header">STRUCTURE</div>
  <div class="outline">
    {outline.map(o => (
      <button class="outline-row" data-target={o.target}>
        {o.label}
      </button>
    ))}
  </div>
</div>

<style>
.sidebar {
  width: 220px;
  min-width: 220px;
  background: var(--panel);
  display: flex;
  flex-direction: column;
  border-right: 1px solid #1e1e1e;
  overflow-y: auto;
  flex-shrink: 0;
}
.panel-header {
  font-size: 11px;
  font-weight: 700;
  color: var(--gutter);
  padding: 8px 12px 4px;
  letter-spacing: 0.08em;
}
.structure-header { margin-top: 12px; }
.folder-row {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 12px;
  font-size: 12px;
  color: var(--text);
}
.folder-icon { font-size: 10px; color: var(--gutter); }
.file-row, .outline-row {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 12px;
  width: 100%;
  background: none;
  border: none;
  color: var(--text);
  font-family: inherit;
  font-size: 12px;
  cursor: pointer;
  text-align: left;
}
.file-row:hover, .outline-row:hover {
  background: var(--sel);
}
.file-row.active { background: var(--sel); }
.indent { width: 16px; flex-shrink: 0; }
.file-icon { font-size: 11px; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Sidebar.astro
git commit -m "feat: add IDE sidebar with file tree and structure outline"
```

---

## Task 6: Tab bar component

**Files:**
- Create: `src/components/TabBar.astro`

- [ ] **Step 1: Create TabBar.astro**

```astro
---
const tabs = [
  { name: 'README.md',       id: 'readme' },
  { name: 'experience.java', id: 'experience' },
  { name: 'skills.json',     id: 'skills' },
  { name: 'contact.md',      id: 'contact' },
];
---

<div class="tabbar" id="tabbar">
  {tabs.map((t, i) => (
    <button
      class:list={['tab', { active: i === 0 }]}
      data-tab-id={t.id}
      data-filename={`anmol/${t.name}`}
      aria-label={`Tab: ${t.name}`}
    >
      <span class="tab-name">{t.name}</span>
      <span class="tab-close" aria-hidden="true">×</span>
    </button>
  ))}
</div>

<style>
.tabbar {
  display: flex;
  background: var(--panel);
  border-bottom: 1px solid #1e1e1e;
  overflow-x: auto;
  flex-shrink: 0;
  scrollbar-width: none;
}
.tabbar::-webkit-scrollbar { display: none; }
.tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: var(--bg);
  border: none;
  border-right: 1px solid #1e1e1e;
  border-bottom: 2px solid transparent;
  color: var(--gutter);
  font-family: inherit;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
}
.tab.active {
  color: var(--text);
  border-bottom-color: var(--num);
  background: var(--bg);
}
.tab-close {
  opacity: 0.4;
  font-size: 14px;
  line-height: 1;
}
.tab:hover .tab-close { opacity: 0.8; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/TabBar.astro
git commit -m "feat: add IDE tab bar component"
```

---

## Task 7: Editor area component

**Files:**
- Create: `src/components/EditorArea.astro`

- [ ] **Step 1: Create EditorArea.astro**

The editor wraps all sections. Each section child renders its own gutter + content. The editor area itself is just the scroll container.

```astro
---
---
<div class="editor-area" id="editor-area">
  <slot />
</div>

<style>
.editor-area {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background: var(--bg);
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/EditorArea.astro
git commit -m "feat: add editor area scroll container"
```

---

## Task 8: IDE layout — wire all shell components

**Files:**
- Create: `src/layouts/IDELayout.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create IDELayout.astro**

```astro
---
import Titlebar from '../components/Titlebar.astro';
import Sidebar from '../components/Sidebar.astro';
import TabBar from '../components/TabBar.astro';
import EditorArea from '../components/EditorArea.astro';
import VimStatusBar from '../components/VimStatusBar.astro';
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Anmol Badi — Software Engineer</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
    <slot name="head" />
  </head>
  <body>
    <div class="ide-window">
      <Titlebar />
      <div class="ide-body">
        <Sidebar />
        <div class="ide-right">
          <TabBar />
          <EditorArea>
            <slot />
          </EditorArea>
        </div>
      </div>
      <VimStatusBar />
    </div>
    <slot name="scripts" />
  </body>
</html>

<style is:global>
.ide-window {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
.ide-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}
.ide-right {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}
</style>
```

- [ ] **Step 2: Update index.astro to use the layout**

```astro
---
import IDELayout from '../layouts/IDELayout.astro';
import '../styles/global.css';
---
<IDELayout>
  <div style="padding: 32px; color: var(--text);">
    Editor content goes here
  </div>
</IDELayout>
```

- [ ] **Step 3: Build and verify**

```bash
npm run build
```

Expected: no errors. Open `dist/index.html` and confirm the IDE shell structure is present.

- [ ] **Step 4: Commit**

```bash
git add src/layouts/IDELayout.astro src/pages/index.astro
git commit -m "feat: wire IDE layout shell with all panels"
```

---

## Task 9: Section wrapper — gutter + content

Each section component renders a gutter (line numbers) alongside its code content. Define a reusable pattern here that all four sections follow.

**Files:**
- No separate component — each section uses this inline pattern

The pattern each section uses:

```html
<section class="editor-section" id="{id}" data-filename="anmol/{filename}">
  <div class="gutter" aria-hidden="true">
    <!-- line number spans generated by Astro -->
  </div>
  <div class="code-content">
    <!-- highlighted code -->
  </div>
</section>
```

CSS (add to `src/styles/global.css`):

- [ ] **Step 1: Add section CSS to global.css**

Append to `src/styles/global.css`:

```css
/* Editor sections */
.editor-section {
  display: flex;
  border-bottom: 1px solid #1e1e1e;
  padding-bottom: 48px;
}
.gutter {
  min-width: 48px;
  background: var(--gutter-bg);
  color: var(--gutter);
  font-size: 12px;
  line-height: 1.6;
  padding: 24px 8px 24px 0;
  text-align: right;
  user-select: none;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}
.gutter span { display: block; }
.code-content {
  flex: 1;
  padding: 24px 32px 24px 16px;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 13px;
  line-height: 1.6;
}
.code-content:hover .code-line:hover {
  background: var(--line);
}
.code-line { display: block; }
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add editor section gutter and code layout CSS"
```

---

## Task 10: README.md section

**Files:**
- Create: `src/sections/ReadmeSection.astro`

- [ ] **Step 1: Create ReadmeSection.astro**

The hero content. Line count: 22. Mark the typing-animation target with `id="readme-typed"` on the content div.

```astro
---
function lines(n: number) {
  return Array.from({ length: n }, (_, i) => i + 1);
}
const lineCount = 22;
---

<section class="editor-section" id="readme" data-filename="anmol/README.md">
  <div class="gutter" aria-hidden="true">
    {lines(lineCount).map(n => <span>{n}</span>)}
  </div>
  <div class="code-content" id="readme-content">
    <span class="code-line"><span class="md-h1"># Anmol Badi</span></span>
    <span class="code-line"></span>
    <span class="code-line"><span class="md-bold">**Software Engineer**</span> · Platform &amp; Infrastructure</span>
    <span class="code-line"><span class="md-italic">_CRED · Bangalore · Open to US/Remote_</span></span>
    <span class="code-line"></span>
    <span class="code-line"><span class="md-quote">&gt; Software engineer with 3+ years designing and scaling production</span></span>
    <span class="code-line"><span class="md-quote">&gt; systems at CRED — a fintech platform serving <span class="num">16M</span> users and</span></span>
    <span class="code-line"><span class="md-quote">&gt; processing <span class="num">50M+</span> credit card statements monthly.</span></span>
    <span class="code-line"><span class="md-quote">&gt; Specializes in distributed systems and LLM agent orchestration.</span></span>
    <span class="code-line"></span>
    <span class="code-line"><span class="md-link"><a href="https://github.com/me-anmol" target="_blank" rel="noopener" class="md-link">GitHub</a></span> · <span class="md-link"><a href="https://linkedin.com/in/me-anmol" target="_blank" rel="noopener" class="md-link">LinkedIn</a></span> · <span class="md-link"><a href="mailto:anmolbadi@gmail.com" class="md-link">Email</a></span> · <span class="md-link"><a href="/resume.pdf" target="_blank" rel="noopener" class="md-link">Resume ↓</a></span></span>
    <span class="code-line"></span>
    <span class="code-line"><span class="cmt">---</span></span>
    <span class="code-line"></span>
    <span class="code-line"><span class="md-h2">## Education</span></span>
    <span class="code-line"></span>
    <span class="code-line"><span class="md-bold">**B.M.S. Institute of Technology**</span> · Bangalore, India</span>
    <span class="code-line"><span class="md-italic">_Bachelor of Engineering, Computer Science and Engineering · 2022_</span></span>
    <span class="code-line"></span>
    <span class="code-line"><span class="cmt">&gt; Scroll down or click a file in the sidebar to navigate.</span></span>
    <span class="code-line"></span>
    <span class="code-line"></span>
  </div>
</section>
```

- [ ] **Step 2: Import ReadmeSection in index.astro**

```astro
---
import IDELayout from '../layouts/IDELayout.astro';
import '../styles/global.css';
import ReadmeSection from '../sections/ReadmeSection.astro';
---
<IDELayout>
  <ReadmeSection />
</IDELayout>
```

- [ ] **Step 3: Build and verify**

```bash
npm run build
```

Expected: no errors. `dist/index.html` contains `# Anmol Badi`.

- [ ] **Step 4: Commit**

```bash
git add src/sections/ReadmeSection.astro src/pages/index.astro
git commit -m "feat: add README.md section with markdown highlighting"
```

---

## Task 11: experience.java section

**Files:**
- Create: `src/sections/ExperienceSection.astro`

- [ ] **Step 1: Create ExperienceSection.astro**

Line count: 68. Three employer blocks separated by blank lines.

```astro
---
function lines(n: number) {
  return Array.from({ length: n }, (_, i) => i + 1);
}
const lineCount = 68;
---

<section class="editor-section" id="experience" data-filename="anmol/experience.java">
  <div class="gutter" aria-hidden="true">
    {lines(lineCount).map(n => <span>{n}</span>)}
  </div>
  <div class="code-content">
    <span class="code-line"><span class="ann">@Company</span>(<span class="key">name</span> = <span class="str">"CRED"</span>, <span class="key">period</span> = <span class="str">"Apr 2024 – Present"</span>)</span>
    <span class="code-line"><span class="kw">public class</span> <span class="cls">SoftwareEngineer</span> <span class="kw">extends</span> <span class="cls">PlatformAndInfrastructure</span> &#123;</span>
    <span class="code-line"></span>
    <span class="code-line">    <span class="cmt">// BBPS Bank Onboarding Agent</span></span>
    <span class="code-line">    <span class="cmt">// LLM agent across 5 microservices → 6 banks onboarded (BOI, Bandhan, DCB Edge, ESAF, Jupiter Edge, SBM)</span></span>
    <span class="code-line">    <span class="cmt">// 7-hour process → under 1 hour. Live in production.</span></span>
    <span class="code-line">    <span class="kw">public</span> <span class="cls">Agent</span> <span class="fn">bbpsOnboardingAgent</span>() &#123;</span>
    <span class="code-line">        <span class="kw">return new</span> <span class="cls">LLMAgent</span>(banks = <span class="num">6</span>, timeReduction = <span class="str">"7h → 1h"</span>);</span>
    <span class="code-line">    &#125;</span>
    <span class="code-line"></span>
    <span class="code-line">    <span class="cmt">// SLTForge — Service Level Testing Platform</span></span>
    <span class="code-line">    <span class="cmt">// WireMock · MySQL · SQS · Aerospike · LLM agent (Claude Code + Daytona)</span></span>
    <span class="code-line">    <span class="cmt">// Kubernetes sandboxes on demand · rolled out across 15+ production services.</span></span>
    <span class="code-line">    <span class="kw">public</span> <span class="cls">Framework</span> <span class="fn">sltForge</span>() &#123;</span>
    <span class="code-line">        <span class="kw">return new</span> <span class="cls">Framework</span>(services = <span class="num">15</span>, sandboxes = <span class="str">"on-demand"</span>);</span>
    <span class="code-line">    &#125;</span>
    <span class="code-line"></span>
    <span class="code-line">    <span class="cmt">// Statement Service Performance</span></span>
    <span class="code-line">    <span class="cmt">// Eliminated redundant upstream calls in a 50M+ monthly statements pipeline.</span></span>
    <span class="code-line">    <span class="cmt">// Reduced system load 20%, decreased response latency.</span></span>
    <span class="code-line">    <span class="kw">public</span> <span class="cls">Optimization</span> <span class="fn">statementPerformance</span>() &#123;</span>
    <span class="code-line">        <span class="kw">return new</span> <span class="cls">Optimization</span>(statements = <span class="str">"50M+/month"</span>, loadReduction = <span class="str">"20%"</span>);</span>
    <span class="code-line">    &#125;</span>
    <span class="code-line"></span>
    <span class="code-line">    <span class="cmt">// Cadence Migration: MySQL → Cassandra</span></span>
    <span class="code-line">    <span class="cmt">// Debugged GoCQL race condition; co-authored migration plan.</span></span>
    <span class="code-line">    <span class="kw">public</span> <span class="cls">Migration</span> <span class="fn">cadenceMigration</span>() &#123;</span>
    <span class="code-line">        <span class="kw">return new</span> <span class="cls">Migration</span>(from = <span class="str">"MySQL"</span>, to = <span class="str">"Cassandra"</span>);</span>
    <span class="code-line">    &#125;</span>
    <span class="code-line"></span>
    <span class="code-line">    <span class="cmt">// LLM Config Generator</span></span>
    <span class="code-line">    <span class="cmt">// Auto-generates JSON parser configs for PDF extraction pipelines.</span></span>
    <span class="code-line">    <span class="cmt">// 1.5 days → 5 minutes. Manual effort cut by 70%+.</span></span>
    <span class="code-line">    <span class="kw">public</span> <span class="cls">Tool</span> <span class="fn">llmConfigGenerator</span>() &#123;</span>
    <span class="code-line">        <span class="kw">return new</span> <span class="cls">Tool</span>(timeReduction = <span class="str">"1.5d → 5min"</span>, effortCut = <span class="str">"70%+"</span>);</span>
    <span class="code-line">    &#125;</span>
    <span class="code-line"></span>
    <span class="code-line">    <span class="cmt">// MITC Change Detection</span></span>
    <span class="code-line">    <span class="cmt">// Challenged over-engineered scraper proposal; deployed n8n SHA-hash workflow.</span></span>
    <span class="code-line">    <span class="cmt">// Routes bank T&amp;C diffs to Slack. Zero infrastructure cost.</span></span>
    <span class="code-line">    <span class="kw">public</span> <span class="cls">Workflow</span> <span class="fn">mitcChangeDetection</span>() &#123;</span>
    <span class="code-line">        <span class="kw">return new</span> <span class="cls">Workflow</span>(tool = <span class="str">"n8n"</span>, infraCost = <span class="num">0</span>);</span>
    <span class="code-line">    &#125;</span>
    <span class="code-line">&#125;</span>
    <span class="code-line"></span>
    <span class="code-line"><span class="ann">@Company</span>(<span class="key">name</span> = <span class="str">"API Holdings (PharmEasy)"</span>, <span class="key">period</span> = <span class="str">"Jan 2022 – Mar 2023"</span>)</span>
    <span class="code-line"><span class="kw">public class</span> <span class="cls">SoftwareEngineer</span> <span class="kw">extends</span> <span class="cls">QualityEngineering</span> &#123;</span>
    <span class="code-line"></span>
    <span class="code-line">    <span class="cmt">// E2E test automation for real-time home diagnostics platform.</span></span>
    <span class="code-line">    <span class="cmt">// +30% test coverage · -50% manual effort.</span></span>
    <span class="code-line">    <span class="cmt">// Debugged cross-service failures via distributed log tracing.</span></span>
    <span class="code-line">    <span class="kw">public</span> <span class="cls">Framework</span> <span class="fn">e2eAutomation</span>() &#123;</span>
    <span class="code-line">        <span class="kw">return new</span> <span class="cls">Framework</span>(coverageGain = <span class="str">"30%"</span>, effortCut = <span class="str">"50%"</span>);</span>
    <span class="code-line">    &#125;</span>
    <span class="code-line">&#125;</span>
    <span class="code-line"></span>
    <span class="code-line"><span class="ann">@Company</span>(<span class="key">name</span> = <span class="str">"Chipster Technologies"</span>, <span class="key">period</span> = <span class="str">"Aug 2021 – Jan 2022"</span>)</span>
    <span class="code-line"><span class="kw">public class</span> <span class="cls">SoftwareEngineeringIntern</span> &#123;</span>
    <span class="code-line"></span>
    <span class="code-line">    <span class="cmt">// Mobile features, OO design, cross-functional collaboration.</span></span>
    <span class="code-line">    <span class="cmt">// Shipped production-ready interfaces with design team.</span></span>
    <span class="code-line">    <span class="kw">public void</span> <span class="fn">mobileDevelopment</span>() &#123; <span class="cmt">/* Flutter · production interfaces */</span> &#125;</span>
    <span class="code-line">&#125;</span>
    <span class="code-line"></span>
    <span class="code-line"></span>
  </div>
</section>
```

- [ ] **Step 2: Add to index.astro**

```astro
---
import IDELayout from '../layouts/IDELayout.astro';
import '../styles/global.css';
import ReadmeSection from '../sections/ReadmeSection.astro';
import ExperienceSection from '../sections/ExperienceSection.astro';
---
<IDELayout>
  <ReadmeSection />
  <ExperienceSection />
</IDELayout>
```

- [ ] **Step 3: Build**

```bash
npm run build
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/sections/ExperienceSection.astro src/pages/index.astro
git commit -m "feat: add experience.java section with Java syntax highlighting"
```

---

## Task 12: skills.json section

**Files:**
- Create: `src/sections/SkillsSection.astro`

- [ ] **Step 1: Create SkillsSection.astro**

Line count: 14.

```astro
---
function lines(n: number) {
  return Array.from({ length: n }, (_, i) => i + 1);
}
const lineCount = 14;
---

<section class="editor-section" id="skills" data-filename="anmol/skills.json">
  <div class="gutter" aria-hidden="true">
    {lines(lineCount).map(n => <span>{n}</span>)}
  </div>
  <div class="code-content">
    <span class="code-line">&#123;</span>
    <span class="code-line">  <span class="jkey">"languages"</span>:  [<span class="jstr">"Java"</span>, <span class="jstr">"Python"</span>],</span>
    <span class="code-line">  <span class="jkey">"frameworks"</span>:  [<span class="jstr">"Spring Boot"</span>, <span class="jstr">"Dropwizard"</span>, <span class="jstr">"TestNG"</span>],</span>
    <span class="code-line">  <span class="jkey">"systems"</span>:     [<span class="jstr">"Distributed Systems"</span>, <span class="jstr">"Microservices"</span>,</span>
    <span class="code-line">                  <span class="jstr">"Data Pipelines"</span>, <span class="jstr">"Large-scale System Design"</span>, <span class="jstr">"High Reliability"</span>],</span>
    <span class="code-line">  <span class="jkey">"databases"</span>:   [<span class="jstr">"MySQL"</span>, <span class="jstr">"Apache Cassandra"</span>],</span>
    <span class="code-line">  <span class="jkey">"infra"</span>:       [<span class="jstr">"Kubernetes"</span>, <span class="jstr">"Docker"</span>, <span class="jstr">"AWS"</span>, <span class="jstr">"Daytona"</span>, <span class="jstr">"Jenkins"</span>, <span class="jstr">"CI/CD"</span>],</span>
    <span class="code-line">  <span class="jkey">"ai_llm"</span>:      [<span class="jstr">"LLM Orchestration"</span>, <span class="jstr">"Agent Design"</span>,</span>
    <span class="code-line">                  <span class="jstr">"Prompt Engineering"</span>, <span class="jstr">"AI-powered Code Generation"</span>],</span>
    <span class="code-line">  <span class="jkey">"engineering"</span>: [<span class="jstr">"OO Design"</span>, <span class="jstr">"Algorithms"</span>, <span class="jstr">"Debugging"</span>,</span>
    <span class="code-line">                  <span class="jstr">"Performance Optimization"</span>, <span class="jstr">"Code Review"</span>, <span class="jstr">"Technical Leadership"</span>]</span>
    <span class="code-line">&#125;</span>
    <span class="code-line"></span>
    <span class="code-line"></span>
  </div>
</section>
```

- [ ] **Step 2: Add to index.astro**

```astro
---
import IDELayout from '../layouts/IDELayout.astro';
import '../styles/global.css';
import ReadmeSection from '../sections/ReadmeSection.astro';
import ExperienceSection from '../sections/ExperienceSection.astro';
import SkillsSection from '../sections/SkillsSection.astro';
---
<IDELayout>
  <ReadmeSection />
  <ExperienceSection />
  <SkillsSection />
</IDELayout>
```

- [ ] **Step 3: Build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/sections/SkillsSection.astro src/pages/index.astro
git commit -m "feat: add skills.json section with JSON syntax highlighting"
```

---

## Task 13: contact.md section

**Files:**
- Create: `src/sections/ContactSection.astro`

- [ ] **Step 1: Create ContactSection.astro**

Line count: 14. Includes a terminal-style resume download hint.

```astro
---
function lines(n: number) {
  return Array.from({ length: n }, (_, i) => i + 1);
}
const lineCount = 14;
---

<section class="editor-section" id="contact" data-filename="anmol/contact.md">
  <div class="gutter" aria-hidden="true">
    {lines(lineCount).map(n => <span>{n}</span>)}
  </div>
  <div class="code-content">
    <span class="code-line"><span class="md-h1"># Contact</span></span>
    <span class="code-line"></span>
    <span class="code-line"><span class="md-bold">**Email**</span>    <a href="mailto:anmolbadi@gmail.com" class="md-link">anmolbadi@gmail.com</a></span>
    <span class="code-line"><span class="md-bold">**LinkedIn**</span> <a href="https://linkedin.com/in/me-anmol" target="_blank" rel="noopener" class="md-link">linkedin.com/in/me-anmol</a></span>
    <span class="code-line"><span class="md-bold">**GitHub**</span>   <a href="https://github.com/me-anmol" target="_blank" rel="noopener" class="md-link">github.com/me-anmol</a></span>
    <span class="code-line"></span>
    <span class="code-line"><span class="cmt">---</span></span>
    <span class="code-line"></span>
    <span class="code-line"><span class="cmt"># Download resume</span></span>
    <span class="code-line"><span class="kw">$</span> <span class="fn">curl</span> -O <a href="/resume.pdf" target="_blank" rel="noopener" class="md-link">anmolbadi.dev/resume.pdf</a></span>
    <span class="code-line"></span>
    <span class="code-line"><span class="cmt"># Or open directly:</span></span>
    <span class="code-line"><span class="kw">$</span> <span class="fn">open</span> <a href="/resume.pdf" target="_blank" rel="noopener" class="md-link">resume.pdf</a></span>
    <span class="code-line"></span>
  </div>
</section>
```

- [ ] **Step 2: Add to index.astro — final content wiring**

```astro
---
import IDELayout from '../layouts/IDELayout.astro';
import '../styles/global.css';
import ReadmeSection from '../sections/ReadmeSection.astro';
import ExperienceSection from '../sections/ExperienceSection.astro';
import SkillsSection from '../sections/SkillsSection.astro';
import ContactSection from '../sections/ContactSection.astro';
---
<IDELayout>
  <ReadmeSection />
  <ExperienceSection />
  <SkillsSection />
  <ContactSection />
</IDELayout>
```

- [ ] **Step 3: Copy resume to public/**

```bash
cp assets/img/resume.pdf public/resume.pdf
```

- [ ] **Step 4: Build**

```bash
npm run build
```

Expected: no errors. `dist/resume.pdf` exists.

- [ ] **Step 5: Commit**

```bash
git add src/sections/ContactSection.astro src/pages/index.astro public/resume.pdf
git commit -m "feat: add contact.md section and resume PDF"
```

---

## Task 14: JavaScript — tab switching and Vim mode flash

**Files:**
- Create: `src/scripts/ide.ts`
- Modify: `src/pages/index.astro` (add script tag)

- [ ] **Step 1: Create src/scripts/ide.ts**

```typescript
function setActiveTab(fileId: string): void {
  // Update tabs
  document.querySelectorAll<HTMLElement>('.tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tabId === fileId);
  });
  // Update sidebar file rows
  document.querySelectorAll<HTMLElement>('.file-row').forEach(row => {
    row.classList.toggle('active', row.dataset.fileId === fileId);
  });
}

function flashVimInsert(): void {
  const modeEl = document.getElementById('vim-mode');
  if (!modeEl) return;
  modeEl.textContent = '-- INSERT --';
  modeEl.classList.add('insert');
  setTimeout(() => {
    modeEl.textContent = '-- NORMAL --';
    modeEl.classList.remove('insert');
  }, 600);
}

function navigateToSection(fileId: string): void {
  const section = document.getElementById(fileId);
  if (!section) return;
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  setActiveTab(fileId);
  updateStatusbarFilename(fileId);
  flashVimInsert();
}

function updateStatusbarFilename(fileId: string): void {
  const filenameEl = document.getElementById('vim-filename');
  if (!filenameEl) return;
  const section = document.getElementById(fileId);
  filenameEl.textContent = section?.dataset.filename ?? '';
}

// Sidebar file clicks
document.querySelectorAll<HTMLElement>('.file-row').forEach(row => {
  row.addEventListener('click', () => {
    const id = row.dataset.fileId;
    if (id) navigateToSection(id);
  });
});

// Sidebar outline clicks
document.querySelectorAll<HTMLElement>('.outline-row').forEach(row => {
  row.addEventListener('click', () => {
    const id = row.dataset.target;
    if (id) navigateToSection(id);
  });
});

// Tab clicks
document.querySelectorAll<HTMLElement>('.tab').forEach(tab => {
  tab.addEventListener('click', (e) => {
    // Ignore close button clicks
    if ((e.target as HTMLElement).classList.contains('tab-close')) return;
    const id = tab.dataset.tabId;
    if (id) navigateToSection(id);
  });
});
```

- [ ] **Step 2: Add script to index.astro**

Add a `<slot name="scripts">` usage in index.astro. Update index.astro:

```astro
---
import IDELayout from '../layouts/IDELayout.astro';
import '../styles/global.css';
import ReadmeSection from '../sections/ReadmeSection.astro';
import ExperienceSection from '../sections/ExperienceSection.astro';
import SkillsSection from '../sections/SkillsSection.astro';
import ContactSection from '../sections/ContactSection.astro';
---
<IDELayout>
  <ReadmeSection />
  <ExperienceSection />
  <SkillsSection />
  <ContactSection />
  <script src="../scripts/ide.ts"></script>
</IDELayout>
```

Note: Astro auto-bundles `<script src="...">` tags — the `src` path is relative to the page file.

- [ ] **Step 3: Build**

```bash
npm run build
```

Expected: no errors. The bundle includes ide.ts.

- [ ] **Step 4: Commit**

```bash
git add src/scripts/ide.ts src/pages/index.astro
git commit -m "feat: add tab switching and Vim mode flash interactions"
```

---

## Task 15: Scroll tracking — statusbar filename + line counter

**Files:**
- Modify: `src/scripts/ide.ts`

The editor area scroll updates the statusbar filename (which section is in view) and the Ln counter.

- [ ] **Step 1: Append scroll tracking to src/scripts/ide.ts**

Add to the bottom of `src/scripts/ide.ts`:

```typescript
// IntersectionObserver — update filename as sections scroll into view
const sectionObserver = new IntersectionObserver(
  (entries) => {
    // Find the topmost visible section
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (visible.length > 0) {
      const section = visible[0].target as HTMLElement;
      const fileId = section.id;
      setActiveTab(fileId);
      updateStatusbarFilename(fileId);
    }
  },
  { threshold: 0.15 }
);

document.querySelectorAll<HTMLElement>('.editor-section').forEach(section => {
  sectionObserver.observe(section);
});

// Scroll → Ln counter
const editorArea = document.getElementById('editor-area');
const lnEl = document.getElementById('vim-ln');

if (editorArea && lnEl) {
  editorArea.addEventListener('scroll', () => {
    // Approx 20px per line (13px font * 1.6 line-height = 20.8)
    const lineHeight = 20.8;
    const ln = Math.floor(editorArea.scrollTop / lineHeight) + 1;
    lnEl.textContent = `Ln ${ln}, Col 1`;
  });
}
```

- [ ] **Step 2: Build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/scripts/ide.ts
git commit -m "feat: add scroll-based statusbar filename and line counter"
```

---

## Task 16: Typing animation

**Files:**
- Create: `src/scripts/typing.ts`
- Modify: `src/pages/index.astro`

Animates the first 9 lines of README.md (down to and including the blockquote). Content is pre-rendered in HTML; animation replaces it character by character.

- [ ] **Step 1: Add `data-typing="true"` attribute to ReadmeSection**

In `src/sections/ReadmeSection.astro`, add `data-typing="true"` to the `code-content` div:

```astro
<div class="code-content" id="readme-content" data-typing="true">
```

- [ ] **Step 2: Create src/scripts/typing.ts**

```typescript
function typeContent(el: HTMLElement): void {
  // Collect only the first 9 .code-line children
  const lines = Array.from(el.querySelectorAll<HTMLElement>('.code-line')).slice(0, 9);

  // Snapshot HTML, then clear those lines
  const originalHTML = lines.map(l => l.innerHTML);
  lines.forEach(l => { l.innerHTML = ''; });

  let lineIndex = 0;
  let charIndex = 0;
  // Strip HTML tags to get plain-text length, then re-apply HTML progressively
  // Simpler approach: reveal innerHTML char by char using a character counter on the text nodes
  // We reveal by progressively setting innerHTML using a character slice of the original text content.
  // Because innerHTML contains spans, we use a "virtual" char count approach:
  // build a temporary div, iterate text nodes, count characters.

  function getVisibleHTML(html: string, visibleChars: number): string {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    let remaining = visibleChars;
    function walk(node: Node): void {
      if (remaining <= 0) {
        if (node.parentNode) node.parentNode.removeChild(node);
        return;
      }
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent ?? '';
        if (text.length <= remaining) {
          remaining -= text.length;
        } else {
          node.textContent = text.slice(0, remaining);
          remaining = 0;
        }
      } else {
        Array.from(node.childNodes).forEach(walk);
      }
    }
    walk(tmp);
    return tmp.innerHTML;
  }

  const textLengths = originalHTML.map(html => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent?.length ?? 0;
  });

  function tick(): void {
    if (lineIndex >= lines.length) return;

    const maxChars = textLengths[lineIndex];
    charIndex++;

    lines[lineIndex].innerHTML = getVisibleHTML(originalHTML[lineIndex], charIndex);

    if (charIndex >= maxChars) {
      lineIndex++;
      charIndex = 0;
    }

    if (lineIndex < lines.length) {
      setTimeout(tick, 18); // ~55 chars/second
    }
  }

  // Blinking cursor on first line while typing
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  cursor.textContent = '█';
  lines[0].appendChild(cursor);

  setTimeout(() => {
    cursor.remove();
    tick();
  }, 300);
}

document.addEventListener('DOMContentLoaded', () => {
  const el = document.querySelector<HTMLElement>('[data-typing="true"]');
  if (el) typeContent(el);
});
```

- [ ] **Step 3: Add cursor blink CSS to global.css**

Append to `src/styles/global.css`:

```css
.typing-cursor {
  display: inline-block;
  animation: blink 0.8s step-end infinite;
  color: var(--text);
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
```

- [ ] **Step 4: Import typing.ts in index.astro**

```astro
  <script src="../scripts/ide.ts"></script>
  <script src="../scripts/typing.ts"></script>
```

- [ ] **Step 5: Build**

```bash
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add src/scripts/typing.ts src/sections/ReadmeSection.astro src/pages/index.astro src/styles/global.css
git commit -m "feat: add typing animation for README hero"
```

---

## Task 17: Mobile responsiveness

**Files:**
- Modify: `src/components/Sidebar.astro` (add hamburger button)
- Modify: `src/styles/global.css` (mobile breakpoints)
- Modify: `src/components/Titlebar.astro` (hamburger slot)
- Modify: `src/scripts/ide.ts` (sidebar toggle)

- [ ] **Step 1: Add hamburger button to Titlebar.astro**

Replace content of Titlebar.astro:

```astro
---
---
<div class="titlebar">
  <div class="traffic-lights">
    <span class="dot dot-red"></span>
    <span class="dot dot-yellow"></span>
    <span class="dot dot-green"></span>
  </div>
  <button class="hamburger" id="sidebar-toggle" aria-label="Toggle sidebar">☰</button>
  <span class="title-text">anmol — portfolio</span>
</div>

<style>
.titlebar {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--panel);
  height: 38px;
  padding: 0 16px;
  border-bottom: 1px solid #1e1e1e;
  flex-shrink: 0;
  user-select: none;
}
.traffic-lights {
  display: flex;
  gap: 6px;
}
.dot { width: 12px; height: 12px; border-radius: 50%; }
.dot-red    { background: #FF5F57; }
.dot-yellow { background: #FEBC2E; }
.dot-green  { background: #28C840; }
.hamburger {
  display: none;
  background: none;
  border: none;
  color: var(--text);
  font-size: 16px;
  cursor: pointer;
  padding: 0 4px;
}
.title-text {
  font-size: 12px;
  color: var(--gutter);
  flex: 1;
  text-align: center;
}
@media (max-width: 768px) {
  .hamburger { display: block; }
  .traffic-lights { display: none; }
}
</style>
```

- [ ] **Step 2: Add mobile CSS to global.css**

Append to `src/styles/global.css`:

```css
/* Mobile */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 38px;
    left: 0;
    bottom: 22px;
    z-index: 100;
    transform: translateX(-100%);
    transition: transform 0.2s ease;
    box-shadow: 4px 0 16px rgba(0,0,0,0.4);
  }
  .sidebar.open {
    transform: translateX(0);
  }
  .gutter { display: none; }
  .code-content { padding: 16px; }
  #vim-ln { display: none; }
  .statusbar .right-info span:not(#vim-ln) { display: none; }
}
```

- [ ] **Step 3: Add sidebar toggle to ide.ts**

Append to `src/scripts/ide.ts`:

```typescript
// Mobile sidebar toggle
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');

if (sidebarToggle && sidebar) {
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  // Close sidebar when a file is clicked on mobile
  document.querySelectorAll<HTMLElement>('.file-row, .outline-row').forEach(row => {
    row.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
      }
    });
  });
}
```

- [ ] **Step 4: Build**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add src/components/Titlebar.astro src/styles/global.css src/scripts/ide.ts
git commit -m "feat: add mobile sidebar toggle and responsive layout"
```

---

## Task 18: GitHub Actions deploy workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create deploy.yml**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

- [ ] **Step 2: Enable GitHub Pages in repo settings**

Go to: `https://github.com/me-anmol/me-anmol.github.io` → Settings → Pages → Source: **GitHub Actions**

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Actions deploy workflow for Astro build"
```

---

## Task 19: Playwright E2E tests

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/portfolio.spec.ts`

- [ ] **Step 1: Install Playwright**

```bash
npx playwright install chromium
```

- [ ] **Step 2: Create playwright.config.ts**

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:4321',
  },
  webServer: {
    command: 'npm run dev',
    port: 4321,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
```

- [ ] **Step 3: Write tests/portfolio.spec.ts**

```typescript
import { test, expect } from '@playwright/test';

test.describe('IDE shell', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('titlebar renders with traffic lights', async ({ page }) => {
    await expect(page.locator('.dot-red')).toBeVisible();
    await expect(page.locator('.dot-yellow')).toBeVisible();
    await expect(page.locator('.dot-green')).toBeVisible();
  });

  test('vim statusbar shows NORMAL mode', async ({ page }) => {
    await expect(page.locator('#vim-mode')).toHaveText('-- NORMAL --');
  });

  test('all four files appear in sidebar', async ({ page }) => {
    await expect(page.getByText('README.md')).toBeVisible();
    await expect(page.getByText('experience.java')).toBeVisible();
    await expect(page.getByText('skills.json')).toBeVisible();
    await expect(page.getByText('contact.md')).toBeVisible();
  });

  test('all four tabs render', async ({ page }) => {
    await expect(page.locator('[data-tab-id="readme"]')).toBeVisible();
    await expect(page.locator('[data-tab-id="experience"]')).toBeVisible();
    await expect(page.locator('[data-tab-id="skills"]')).toBeVisible();
    await expect(page.locator('[data-tab-id="contact"]')).toBeVisible();
  });
});

test.describe('sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('README section exists with name', async ({ page }) => {
    await expect(page.locator('#readme')).toBeAttached();
    await expect(page.locator('#readme')).toContainText('Anmol Badi');
  });

  test('experience section exists with CRED', async ({ page }) => {
    await expect(page.locator('#experience')).toBeAttached();
    await expect(page.locator('#experience')).toContainText('CRED');
  });

  test('skills section exists with Java', async ({ page }) => {
    await expect(page.locator('#skills')).toBeAttached();
    await expect(page.locator('#skills')).toContainText('Java');
  });

  test('contact section has email link', async ({ page }) => {
    await expect(page.locator('#contact')).toBeAttached();
    await expect(page.locator('#contact a[href="mailto:anmolbadi@gmail.com"]')).toBeVisible();
  });
});

test.describe('navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('clicking experience in sidebar scrolls to section and updates tab', async ({ page }) => {
    await page.locator('[data-file-id="experience"]').click();
    await expect(page.locator('[data-tab-id="experience"]')).toHaveClass(/active/);
  });

  test('clicking skills tab scrolls to section', async ({ page }) => {
    await page.locator('[data-tab-id="skills"]').click();
    await expect(page.locator('[data-tab-id="skills"]')).toHaveClass(/active/);
  });

  test('vim mode flashes INSERT on navigation', async ({ page }) => {
    await page.locator('[data-file-id="experience"]').click();
    // Brief INSERT state
    await expect(page.locator('#vim-mode')).toHaveText('-- INSERT --');
    // Returns to NORMAL
    await expect(page.locator('#vim-mode')).toHaveText('-- NORMAL --', { timeout: 2000 });
  });
});

test.describe('resume', () => {
  test('resume PDF is accessible', async ({ page }) => {
    const resp = await page.request.get('/resume.pdf');
    expect(resp.status()).toBe(200);
  });
});
```

- [ ] **Step 4: Run tests against dev server**

In one terminal: `npm run dev`
In another: `npm test`

Expected: all tests pass.

- [ ] **Step 5: Add test script to package.json** (already set in Task 1, verify it's `"test": "playwright test"`)

- [ ] **Step 6: Commit**

```bash
git add playwright.config.ts tests/portfolio.spec.ts
git commit -m "test: add Playwright E2E smoke tests for portfolio"
```

---

## Task 20: Final cleanup

**Files:**
- Delete: `index.html`
- Delete: `assets/` (old Bootstrap + fonts)
- Verify: `public/resume.pdf` exists (done in Task 13)

- [ ] **Step 1: Run all tests — confirm passing before cleanup**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 2: Delete old files**

```bash
git rm -r assets/ index.html
```

- [ ] **Step 3: Verify Astro build still works**

```bash
npm run build
```

Expected: no errors. `dist/` contains the new site.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: remove old Bootstrap site, Astro rebuild complete"
```

- [ ] **Step 5: Push to main**

```bash
git push origin main
```

Expected: GitHub Actions workflow triggers, deploys to GitHub Pages within ~2 minutes.

---

## Self-Review Notes

- All spec sections covered: IDE shell ✓, Darcula colors ✓, 4 content files ✓, syntax highlighting ✓, vim statusbar ✓, typing animation ✓, mobile ✓, GitHub Pages deploy ✓
- No TBDs or placeholders in content — all resume data is hardcoded from spec
- Consistent class names across tasks: `.file-row[data-file-id]`, `.tab[data-tab-id]`, `.editor-section[id][data-filename]`
- `navigateToSection()` in ide.ts references `setActiveTab()` and `updateStatusbarFilename()` — both defined above it in the same file ✓
- Mobile CSS uses `.sidebar.open` class — toggled by `sidebar.classList.toggle('open')` in ide.ts ✓
- `public/resume.pdf` created in Task 13 before referenced in ContactSection ✓
