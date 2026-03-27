# Power Signal Diagnostic™ — Master Project Brief
**Version:** 2.0
**Owner:** Kendra Lewis / The Boss Architect
**Last Updated:** March 2026

---

## 1. What This Project Is

The Power Signal Diagnostic™ is Kendra's signature methodology — a strategic diagnostic platform she builds for clients and licenses as a service. Think of it the way Russell Brunson owns the funnel: the Power Signal Diagnostic is Kendra's signature mechanism.

It is not a single diagnostic. It is a **repeatable platform architecture** that produces custom diagnostics tailored to each client's expertise and offer.

Every Power Signal Diagnostic is designed to:
- Reveal the structural gap the client's ideal buyer cannot see
- Quantify that gap (in dollars, risk exposure, or strategic misalignment)
- Position the expert as the architect of the solution
- Convert qualified prospects into high-ticket strategy consultations

The diagnostic must feel credible enough that someone could reasonably expect to pay $500–$1,000 for it alone. That credibility is what attracts serious, analytical buyers.

**Business Model:** Kendra owns all infrastructure. Clients license access and point their custom domain to her Vercel deployment. This is a platform play — not a freelance build.

---

## 2. Proven Architecture (Built & Deployed)

Every diagnostic follows this exact flow:

```
Landing Page (intro screen)
↓
Contact Form — FIRST, before questions
  → /api/save-session → creates Supabase row → returns sessionId
  → /api/ghl-start → upserts GHL contact → tag: diagnostic-started
↓
Diagnostic Questions (16–20 questions, 4 quadrants)
↓
Scoring Engine — runScoring() in src/client/scoring.ts
↓
AI Commentary — OpenAI GPT-4o via src/client/prompt.ts
↓
  → /api/update-session → saves all results to Supabase
  → /api/ghl-complete → updates GHL with scores + report URL
↓
Redirect to /report/[session-id] — persistent URL
↓
3-Tab Report Page:
  Tab 1: Your Summary (score, metrics, AI interpretation, financial impact)
  Tab 2: Breakdown (quadrant cards with scores and interpretation)
  Tab 3: [Action Tab] (VSL, pre-qual modal, calendar booking, offer blocks)
↓
Pre-Qualification Modal (5 questions before calendar appears)
↓
Embedded GHL Calendar (pre-filled with contact info + prequal answers)
↓
Standalone /schedule page (same VSL page, no session required)
```

---

## 3. Technical Architecture

