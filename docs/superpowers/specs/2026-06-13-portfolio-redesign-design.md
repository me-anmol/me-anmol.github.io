# Portfolio Redesign — Design Spec
**Date:** 2026-06-13
**Author:** Anmol Badi

---

## Goal

Redesign me-anmol.github.io into a recruiter-magnet portfolio targeting US/international companies (FAANG + startups). The site must reflect Anmol's identity as a senior backend/infra engineer who ships LLM agents at scale.

---

## Stack

**Astro + Tailwind CSS**
- Static output — deploys to GitHub Pages unchanged
- Component-based — no duplication across sections
- No server required

---

## Aesthetic

**IntelliJ IDEA (Darcula theme) + Vim mode.**

The entire page is a fake IDE window. Every visual element maps to a real IntelliJ/Vim UI primitive. Font: JetBrains Mono throughout.

### Color Palette

| Role | Hex | Usage |
|---|---|---|
| Window bg | `#2B2B2B` | Page background |
| Panel bg | `#3C3F41` | Sidebar, titlebar, statusbar |
| Gutter bg | `#313335` | Line number column |
| Gutter text | `#606366` | Line numbers |
| Body text | `#A9B7C6` | All prose |
| Keyword orange | `#CC7832` | Headings, Java keywords, JSON keys |
| String green | `#6A8759` | String values, links |
| Number blue | `#6897BB` | Metrics (16M, 50M+, 7h→1h), numbers |
| Comment gray | `#808080` | Comments, secondary text |
| Selection blue | `#214283` | Active tab underline, hover highlight |

---

## Layout Shell

Three-panel IDE layout:

```
┌─────────────────────────────────────────────────────────┐
│ ● ● ●  anmol — portfolio                               │  titlebar
├──────────────┬──────────────────────────────────────────┤
│ PROJECT      │ README.md ×  │ experience.java │ ...     │  tab bar
│ ─────────    ├──────────────────────────────────────────┤
│ 📁 anmol/   │  1  │                                    │
│   README.md  │  2  │  editor content                   │  editor
│   exp.java   │  3  │                                    │
│   skills.json│     │                                    │
│   contact.md │     │                                    │
│              │     │                                    │
│ STRUCTURE    │     │                                    │
│   Summary    │     │                                    │
│   Experience │     │                                    │
│   Skills     │     │                                    │
├──────────────┴──────────────────────────────────────────┤
│ -- NORMAL --     anmol/README.md     UTF-8  LF  Ln 1,1 │  vim statusbar
└─────────────────────────────────────────────────────────┘
```

**Left sidebar** (two stacked panels):
- PROJECT: file tree — clicking a file navigates to that section and opens a tab
- STRUCTURE: outline anchors for current file's headings

**Tab bar:** clicking a file opens a tab with blue underline. Tabs are closeable (×) but reopen on sidebar click.

**Editor area:** line-numbered gutter on left, content on right with syntax highlighting.

**Vim statusbar** (fixed bottom):
- Left: `-- NORMAL --` (green) — briefly shows `-- INSERT --` on navigation
- Center: current filename — updates as user scrolls between sections
- Right: `Ln X, Col 1` — line counter ticks as user scrolls

---

## Content / File Mapping

### `README.md` — Hero + About

Markdown syntax highlighted. Opens by default on page load.

```markdown
# Anmol Badi

**Software Engineer** · Platform & Infrastructure
_CRED · Bangalore · Open to US/Remote_

> Software engineer with 3+ years designing and scaling production
> systems at CRED — a fintech platform serving 16M users and
> processing 50M+ credit card statements monthly.
> Specializes in distributed systems and LLM agent orchestration.

[GitHub](…) · [LinkedIn](…) · [Email](…) · [Resume ↓](…)
```

Rendering: `#` headings orange, `**bold**` white-bold, `_italic_` gray, `>` blockquote gray italic, links green underlined.

---

### `experience.java` — Work History

Java syntax highlighted. One scrollable block per employer. Companies as class names, roles as annotations, bullet points as methods + comments.

