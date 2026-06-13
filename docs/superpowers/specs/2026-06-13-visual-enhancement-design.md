# Visual Enhancement — Design Spec
**Date:** 2026-06-13

---

## Goal

Make the portfolio feel visually rich and memorable — not just functional. Add colour, material depth, glowing metric chips, and a proper hero identity to an existing IntelliJ Darcula + Vim IDE-themed Astro site.

---

## Approved Design Decisions

| Decision | Choice |
|---|---|
| Colour / material treatment | Neon on black |
| Content visual weight | Glowing metric chips |
| README hero | Initials avatar (A) |
| Name everywhere | "Anmol" (not "Anmol Badi") |
| Page title | "Anmol" |

---

## 1. Colour / Material — Neon on Black

### Background & Panel colours

| Token | Old | New |
|---|---|---|
| `--bg` | `#2B2B2B` | `#0d0d0d` |
| `--panel` | `#3C3F41` | `#111111` |
| `--gutter-bg` | `#313335` | `#0f0f0f` |
| `--gutter` | `#606366` | `#2a2a2a` |

Borders shift from solid grey to tinted/near-invisible:
- Section dividers: `#1a1a1a`
- Panel/sidebar borders: `rgba(255,255,255,0.05)`
- Titlebar bottom: `rgba(204,120,50,0.20)` (orange tint)
- Statusbar top: `rgba(104,151,187,0.12)` (blue tint)

### Titlebar

```css
background: linear-gradient(180deg, #1a1a1a, #111);
border-bottom: 1px solid rgba(204, 120, 50, 0.20);
```

### Traffic lights — add glow

```css
.dot-red    { box-shadow: 0 0 8px #FF5F5799; }
.dot-yellow { box-shadow: 0 0 8px #FEBC2E99; }
.dot-green  { box-shadow: 0 0 8px #28C84099; }
```

### Active sidebar file row

```css
.file-row.active {
  background: #1a0d00;
  border-right: 2px solid #CC7832;
  color: #CC7832;
}
```

### Heading glow (md-h1, md-h2)

```css
.md-h1, .md-h2 { text-shadow: 0 0 20px rgba(204, 120, 50, 0.35); }
```

### Number glow (.num)

```css
.num { text-shadow: 0 0 8px rgba(104, 151, 187, 0.4); }
```

### Statusbar

```css
.statusbar {
  background: #111;
  border-top: 1px solid rgba(104, 151, 187, 0.12);
}
```

---

## 2. Metric Chips — experience.java

Each `.code-line` block that contains impact numbers gets a row of glowing stat chips rendered immediately below the comment block, before the method signature.

### Chip component pattern

```html
<div class="metric-chips">
  <div class="chip chip-orange">
    <span class="chip-value">7h→1h</span>
    <span class="chip-label">PROCESS TIME</span>
  </div>
  <div class="chip chip-blue">
    <span class="chip-value">6</span>
    <span class="chip-label">BANKS</span>
  </div>
</div>
```

### Chip CSS

```css
.metric-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding: 8px 0 12px 0;
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

.chip-orange {
  background: #140d00;
  border-color: rgba(204, 120, 50, 0.25);
}
.chip-orange .chip-value {
  color: #FFC66D;
  text-shadow: 0 0 10px rgba(255, 198, 109, 0.5);
}

.chip-blue {
  background: #0a0d14;
  border-color: rgba(104, 151, 187, 0.25);
}
.chip-blue .chip-value {
  color: #6897BB;
  text-shadow: 0 0 10px rgba(104, 151, 187, 0.5);
}

.chip-green {
  background: #0a140a;
  border-color: rgba(106, 135, 89, 0.25);
}
.chip-green .chip-value {
  color: #6A8759;
  text-shadow: 0 0 10px rgba(106, 135, 89, 0.5);
}
```

### Chip colour rules

| Value type | Chip colour |
|---|---|
| Time savings / efficiency | orange (`chip-orange`) |
| Scale / count / users | blue (`chip-blue`) |
| Coverage / quality / code | green (`chip-green`) |

