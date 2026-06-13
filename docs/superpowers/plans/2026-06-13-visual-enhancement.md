# Visual Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add neon-on-black colour treatment, glowing metric chips in the experience section, an initials avatar hero in README, and fix the name to "Anmol" throughout.

**Architecture:** All changes are CSS additions/overrides in `global.css` plus targeted HTML edits in three Astro section/component files. No new components — existing patterns extended. Chips use a `.chips-line` class that overrides `white-space: pre-wrap` to render flex cards as a single code-line. Hero block sits above code-lines inside `.code-content`, overrides `white-space` locally.

**Tech Stack:** Astro 4, Tailwind CSS 3, plain CSS custom properties, Playwright E2E

---

## File Map

| File | Change |
|---|---|
| `src/styles/global.css` | Update `--bg`/`--panel`/`--gutter-bg`/`--gutter` tokens; add glow to `.num`/`.md-h1`/`.md-h2`; add `.metric-chips`, `.chip`, `.chip-value`, `.chip-label`, `.chip-orange`, `.chip-blue`, `.chip-green`, `.chips-line`; add `.hero-block`, `.hero-avatar`, `.hero-name` |
| `src/components/Titlebar.astro` | Gradient titlebar bg, tinted border, traffic-light `box-shadow` glow |
| `src/components/VimStatusBar.astro` | `background: #111`, `border-top: 1px solid rgba(104,151,187,0.12)` |
| `src/components/Sidebar.astro` | `.file-row.active` → orange treatment |
| `src/sections/ReadmeSection.astro` | Replace `# Anmol Badi` code-line with hero-block; update `lineCount` 22→21 |
| `src/sections/ExperienceSection.astro` | Insert 9 `.chips-line` rows (one per method with metrics); update `lineCount` 87→96 |
| `src/layouts/IDELayout.astro` | `<title>` → `Anmol` |
| `tests/portfolio.spec.ts` | Update `toContainText('Anmol Badi')` → `'Anmol'`; add hero avatar + chip tests |

---

## Task 1: Update colour tokens and add glow rules to global.css

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Update `:root` colour tokens**

In `src/styles/global.css`, replace the `:root` block (lines 5–20):

```css
:root {
  --bg:        #0d0d0d;
  --panel:     #111111;
  --gutter-bg: #0f0f0f;
  --gutter:    #2a2a2a;
  --text:      #A9B7C6;
  --kw:        #CC7832;
  --str:       #6A8759;
  --num:       #6897BB;
  --cmt:       #808080;
  --sel:       #214283;
  --line:      #1a1a1a;
  --fn:        #FFC66D;
  --cls:       #A9B7C6;
  --ann:       #BBB529;
}
```

- [ ] **Step 2: Add glow to `.num`, `.md-h1`, `.md-h2`**

Find the existing `.num` rule in the "Syntax highlight classes" section:
```css
.num { color: var(--num); }
```
Replace with:
```css
.num { color: var(--num); text-shadow: 0 0 8px rgba(104, 151, 187, 0.4); }
```