```java
@Company(name = "CRED", period = "Apr 2024 – Present")
public class SoftwareEngineer extends PlatformAndInfrastructure {

    // BBPS Bank Onboarding Agent
    // LLM agent across 5 microservices → 6 banks onboarded
    // 7-hour process → under 1 hour. Live in production.
    public Agent bbpsOnboardingAgent() {
        return new LLMAgent(banks = 6, timeReduction = "7h → 1h");
    }

    // SLTForge — org-wide SLT framework
    // WireMock · MySQL · SQS · Aerospike · Kubernetes sandboxes
    // Rolled out across 15+ production services org-wide.
    public Framework sltForge() {
        return new Framework(services = 15, sandboxes = "on-demand");
    }

    // Statement Service Performance
    // 50M+ monthly statements · 16M users
    // Eliminated redundant upstream calls → 20% load reduction.
    public Optimization statementPerformance() {
        return new Optimization(latencyReduction = "20%");
    }

    // Cadence Migration: MySQL → Cassandra
    // Debugged GoCQL race condition; co-authored migration plan.
    public Migration cadenceMigration() {
        return new Migration(from = "MySQL", to = "Cassandra");
    }

    // LLM Config Generator
    // Auto-generates JSON parser configs: 1.5 days → 5 minutes.
    public Tool llmConfigGenerator() {
        return new Tool(timeReduction = "1.5d → 5min", effortCut = "70%+");
    }
}

@Company(name = "API Holdings (PharmEasy)", period = "Jan 2022 – Mar 2023")
public class SoftwareEngineer extends Automation {

    // E2E test automation framework for real-time home diagnostics.
    // +30% test coverage, -50% manual effort.
    public Framework e2eAutomation() {
        return new Framework(coverageIncrease = "30%", effortCut = "50%");
    }
}

@Company(name = "Chipster Technologies", period = "Aug 2021 – Jan 2022")
public class SoftwareEngineeringIntern {

    // Mobile features, system design, cross-functional collaboration.
    public void mobileDevelopment() { /* production-ready interfaces */ }
}
```

Syntax colors: `@Company` annotation orange, `public class` keyword orange, method names white, `return new` orange, string values green, numbers blue, comments gray.

---

### `skills.json` — Technical Skills

```json
{
  "languages":   ["Java", "Python"],
  "frameworks":  ["Spring Boot", "Dropwizard", "TestNG"],
  "systems":     ["Distributed Systems", "Microservices", "Data Pipelines",
                  "Large-scale System Design", "High Reliability"],
  "databases":   ["MySQL", "Apache Cassandra"],
  "infra":       ["Kubernetes", "Docker", "AWS", "Daytona", "Jenkins", "CI/CD"],
  "ai_llm":      ["LLM Orchestration", "Agent Design", "Prompt Engineering",
                  "AI-powered Code Generation"]
}
```

JSON keys orange, string values green, brackets white.

---

### `contact.md` — Contact + Links

Minimal markdown. Links to GitHub, LinkedIn, email. Resume download button styled as a terminal command: `$ curl -O anmol.dev/resume.pdf`.

---

## Interactions

### On load
- `README.md` tab opens, content types in character-by-character (150ms/char cadence)
- Blinking block cursor visible until animation completes

### Navigation
- Sidebar file click: smooth-scrolls to section, opens/activates tab, statusbar updates filename
- STRUCTURE outline click: in-page anchor scroll
- Tab click: same as sidebar click
- Statusbar `Ln X` ticks up in real time as user scrolls

### Hover
- Sidebar file: subtle `#214283` row highlight
- Experience method block: `#214283` line-highlight background, like IntelliJ current-line indicator

### Vim statusbar mode
- Default: `-- NORMAL --` in green
- On any navigation click: briefly flashes `-- INSERT --` then returns to `-- NORMAL --`

---

## Mobile (< 768px)

- Sidebar hidden by default — hamburger in titlebar toggles overlay drawer
- Tab bar becomes horizontal scroll strip
- Line number gutter hidden
- Statusbar: `-- NORMAL --` + filename only (Ln/Col hidden)
- Editor content reflows to full width

---

## Pages / Routing

Single page (`index.html`). All sections are in-page. No routing needed. Resume links to `/assets/resume.pdf` (existing).

---

## Out of Scope

- Blog / writing section
- Dark/light theme toggle
- Contact form (links only)
- Analytics