### Full chip data per employer block

**CRED Apr 2024 – Present:**

| Method | Chips |
|---|---|
| `bbpsOnboardingAgent` | 🟠 7h→1h PROCESS TIME · 🔵 6 BANKS · 🔵 5 MICROSERVICES |
| `sltForge` | 🔵 15+ SERVICES · 🔵 ∞ K8S SANDBOXES ON-DEMAND |
| `statementPerformance` | 🔵 50M+ STATEMENTS/MO · 🔵 16M USERS · 🟠 ↓20% SYSTEM LOAD |
| `llmConfigGenerator` | 🟠 1.5d→5m CONFIG TIME · 🟠 70%+ EFFORT CUT |
| `mitcChangeDetection` | 🔵 0 INFRA COST |

**CRED Mar 2023 – Mar 2024:**

| Method | Chips |
|---|---|
| `automationFramework` | 🔵 10+ MICROSERVICES |
| `javaUpgrade` | 🟠 8→21 JAVA · 🔵 20+ TEAMS |
| `pdfValidation` | 🔵 5K+ STATEMENTS/MO · 🔵 40+ FIELDS |

**PharmEasy:**

| Method | Chips |
|---|---|
| `e2eAutomation` | 🟢 +30% TEST COVERAGE · 🟠 -50% MANUAL EFFORT |

### Line count update

Adding chip rows increases the rendered line count in `ExperienceSection.astro`. After inserting chips, recount all `.code-line` spans and update `lineCount` to match.

---

## 3. README Hero — Initials Avatar + Gradient Name

### Avatar

```html
<div class="hero-avatar">A</div>
```

```css
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
}
```

### Gradient name heading

The `# Anmol` line gets a gradient text treatment:

```html
<span class="hero-name"># Anmol</span>
```

```css
.hero-name {
  font-size: 22px;
  font-weight: 700;
  background: linear-gradient(90deg, #CC7832, #FFC66D);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}
```

### Hero layout

Avatar and name sit side-by-side in a flex row at the top of `ReadmeSection`, replacing the plain `# Anmol` code-line. The hero block lives inside `.code-content` but must override `white-space: pre-wrap`:

```css
.hero-block {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 16px;
  white-space: normal; /* override parent pre-wrap */
}
```

The remaining `code-line` spans follow below it as normal.

---

## 4. Name Corrections

All occurrences of "Anmol Badi" → "Anmol":

| Location | Old | New |
|---|---|---|
| `src/layouts/IDELayout.astro` `<title>` | `Anmol Badi — Software Engineer` | `Anmol` |
| `src/sections/ReadmeSection.astro` heading | `# Anmol Badi` | `# Anmol` |
| `src/sections/ReadmeSection.astro` avatar | n/a (new) | `A` |
| `src/sections/ContactSection.astro` | (no reference to full name) | — |

---

## 5. Files Changed

| File | Change |
|---|---|
| `src/styles/global.css` | Update `--bg`, `--panel`, `--gutter-bg`, `--gutter` tokens; add glow to `.num`, `.md-h1`, `.md-h2`; add `.metric-chips`, `.chip`, `.chip-*` classes; add `.hero-avatar`, `.hero-name`; update `.statusbar`, `.file-row.active`, `.dot-*` |
| `src/components/Titlebar.astro` | Add gradient bg + tinted border; add `box-shadow` to traffic light dots |
| `src/components/VimStatusBar.astro` | Update bg to `#111`, add top border |
| `src/sections/ReadmeSection.astro` | Replace `# Anmol Badi` code-line with avatar + gradient-name hero block; update `lineCount` |
| `src/sections/ExperienceSection.astro` | Insert `.metric-chips` rows per method; update `lineCount` |
| `src/layouts/IDELayout.astro` | Change `<title>` to `Anmol` |

---

## Out of Scope

- Profile photo (real image) — using initials only
- Animation on metric chips (count-up on scroll) — deferred
- Changes to skills.json or contact.md sections
- Mobile-specific changes beyond what inherits naturally
