# Projects Section — Design Spec

**Date:** 2026-06-27  
**Status:** Approved

---

## Overview

Add a `projects.go` section to the IDE-themed portfolio at me-anmol.github.io. The section lives in the sidebar file tree alongside `experience.java` and `skills.json`, and is styled as Go source code — matching the existing pattern where each file's language reflects its content.

---

## Approach

Option A: dedicated `projects.go` section. New Astro section component, new sidebar entry, new outline entry. Scales naturally as more projects are added.

---

## Sidebar Changes

`src/components/Sidebar.astro` — add `projects.go` between `experience.java` and `skills.json`:

```
▼ anmol
  📄 README.md
  📄 experience.java
  📄 projects.go       ← new
  📄 skills.json
  📄 contact.md
```

STRUCTURE panel gets a `Projects` outline entry pointing to the new section's `id`.

---

## New File: `src/sections/ProjectsSection.astro`

- `data-filename="anmol/projects.go"`
- `id="projects"`
- Content styled as Go package/struct syntax

### Content

```go
package projects

// EmailScraper — self-hosted Go service
// Gmail OAuth2 · SQLite · chi HTTP · pluggable provider + transform pipeline
// Define filter templates, trigger scrapes, extract OTPs from email body.
[chips: Go, SQLite, Gmail OAuth2, REST]
type EmailScraper struct {
    Repo  string // "github.com/me-anmol/EmailScraper"
    Stack string // "Go · chi · SQLite · Gmail API"
    Arch  string // "single binary, pluggable MailProvider + Transform pipeline"
}

func (e EmailScraper) Highlight() string {
    return "OTP extraction · dedup by provider ID · zero infra"
}
```

- Chips: tech tags (Go, SQLite, Gmail OAuth2, REST) — blue chip style matching experience section
- `Repo` value links to `https://github.com/me-anmol/EmailScraper`

---

## Pages Changes

`src/pages/index.astro` — import and render `ProjectsSection` between `ExperienceSection` and `SkillsSection`.

---

## Key Decisions

- **Go syntax** — project is written in Go; file extension and syntax match
- **Tech chips not metric chips** — side project has no prod numbers; tech tags are the right signal
- **Blue chips** — consistent with infra/scale chips in experience section
- **Repo link on the Repo field value** — subtle, fits the code aesthetic
- **Position in sidebar** — after experience, before skills; projects sit logically between "what I've done at work" and "what I know"
