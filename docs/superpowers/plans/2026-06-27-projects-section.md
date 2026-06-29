# Projects Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `projects.go` section to the IDE-themed portfolio displaying the EmailScraper GitHub project as styled Go source code.

**Architecture:** New `ProjectsSection.astro` component styled as Go syntax with blue tech chips. Sidebar, TabBar, and index.astro are each updated to include the new file. Existing Playwright tests are updated and new section tests are added.

**Tech Stack:** Astro, Playwright (tests), existing global CSS chip/syntax classes.

## Global Constraints

- All syntax highlighting uses existing CSS classes: `.kw`, `.cls`, `.str`, `.fn`, `.cmt`, `.md-link`@
- All chip styling uses existing classes: `.chip`, `.chip-blue`, `.chip-value`, `.chip-label`
- `projects.go` slot in sidebar/tabbar is **between** `experience.java` and `skills.json` — order matters
- Section `id="projects"`, `data-filename="anmol/projects.go"`
- Repo link: `https://github.com/me-anmol/EmailScraper` (opens in new tab, `rel="noopener"`)
- Do not add new CSS — use only existing global.css classes

---

## File Map

| Action | File | Change |
|--------|------|--------|
| Modify | `tests/portfolio.spec.ts` | Update 4→5 file/tab assertions; add projects section + chip tests |
| Create | `src/sections/ProjectsSection.astro` | New Go-styled section component |
| Modify | `src/components/Sidebar.astro` | Add `projects.go` entry + outline item |
| Modify | `src/components/TabBar.astro` | Add `projects.go` tab |
| Modify | `src/pages/index.astro` | Import + render `ProjectsSection` |

---

## Task 1: Write Failing Tests

**Files:**
- Modify: `tests/portfolio.spec.ts`

**Interfaces:**
- Produces: failing Playwright assertions for `projects.go` sidebar entry, tab, section content, and chip

- [ ] **Step 1: Update the sidebar file count test and add projects entries**

In `tests/portfolio.spec.ts`, replace the existing `'all four files appear in sidebar'` test and `'all four tabs render'` test, and add a new projects section describe block:

```typescript
// In test.describe('IDE shell') — replace existing sidebar/tab tests:

  test('all five files appear in sidebar', async ({ page }) => {
    await expect(page.getByText('README.md').first()).toBeVisible();
    await expect(page.getByText('experience.java').first()).toBeVisible();
    await expect(page.getByText('projects.go').first()).toBeVisible();
    await expect(page.getByText('skills.json').first()).toBeVisible();
    await expect(page.getByText('contact.md').first()).toBeVisible();
  });

  test('all five tabs render', async ({ page }) => {
    await expect(page.locator('[data-tab-id="readme"]')).toBeVisible();
    await expect(page.locator('[data-tab-id="experience"]')).toBeVisible();
    await expect(page.locator('[data-tab-id="projects"]')).toBeVisible();
    await expect(page.locator('[data-tab-id="skills"]')).toBeVisible();
    await expect(page.locator('[data-tab-id="contact"]')).toBeVisible();
  });
```

Then add a new describe block after the existing `sections` block:

```typescript
test.describe('projects section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('projects section exists with EmailScraper', async ({ page }) => {
    await expect(page.locator('#projects')).toBeAttached();
    await expect(page.locator('#projects')).toContainText('EmailScraper');
  });

  test('projects section has tech chips', async ({ page }) => {
    await expect(page.locator('#projects .metric-chips').first()).toBeVisible();
  });

  test('projects section chip contains Go', async ({ page }) => {
    await expect(page.locator('#projects')).toContainText('Go');
  });

  test('projects section has repo link to GitHub', async ({ page }) => {
    await expect(
      page.locator('#projects a[href="https://github.com/me-anmol/EmailScraper"]')
    ).toBeAttached();
  });

  test('clicking projects.go in sidebar activates its tab', async ({ page }) => {
    await page.locator('[data-file-id="projects"]').click();
    await expect(page.locator('[data-tab-id="projects"]')).toHaveClass(/active/);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx playwright test --reporter=line 2>&1 | head -40
```

Expected: failures on `all five files appear in sidebar`, `all five tabs render`, and all `projects section` tests. If they pass, the component already exists — stop and investigate.

- [ ] **Step 3: Commit failing tests**

```bash
git add tests/portfolio.spec.ts
git commit -m "test: add projects.go section and navigation tests"
```

---

## Task 2: Create ProjectsSection.astro

**Files:**
- Create: `src/sections/ProjectsSection.astro`

**Interfaces:**
- Consumes: global CSS classes `.kw`, `.cls`, `.str`, `.fn`, `.cmt`, `.md-link`, `.chip`, `.chip-blue`, `.chip-value`, `.chip-label`, `.editor-section`, `.gutter`, `.code-content`, `.code-line`, `.chips-line`, `.metric-chips`
- Produces: `<section id="projects" data-filename="anmol/projects.go">` rendered into the editor area

- [ ] **Step 1: Create the component**

Create `src/sections/ProjectsSection.astro` with this exact content:

```astro
---
function lines(n: number) {
  return Array.from({ length: n }, (_, i) => i + 1);
}
const lineCount = 18;
---

<section class="editor-section" id="projects" data-filename="anmol/projects.go">
  <div class="gutter" aria-hidden="true">
    {lines(lineCount).map(n => <span>{n}</span>)}
  </div>
  <div class="code-content" id="projects-content">
    <span class="code-line"><span class="kw">package</span> <span class="cls">projects</span></span>
    <span class="code-line"></span>
    <span class="code-line"><span class="cmt">// EmailScraper — self-hosted Go service</span></span>
    <span class="code-line"><span class="cmt">// Gmail OAuth2 · SQLite · chi HTTP · pluggable provider + transform pipeline</span></span>
    <span class="code-line"><span class="cmt">// Define filter templates, trigger scrapes, extract OTPs from email body.</span></span>
    <div class="code-line chips-line">
      <div class="metric-chips">
        <div class="chip chip-blue"><span class="chip-value">Go</span><span class="chip-label">LANGUAGE</span></div>
        <div class="chip chip-blue"><span class="chip-value">SQLite</span><span class="chip-label">DATABASE</span></div>
        <div class="chip chip-blue"><span class="chip-value">Gmail OAuth2</span><span class="chip-label">PROVIDER</span></div>
        <div class="chip chip-blue"><span class="chip-value">REST</span><span class="chip-label">API</span></div>
      </div>
    </div>
    <span class="code-line"><span class="kw">type</span> <span class="cls">EmailScraper</span> <span class="kw">struct</span> &#123;</span>
    <span class="code-line">    <span class="cls">Repo</span>  <span class="kw">string</span> <span class="cmt">// <a href="https://github.com/me-anmol/EmailScraper" target="_blank" rel="noopener" class="md-link">github.com/me-anmol/EmailScraper</a></span></span>
    <span class="code-line">    <span class="cls">Stack</span> <span class="kw">string</span> <span class="cmt">// "Go · chi · SQLite · Gmail API"</span></span>
    <span class="code-line">    <span class="cls">Arch</span>  <span class="kw">string</span> <span class="cmt">// "single binary, pluggable MailProvider + Transform pipeline"</span></span>
    <span class="code-line">&#125;</span>
    <span class="code-line"></span>
    <span class="code-line"><span class="kw">func</span> (<span class="cls">e</span> <span class="cls">EmailScraper</span>) <span class="fn">Highlight</span>() <span class="kw">string</span> &#123;</span>
    <span class="code-line">    <span class="kw">return</span> <span class="str">"OTP extraction · dedup by provider ID · zero infra"</span></span>
    <span class="code-line">&#125;</span>
    <span class="code-line"></span>
    <span class="code-line"></span>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/sections/ProjectsSection.astro
git commit -m "feat: add ProjectsSection.astro with Go syntax and tech chips"
```

---

## Task 3: Wire Sidebar, TabBar, and index.astro

**Files:**
- Modify: `src/components/Sidebar.astro:2-14` (files + outline arrays)
- Modify: `src/components/TabBar.astro:2-7` (tabs array)
- Modify: `src/pages/index.astro` (import + render)

**Interfaces:**
- Consumes: `ProjectsSection` from `../sections/ProjectsSection.astro`
- Produces: `data-file-id="projects"` in sidebar, `data-tab-id="projects"` in tabbar, `#projects` section in DOM

- [ ] **Step 1: Update Sidebar.astro**

Replace the `files` and `outline` arrays in `src/components/Sidebar.astro`:

```typescript
const files = [
  { name: 'README.md',       id: 'readme',     icon: '📄' },
  { name: 'experience.java', id: 'experience', icon: '📄' },
  { name: 'projects.go',     id: 'projects',   icon: '📄' },
  { name: 'skills.json',     id: 'skills',     icon: '📄' },
  { name: 'contact.md',      id: 'contact',    icon: '📄' },
];

const outline = [
  { label: 'Summary',    target: 'readme' },
  { label: 'Experience', target: 'experience' },
  { label: 'Projects',   target: 'projects' },
  { label: 'Skills',     target: 'skills' },
  { label: 'Contact',    target: 'contact' },
];
```

- [ ] **Step 2: Update TabBar.astro**

Replace the `tabs` array in `src/components/TabBar.astro`:

```typescript
const tabs = [
  { name: 'README.md',       id: 'readme' },
  { name: 'experience.java', id: 'experience' },
  { name: 'projects.go',     id: 'projects' },
  { name: 'skills.json',     id: 'skills' },
  { name: 'contact.md',      id: 'contact' },
];
```

- [ ] **Step 3: Update index.astro**

Replace the content of `src/pages/index.astro`:

```astro
---
import IDELayout from '../layouts/IDELayout.astro';
import '../styles/global.css';
import ReadmeSection from '../sections/ReadmeSection.astro';
import ExperienceSection from '../sections/ExperienceSection.astro';
import ProjectsSection from '../sections/ProjectsSection.astro';
import SkillsSection from '../sections/SkillsSection.astro';
import ContactSection from '../sections/ContactSection.astro';
---
<IDELayout>
  <ReadmeSection />
  <ExperienceSection />
  <ProjectsSection />
  <SkillsSection />
  <ContactSection />
</IDELayout>
```

- [ ] **Step 4: Run tests**

```bash
npx playwright test --reporter=line 2>&1 | tail -20
```

Expected: all tests pass. If any fail, check the exact selector or text — likely a typo in the component.

- [ ] **Step 5: Commit**

```bash
git add src/components/Sidebar.astro src/components/TabBar.astro src/pages/index.astro
git commit -m "feat: wire projects.go into sidebar, tabbar, and page"
```

---

## Self-Review

**Spec coverage:**
- ✅ New `projects.go` file in sidebar between `experience.java` and `skills.json`
- ✅ STRUCTURE panel gets `Projects` outline entry
- ✅ Content: Go package/struct/func syntax
- ✅ Tech chips: Go, SQLite, Gmail OAuth2, REST — blue style
- ✅ Repo link to `github.com/me-anmol/EmailScraper`
- ✅ TabBar updated with new tab

**Placeholder scan:** None found.

**Type consistency:** No shared types — pure HTML/Astro. Selectors used in tests (`#projects`, `[data-tab-id="projects"]`, `[data-file-id="projects"]`) match attributes set in components.