### Tech Stack
- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS
- **AI:** OpenAI GPT-4o
- **Database:** Supabase (tba-client-platform project) — persistent session storage
- **CRM:** GoHighLevel Contact Upsert API
- **Hosting:** Vercel (Kendra's account)
- **Build Tool:** Claude Code

### Repository Strategy
- **Template Repo:** `power-signal-diagnostic-template` (TBAadmin2025 GitHub)
- **Per Client:** Clone template → replace `src/client/` only → deploy
- **Client Customization:** Everything in `src/client/` — nothing else ever changes

### Folder Structure
```
src/
├── client/                    ← ONLY folder that changes per client
│   ├── config.ts              ← brand, copy, VSL, pre-qual, GHL keys, quadrants
│   ├── questions.ts           ← all diagnostic questions and answer options
│   ├── scoring.ts             ← custom scoring engine, exports runScoring()
│   └── prompt.ts              ← AI system prompt + buildUserMessage()
├── components/
│   └── WealthRedirectionContent.tsx  ← shared VSL/pre-qual component
├── pages/
│   ├── Report.tsx             ← 3-tab persistent report page
│   └── Schedule.tsx           ← standalone /schedule VSL page
├── styles/
│   └── theme.ts               ← brand theming system (5 vibes)
└── main.tsx                   ← routing + theme application
api/
├── save-session.ts            ← creates Supabase session row
├── update-session.ts          ← updates session after completion
├── get-session.ts             ← fetches session for report page
├── ai-commentary.ts           ← calls OpenAI, uses client/prompt.ts
├── ghl-start.ts               ← GHL contact upsert on form submit
└── ghl-complete.ts            ← GHL update with scores on completion
```

---

## 4. Database Architecture

**Supabase Project:** `tba-client-platform`
**Purpose:** All client diagnostic builds — not Kendra's own programs

### Schema
```sql
tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  ghl_location_id TEXT,
  ghl_api_key TEXT,
  calendar_url TEXT,
  ghl_field_score TEXT,
  ghl_field_label TEXT,
  ghl_field_report_url TEXT,
  ghl_field_commentary TEXT,
  ghl_field_date TEXT,
  custom_domain TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
)

diagnostic_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  company_name TEXT,
  overall_score INTEGER,
  score_label TEXT,
  raw_answers JSONB,
  calculated_scores JSONB,
  ai_commentary JSONB,
  report_url TEXT,
  ghl_contact_id TEXT,
  ghl_synced BOOLEAN DEFAULT FALSE,
  is_completed BOOLEAN DEFAULT FALSE,
  diagnostic_status TEXT DEFAULT 'In Progress',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)
```

### Tenant Registry
| Tenant | Slug | Status |
|---|---|---|
| VLARI Wealth Redirection Diagnostic | vlari | Live |
| Brooke Benjamin (TBD) | TBD | In Progress |
| Client 3 (TBD) | TBD | Not Started |

---

## 5. GHL Integration Standard

### Contact Upsert API
- **Endpoint:** `POST https://services.leadconnectorhq.com/contacts/upsert`
- **Auth:** Bearer token (client's GHL API key)
- **Version header:** `2021-07-28`

### Standard Custom Fields (every client creates these)
| Field Name | GHL Key | Type |
|---|---|---|
| Diagnostic Overall Score | `diagnostic_overall_score` | Number |
| Diagnostic Financial Impact | `diagnostic_financial_impact` | Text |
| Diagnostic Commentary | `diagnostic_commentary` | Text Area |
| Diagnostic Report URL | `diagnostic_report_url` | Text |
| Diagnostic Completed Date | `diagnostic_completed_date` | Date |
| Pre-Qual Answers (calendar hidden field) | `diagnostic_prequal_answers` | Hidden |

### Standard Tags
| Tag | When Applied |
|---|---|
| `diagnostic-started` | Contact form submitted |
| `diagnostic-completed` | Report generated |

### Calendar Pre-fill Query Keys
| Field | Key |
|---|---|
| First name | `first_name` |
| Email | `email` |
| Pre-qual answers | `diagnostic_prequal_answers` |

---

## 6. Environment Variables (per Vercel deployment)

```
OPENAI_API_KEY         ← OpenAI API key
SUPABASE_URL           ← tba-client-platform project URL
SUPABASE_ANON_KEY      ← tba-client-platform anon key
GHL_LOCATION_ID        ← client's GHL sub-account location ID
GHL_API_KEY            ← client's GHL private integration token
TENANT_ID              ← UUID from tenants table for this client
```

---

## 7. Brand Theming System

Every client build gets a brand vibe that drives colors, typography, and aesthetic:

| Vibe | Description | Example Client |
|---|---|---|
| `luxury` | Dark background, gold accents, serif italic headings | Terry Lamb / VLARI |
| `professional` | Clean blues, sans serif, structured | TBD |
| `bold` | High contrast, strong typography, energetic | TBD |
| `clean` | Minimal, whitespace, modern | TBD |
| `warm` | Earth tones, approachable, friendly | TBD |

Set in `src/client/config.ts` under `brand.vibe`.

---

## 8. New Client Build Process

**Step 1 — Supabase**
Insert new row in `tenants` table in `tba-client-platform`. Copy the UUID.

**Step 2 — GitHub**
Clone `power-signal-diagnostic-template` → rename for client → push to new repo.

**Step 3 — Replace src/client/**
- `config.ts` — brand, copy, VSL content, pre-qual questions, GHL keys
- `questions.ts` — all diagnostic questions
- `scoring.ts` — custom scoring engine
- `prompt.ts` — AI system prompt and user message builder

**Step 4 — Vercel**
Import new repo → add all 6 environment variables → deploy.

**Step 5 — GHL Setup (client does this)**
Create 5 standard custom fields → send field IDs → add to tenant row in Supabase.

**Step 6 — Domain**
Client points custom domain to Vercel deployment.

---

## 9. Active Client Builds

### Client 1 — Terry Lamb / VLARI
**Diagnostic Name:** Wealth Redirection Diagnostic
**Focus:** Tax strategy and wealth redirection for high earners
**Structural Gap:** What they're overpaying in taxes and failing to reinvest
**Repo:** `Terry-Lamb--Power-signal-diagnostic` (TBAadmin2025)
**Live URL:** TBD — deployed to Vercel
**Tenant UUID:** `1b51292d-8260-4d5a-b292-4cbc970b5453`
**GHL Calendar:** https://links.quietwealthengine.com/widget/bookings/terry-lamb-personal-calendar-fpt4gikvv
**Status:** ✅ Built and deployed
**Remaining:** Verify TENANT_ID env var in Vercel, confirm GHL field IDs wired

---

### Client 2 — Brooke Benjamin
**Diagnostic Name:** Wealth Systems Audit (LeveledUp Money)
**Focus:** Wealth plan assessment and identifying missing components
**Structural Gap:** Gaps in estate structure, missing legal/financial protections
**Repo:** TBD
**Status:** ⚠️ Built but broken — using URL-based storage, needs Supabase migration
**Remaining:** Migrate to Supabase, wire GHL properly, redeploy

---

### Client 3 — Consumer Insights / Audience Building Expert
**Diagnostic Name:** Audience Alignment Score (or similar)
**Focus:** Helping business owners understand alignment with their audience
**Structural Gap:** Misalignment between offer and audience — lost revenue and engagement
**Status:** 🔴 Not started — build from template
**Remaining:** Full build from template repo

---

## 10. Kendra's Signature Diagnostic

### Revenue Flow Diagnostic
**Owner:** The Boss Architect / Kendra Lewis
**Backend:** Kendra's own Supabase project (separate from tba-client-platform)
**Purpose:** Shows founders the exact dollar range of revenue leaving on the table
**Status:** 🔴 In design — build follows after client builds ship
**Note:** Uses different Supabase project than client builds

---

## 11. Secrets Protocol

**CRITICAL — Never paste credentials in chat.**

All secrets go directly into `.env.local` via terminal or editor only. If credentials are accidentally shared in chat, regenerate them immediately.

---

## 12. Rules for Every Thread in This Project

1. **Read this file first.** Every thread begins with full context — never ask Kendra to re-explain the system.
2. **Kendra is the architect, not the developer.** Claude Code handles the build. Kendra provides content, reviews outputs, and approves.
3. **src/client/ is the only folder that changes per client.** Never modify platform files for client-specific content.
4. **All client builds use tba-client-platform Supabase + GHL.** Kendra's own diagnostics use a separate Supabase project.
5. **Every build starts from the template repo.** Never build from scratch.
6. **TENANT_ID is always an env var.** Never hardcode a tenant UUID.
7. **All positioning is premium.** Value is framed around transformation and strategic outcomes — never deliverables.
8. **Ship sequence:** Client 1 ✅ → Client 2 → Client 3 → Revenue Flow Diagnostic.

---

## 13. Key Contacts & Integrations

| Item | Detail |
|---|---|
| Kendra's GitHub | TBAadmin2025 |
| Template Repo | power-signal-diagnostic-template |
| tba-client-platform Supabase | naswccfebtwggtzkhyww.supabase.co |
| Client 1 GHL | quietwealthengine.com (Terry Lamb / VLARI) |
| Client 2 GHL | TBD (Brooke Benjamin) |
| Client 3 GHL | TBD |
| Hosting | Vercel (TBAadmin2025 account) |

---

## 14. What to Do When Starting a New Thread

Use the standard thread kickoff spec which includes:
- Full architecture summary
- Complete data flow
- Supabase schema
- Environment variables
- GHL standard fields
- New client build process

Then state: which client, current status, and what needs to happen.

---

*This document is the single source of truth for the Power Signal Diagnostic project. Update it whenever there is a significant status change, new decision, or shift in scope.*