Find:
```css
.md-h1    { color: var(--kw); font-weight: 700; }
.md-h2    { color: var(--kw); font-weight: 700; }
```
Replace with:
```css
.md-h1    { color: var(--kw); font-weight: 700; text-shadow: 0 0 20px rgba(204, 120, 50, 0.35); }
.md-h2    { color: var(--kw); font-weight: 700; text-shadow: 0 0 20px rgba(204, 120, 50, 0.35); }
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: 1 page built, no errors. Background should now be `#0d0d0d` in generated CSS.

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: update colour tokens to neon-on-black, add heading and number glow"
```

---

## Task 2: Add chip CSS and hero CSS to global.css

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Add metric chip CSS**

Append to the END of `src/styles/global.css` (before the `/* Mobile */` block — insert just before line that reads `/* Mobile */`):

```css
/* Metric chips */
.chips-line {
  white-space: normal !important;
  display: block !important;
  height: auto !important;
}
.metric-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding: 8px 0 12px 4px;
}
.chip {
  border-radius: 5px;
  padding: 6px 10px;
  text-align: center;
  border: 1px solid;
}
.chip-value {
  display: block;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
}
.chip-label {
  display: block;
  font-size: 8px;
  margin-top: 2px;
  letter-spacing: 0.06em;
  color: #333;
}
.chip-orange { background: #140d00; border-color: rgba(204, 120, 50, 0.25); }
.chip-orange .chip-value { color: #FFC66D; text-shadow: 0 0 10px rgba(255, 198, 109, 0.5); }
.chip-blue { background: #0a0d14; border-color: rgba(104, 151, 187, 0.25); }
.chip-blue .chip-value { color: #6897BB; text-shadow: 0 0 10px rgba(104, 151, 187, 0.5); }
.chip-green { background: #0a140a; border-color: rgba(106, 135, 89, 0.25); }
.chip-green .chip-value { color: #6A8759; text-shadow: 0 0 10px rgba(106, 135, 89, 0.5); }
```

- [ ] **Step 2: Add hero block CSS**

Append immediately after the chip CSS (still before `/* Mobile */`):

```css
/* README hero */
.hero-block {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 16px;
  white-space: normal;
}
.hero-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #CC7832, #6897BB);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 700;
  color: #0d0d0d;
  flex-shrink: 0;
  box-shadow: 0 0 20px rgba(104, 151, 187, 0.3);
  font-style: normal;
}
.hero-name {
  display: block;
  font-size: 22px;
  font-weight: 700;
  background: linear-gradient(90deg, #CC7832, #FFC66D);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}
.hero-subtitle { display: block; }
.hero-location { display: block; }
```

- [ ] **Step 3: Build**

```bash
npm run build
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add metric chip and hero block CSS classes"
```

---

## Task 3: Update Titlebar — gradient bg + traffic light glow

**Files:**
- Modify: `src/components/Titlebar.astro`

- [ ] **Step 1: Update titlebar styles**

In `src/components/Titlebar.astro`, replace the entire `<style>` block with:

```css
<style>
.titlebar {
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(180deg, #1a1a1a, #111);
  height: 38px;
  padding: 0 16px;
  border-bottom: 1px solid rgba(204, 120, 50, 0.20);
  flex-shrink: 0;
  user-select: none;
}
.traffic-lights {
  display: flex;
  gap: 6px;
}
.dot { width: 12px; height: 12px; border-radius: 50%; }
.dot-red    { background: #FF5F57; box-shadow: 0 0 8px #FF5F5799; }
.dot-yellow { background: #FEBC2E; box-shadow: 0 0 8px #FEBC2E99; }
.dot-green  { background: #28C840; box-shadow: 0 0 8px #28C84099; }
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

- [ ] **Step 2: Build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Titlebar.astro
git commit -m "feat: titlebar gradient background and glowing traffic lights"
```

---

## Task 4: Update VimStatusBar and Sidebar active state

**Files:**
- Modify: `src/components/VimStatusBar.astro`
- Modify: `src/components/Sidebar.astro`

- [ ] **Step 1: Update VimStatusBar styles**

In `src/components/VimStatusBar.astro`, replace the `.statusbar` rule:

```css
.statusbar {
  display: flex;
  align-items: center;
  background: #111;
  border-top: 1px solid rgba(104, 151, 187, 0.12);
  height: 22px;
  padding: 0 8px;
  flex-shrink: 0;
  font-size: 12px;
  color: #ccc;
  gap: 16px;
  user-select: none;
}
```

- [ ] **Step 2: Update Sidebar active file-row**

In `src/components/Sidebar.astro`, replace:
```css
.file-row.active { background: var(--sel); }
```
With:
```css
.file-row.active {
  background: #1a0d00;
  border-right: 2px solid #CC7832;
  color: #CC7832;
}
```

Also update the hover to be more subtle on the near-black bg — replace:
```css
.file-row:hover, .outline-row:hover {
  background: var(--sel);
}
```
With:
```css
.file-row:hover, .outline-row:hover {
  background: rgba(255, 255, 255, 0.04);
}
```

- [ ] **Step 3: Build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/VimStatusBar.astro src/components/Sidebar.astro
git commit -m "feat: dark statusbar with accent border, orange active sidebar item"
```

---

## Task 5: Update ReadmeSection — hero block + name fix

**Files:**
- Modify: `src/sections/ReadmeSection.astro`

- [ ] **Step 1: Replace the heading code-line with hero-block, update name, update lineCount**

Replace the entire content of `src/sections/ReadmeSection.astro` with:

```astro
---
function lines(n: number) {
  return Array.from({ length: n }, (_, i) => i + 1);
}
const lineCount = 21;
---

<section class="editor-section" id="readme" data-filename="anmol/README.md">
  <div class="gutter" aria-hidden="true">
    {lines(lineCount).map(n => <span>{n}</span>)}
  </div>
  <div class="code-content" id="readme-content" data-typing="true">
    <div class="hero-block">
      <div class="hero-avatar" aria-hidden="true">A</div>
      <div>
        <span class="hero-name"># Anmol</span>
        <span class="hero-subtitle"><span class="md-bold">**Software Engineer**</span> · Platform &amp; Infrastructure</span>
        <span class="hero-location"><span class="md-italic">_CRED · Bangalore · Open to US/Remote_</span></span>
      </div>
    </div>
    <span class="code-line"></span>
    <span class="code-line"><span class="md-quote">&gt; Software engineer with 3+ years designing and scaling production</span></span>
    <span class="code-line"><span class="md-quote">&gt; systems at CRED — a fintech platform serving <span class="num">16M</span> users and</span></span>
    <span class="code-line"><span class="md-quote">&gt; processing <span class="num">50M+</span> credit card statements monthly.</span></span>
    <span class="code-line"><span class="md-quote">&gt; Specializes in distributed systems and LLM agent orchestration.</span></span>
    <span class="code-line"></span>
    <span class="code-line"><a href="https://github.com/me-anmol" target="_blank" rel="noopener" class="md-link">GitHub</a> · <a href="https://linkedin.com/in/me-anmol" target="_blank" rel="noopener" class="md-link">LinkedIn</a> · <a href="mailto:anmolbadi@gmail.com" class="md-link">Email</a> · <a href="/resume.pdf" target="_blank" rel="noopener" class="md-link">Resume ↓</a></span>
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

**Why lineCount = 21:** The original `# Anmol Badi` code-line (line 1 of 22) is removed and replaced with a `.hero-block` div that is NOT a `.code-line`. All other 21 code-lines remain.

- [ ] **Step 2: Build**

```bash
npm run build
```

Expected: no errors, `dist/index.html` contains `# Anmol` not `# Anmol Badi`.

- [ ] **Step 3: Commit**

```bash
git add src/sections/ReadmeSection.astro
git commit -m "feat: README hero block with initials avatar and gradient name"
```

---

## Task 6: Add metric chips to ExperienceSection

**Files:**
- Modify: `src/sections/ExperienceSection.astro`

Each method with impact metrics gets ONE `.chips-line` span inserted between its last comment line and its method signature. `.chips-line` overrides `white-space: pre-wrap` so the inner `.metric-chips` flex container renders correctly.

**Chip placement map:**

| Method | Insert after line content | Chips |
|---|---|---|
| `bbpsOnboardingAgent` | `// 7-hour process → under 1 hour.` | 🟠7h→1h · 🔵6 BANKS · 🔵5 MICROSERVICES |
| `sltForge` | `// Kubernetes sandboxes...` | 🔵15+ SERVICES · 🔵∞ K8S SANDBOXES |
| `statementPerformance` | `// Reduced system load 20%...` | 🔵50M+ STATEMENTS/MO · 🔵16M USERS · 🟠↓20% LOAD |
| `llmConfigGenerator` | `// 1.5 days → 5 minutes...` | 🟠1.5d→5m CONFIG TIME · 🟠70%+ EFFORT CUT |
| `mitcChangeDetection` | `// Routes bank T&C diffs to Slack...` | 🔵$0 INFRA COST |
| `automationFramework` | `// Enabled scalable continuous delivery...` | 🔵10+ MICROSERVICES |
| `javaUpgrade` | `// Contributed Cassandra...20+ teams.` | 🟠8→21 JAVA · 🔵20+ TEAMS |
| `pdfValidation` | `// Cross-validated raw PDFs...` | 🔵5K+ STATEMENTS/MO · 🔵40+ FIELDS |
| `e2eAutomation` | `// Debugged cross-service failures...` | 🟢+30% COVERAGE · 🟠-50% MANUAL EFFORT |

- [ ] **Step 1: Update lineCount and insert all chip rows**

Replace the entire content of `src/sections/ExperienceSection.astro` with:

```astro
---
function lines(n: number) {
  return Array.from({ length: n }, (_, i) => i + 1);
}
const lineCount = 96;
---

<section class="editor-section" id="experience" data-filename="anmol/experience.java">
  <div class="gutter" aria-hidden="true">
    {lines(lineCount).map(n => <span>{n}</span>)}
  </div>
  <div class="code-content" id="experience-content">
    <span class="code-line"><span class="ann">@Company</span>(<span class="key">name</span> = <span class="str">"CRED"</span>, <span class="key">period</span> = <span class="str">"Apr 2024 – Present"</span>)</span>
    <span class="code-line"><span class="kw">public class</span> <span class="cls">SoftwareEngineer</span> <span class="kw">extends</span> <span class="cls">PlatformAndInfrastructure</span> &#123;</span>
    <span class="code-line"></span>
    <span class="code-line">    <span class="cmt">// BBPS Bank Onboarding Agent</span></span>
    <span class="code-line">    <span class="cmt">// LLM agent across 5 microservices → 6 banks onboarded (BOI, Bandhan, DCB Edge, ESAF, Jupiter Edge, SBM)</span></span>
    <span class="code-line">    <span class="cmt">// 7-hour process → under 1 hour. Live in production.</span></span>
    <span class="code-line chips-line">
      <div class="metric-chips">
        <div class="chip chip-orange"><span class="chip-value">7h→1h</span><span class="chip-label">PROCESS TIME</span></div>
        <div class="chip chip-blue"><span class="chip-value">6</span><span class="chip-label">BANKS ONBOARDED</span></div>
        <div class="chip chip-blue"><span class="chip-value">5</span><span class="chip-label">MICROSERVICES</span></div>
      </div>
    </span>
    <span class="code-line">    <span class="kw">public</span> <span class="cls">Agent</span> <span class="fn">bbpsOnboardingAgent</span>() &#123;</span>
    <span class="code-line">        <span class="kw">return new</span> <span class="cls">LLMAgent</span>(banks = <span class="num">6</span>, timeReduction = <span class="str">"7h → 1h"</span>);</span>
    <span class="code-line">    &#125;</span>
    <span class="code-line"></span>
    <span class="code-line">    <span class="cmt">// SLTForge — Service Level Testing Platform</span></span>
    <span class="code-line">    <span class="cmt">// WireMock · MySQL · SQS · Aerospike · LLM agent (Claude Code + Daytona)</span></span>
    <span class="code-line">    <span class="cmt">// Kubernetes sandboxes on demand · rolled out across 15+ production services.</span></span>
    <span class="code-line chips-line">
      <div class="metric-chips">
        <div class="chip chip-blue"><span class="chip-value">15+</span><span class="chip-label">SERVICES ROLLED OUT</span></div>
        <div class="chip chip-blue"><span class="chip-value">∞</span><span class="chip-label">K8S SANDBOXES ON-DEMAND</span></div>
      </div>
    </span>
    <span class="code-line">    <span class="kw">public</span> <span class="cls">Framework</span> <span class="fn">sltForge</span>() &#123;</span>
    <span class="code-line">        <span class="kw">return new</span> <span class="cls">Framework</span>(services = <span class="num">15</span>, sandboxes = <span class="str">"on-demand"</span>);</span>
    <span class="code-line">    &#125;</span>
    <span class="code-line"></span>
    <span class="code-line">    <span class="cmt">// Statement Service Performance</span></span>
    <span class="code-line">    <span class="cmt">// Eliminated redundant upstream calls in a 50M+ monthly statements pipeline.</span></span>
    <span class="code-line">    <span class="cmt">// Reduced system load 20%, decreased response latency.</span></span>
    <span class="code-line chips-line">
      <div class="metric-chips">
        <div class="chip chip-blue"><span class="chip-value">50M+</span><span class="chip-label">STATEMENTS/MO</span></div>
        <div class="chip chip-blue"><span class="chip-value">16M</span><span class="chip-label">USERS</span></div>
        <div class="chip chip-orange"><span class="chip-value">↓20%</span><span class="chip-label">SYSTEM LOAD</span></div>
      </div>
    </span>
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
    <span class="code-line chips-line">
      <div class="metric-chips">
        <div class="chip chip-orange"><span class="chip-value">1.5d→5m</span><span class="chip-label">CONFIG TIME</span></div>
        <div class="chip chip-orange"><span class="chip-value">70%+</span><span class="chip-label">EFFORT CUT</span></div>
      </div>
    </span>
    <span class="code-line">    <span class="kw">public</span> <span class="cls">Tool</span> <span class="fn">llmConfigGenerator</span>() &#123;</span>
    <span class="code-line">        <span class="kw">return new</span> <span class="cls">Tool</span>(timeReduction = <span class="str">"1.5d → 5min"</span>, effortCut = <span class="str">"70%+"</span>);</span>
    <span class="code-line">    &#125;</span>
    <span class="code-line"></span>
    <span class="code-line">    <span class="cmt">// MITC Change Detection</span></span>
    <span class="code-line">    <span class="cmt">// Challenged over-engineered scraper proposal; deployed n8n SHA-hash workflow.</span></span>
    <span class="code-line">    <span class="cmt">// Routes bank T&amp;C diffs to Slack. Zero infrastructure cost.</span></span>
    <span class="code-line chips-line">
      <div class="metric-chips">
        <div class="chip chip-blue"><span class="chip-value">$0</span><span class="chip-label">INFRA COST</span></div>
      </div>
    </span>
    <span class="code-line">    <span class="kw">public</span> <span class="cls">Workflow</span> <span class="fn">mitcChangeDetection</span>() &#123;</span>
    <span class="code-line">        <span class="kw">return new</span> <span class="cls">Workflow</span>(tool = <span class="str">"n8n"</span>, infraCost = <span class="num">0</span>);</span>
    <span class="code-line">    &#125;</span>
    <span class="code-line">&#125;</span>
    <span class="code-line"></span>
    <span class="code-line"><span class="ann">@Company</span>(<span class="key">name</span> = <span class="str">"CRED"</span>, <span class="key">period</span> = <span class="str">"Mar 2023 – Mar 2024"</span>)</span>
    <span class="code-line"><span class="kw">public class</span> <span class="cls">SoftwareEngineer</span> <span class="kw">extends</span> <span class="cls">QualityAndAutomation</span> &#123;</span>
    <span class="code-line"></span>
    <span class="code-line">    <span class="cmt">// OO automation frameworks across 10+ Spring Boot and Dropwizard microservices.</span></span>
    <span class="code-line">    <span class="cmt">// Enabled scalable continuous delivery across CRED's distributed financial platform.</span></span>
    <span class="code-line chips-line">
      <div class="metric-chips">
        <div class="chip chip-blue"><span class="chip-value">10+</span><span class="chip-label">MICROSERVICES</span></div>
      </div>
    </span>
    <span class="code-line">    <span class="kw">public</span> <span class="cls">Framework</span> <span class="fn">automationFramework</span>() &#123;</span>
    <span class="code-line">        <span class="kw">return new</span> <span class="cls">Framework</span>(services = <span class="num">10</span>, type = <span class="str">"Spring Boot + Dropwizard"</span>);</span>
    <span class="code-line">    &#125;</span>
    <span class="code-line"></span>
    <span class="code-line">    <span class="cmt">// Led Java 8 → 21 upgrades across production services.</span></span>
    <span class="code-line">    <span class="cmt">// Contributed Cassandra and DB-to-POJO utilities to QA libraries across 20+ teams.</span></span>
    <span class="code-line chips-line">
      <div class="metric-chips">
        <div class="chip chip-orange"><span class="chip-value">8→21</span><span class="chip-label">JAVA UPGRADE</span></div>
        <div class="chip chip-blue"><span class="chip-value">20+</span><span class="chip-label">TEAMS IMPACTED</span></div>
      </div>
    </span>
    <span class="code-line">    <span class="kw">public</span> <span class="cls">Migration</span> <span class="fn">javaUpgrade</span>() &#123;</span>
    <span class="code-line">        <span class="kw">return new</span> <span class="cls">Migration</span>(from = <span class="str">"Java 8"</span>, to = <span class="str">"Java 21"</span>, teamsImpacted = <span class="num">20</span>);</span>
    <span class="code-line">    &#125;</span>
    <span class="code-line"></span>
    <span class="code-line">    <span class="cmt">// Large-scale PDF validation: 5,000+ statements/month, 40+ fields.</span></span>
    <span class="code-line">    <span class="cmt">// Cross-validated raw PDFs against extraction output.</span></span>
    <span class="code-line chips-line">
      <div class="metric-chips">
        <div class="chip chip-blue"><span class="chip-value">5K+</span><span class="chip-label">STATEMENTS/MO</span></div>
        <div class="chip chip-blue"><span class="chip-value">40+</span><span class="chip-label">FIELDS VALIDATED</span></div>
      </div>
    </span>
    <span class="code-line">    <span class="kw">public</span> <span class="cls">Validator</span> <span class="fn">pdfValidation</span>() &#123;</span>
    <span class="code-line">        <span class="kw">return new</span> <span class="cls">Validator</span>(statementsPerMonth = <span class="num">5000</span>, fields = <span class="num">40</span>);</span>
    <span class="code-line">    &#125;</span>
    <span class="code-line">&#125;</span>
    <span class="code-line"></span>
    <span class="code-line"><span class="ann">@Company</span>(<span class="key">name</span> = <span class="str">"API Holdings (PharmEasy)"</span>, <span class="key">period</span> = <span class="str">"Jan 2022 – Mar 2023"</span>)</span>
    <span class="code-line"><span class="kw">public class</span> <span class="cls">SoftwareEngineer</span> <span class="kw">extends</span> <span class="cls">QualityEngineering</span> &#123;</span>
    <span class="code-line"></span>
    <span class="code-line">    <span class="cmt">// E2E test automation for real-time home diagnostics platform.</span></span>
    <span class="code-line">    <span class="cmt">// +30% test coverage · -50% manual effort.</span></span>
    <span class="code-line">    <span class="cmt">// Debugged cross-service failures via distributed log tracing.</span></span>
    <span class="code-line chips-line">
      <div class="metric-chips">
        <div class="chip chip-green"><span class="chip-value">+30%</span><span class="chip-label">TEST COVERAGE</span></div>
        <div class="chip chip-orange"><span class="chip-value">-50%</span><span class="chip-label">MANUAL EFFORT</span></div>
      </div>
    </span>
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

**lineCount = 96:** Original 87 code-lines + 9 `.chips-line` elements (one per method with metrics).

- [ ] **Step 2: Build**

```bash
npm run build
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/sections/ExperienceSection.astro
git commit -m "feat: add glowing metric chips to experience.java section"
```

---

## Task 7: Fix page title

**Files:**
- Modify: `src/layouts/IDELayout.astro`

- [ ] **Step 1: Change `<title>`**

In `src/layouts/IDELayout.astro`, find:
```html
    <title>Anmol Badi — Software Engineer</title>
```
Replace with:
```html
    <title>Anmol</title>
```

- [ ] **Step 2: Build**

```bash
npm run build
```

Expected: `dist/index.html` `<title>` is `Anmol`.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/IDELayout.astro
git commit -m "fix: page title to Anmol"
```

---

## Task 8: Update Playwright tests and run full suite

**Files:**
- Modify: `tests/portfolio.spec.ts`

- [ ] **Step 1: Fix the broken name assertion**

In `tests/portfolio.spec.ts` line 40, replace:
```typescript
    await expect(page.locator('#readme')).toContainText('Anmol Badi');
```
With:
```typescript
    await expect(page.locator('#readme')).toContainText('Anmol');
```

- [ ] **Step 2: Add hero avatar and metric chip tests**

Add a new `test.describe('visual enhancements')` block after the existing `test.describe('sections')` block:

```typescript
test.describe('visual enhancements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('README hero avatar is visible', async ({ page }) => {
    await expect(page.locator('.hero-avatar')).toBeVisible();
    await expect(page.locator('.hero-avatar')).toContainText('A');
  });

  test('README hero name shows Anmol', async ({ page }) => {
    await expect(page.locator('.hero-name')).toBeVisible();
    await expect(page.locator('.hero-name')).toContainText('Anmol');
  });

  test('experience section has metric chips', async ({ page }) => {
    await expect(page.locator('#experience .metric-chips').first()).toBeVisible();
  });

  test('metric chips contain impact values', async ({ page }) => {
    await expect(page.locator('#experience')).toContainText('7h→1h');
    await expect(page.locator('#experience')).toContainText('50M+');
    await expect(page.locator('#experience')).toContainText('16M');
  });

  test('page title is Anmol', async ({ page }) => {
    await expect(page).toHaveTitle('Anmol');
  });
});
```

- [ ] **Step 3: Run the full test suite**

```bash
npm run build && npx astro preview --port 4321 &
sleep 3
npx playwright test --reporter=line
pkill -f "astro preview" 2>/dev/null || true
```

Expected: **20/20 tests pass** (15 existing + 5 new).

If `'README section exists with name'` fails with "Anmol Badi not found" — you missed Step 1 above.
If `'.hero-avatar' not found` — the `.hero-block` CSS class in global.css has a typo or the ReadmeSection hero-block element is missing.

- [ ] **Step 4: Commit**

```bash
git add tests/portfolio.spec.ts
git commit -m "test: update name assertion, add visual enhancement tests"
```

---

## Self-Review

**Spec coverage:**
- ✅ `--bg`/`--panel`/`--gutter-bg`/`--gutter` updated → Task 1
- ✅ `.num` glow → Task 1
- ✅ `.md-h1`/`.md-h2` glow → Task 1
- ✅ Titlebar gradient + traffic light glow → Task 3
- ✅ Statusbar dark bg + blue border → Task 4
- ✅ Active sidebar orange → Task 4
- ✅ Chip CSS → Task 2
- ✅ Hero CSS → Task 2
- ✅ All 9 chip rows in ExperienceSection → Task 6
- ✅ `cadenceMigration` has no chips (correct per spec) → Task 6
- ✅ `lineCount` 87→96 → Task 6
- ✅ Hero block in ReadmeSection, `lineCount` 22→21 → Task 5
- ✅ Name "Anmol" everywhere → Tasks 5, 7
- ✅ `<title>Anmol</title>` → Task 7

**Placeholder scan:** No TBDs. All code is fully specified.

**Type consistency:**
- `.chips-line` defined in Task 2 CSS, used in Task 6 HTML ✅
- `.hero-block`, `.hero-avatar`, `.hero-name` defined in Task 2, used in Task 5 ✅
- `.chip-orange`, `.chip-blue`, `.chip-green` defined in Task 2, used in Task 6 ✅
- `.chip-value`, `.chip-label` defined in Task 2, used in Task 6 ✅
