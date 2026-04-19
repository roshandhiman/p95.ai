<div align="center">

# 🧠 P95.AI

### Autonomous Lead Intelligence & Outreach Platform

**200+ Enriched Leads · Explainable ICP Scoring · AI-Powered Outreach · A/B Tested Sequences**

[![Track A](https://img.shields.io/badge/Track_A-Lead_Scoring_&_Outreach-blue?style=for-the-badge)](https://github.com/roshandhiman/p95.ai)
[![Leads](https://img.shields.io/badge/Leads-203_Enriched-green?style=for-the-badge)](https://github.com/roshandhiman/p95.ai)
[![Platforms](https://img.shields.io/badge/Sources-6_Platforms-orange?style=for-the-badge)](https://github.com/roshandhiman/p95.ai)
[![Stack](https://img.shields.io/badge/Stack-React_+_Express_+_SQLite-purple?style=for-the-badge)](https://github.com/roshandhiman/p95.ai)

*ThinkRoot × Vortex Hackathon 2026*

---

[🚀 Quick Start](#-quick-start) · [📊 Features](#-features) · [🧠 Scoring Model](#-icp-scoring-model) · [🏗️ Architecture](#️-system-architecture) · [📈 Results](#-results-summary)

</div>

---

## 💡 The Problem

Sales teams waste **68% of their time** on unqualified leads. Manual prospecting across LinkedIn, Crunchbase, and Apollo is slow, inconsistent, and doesn't scale.

**What if you could automatically:**
- Enrich 200+ enterprise leads from 6 platforms simultaneously?
- Score every lead against a transparent, explainable ICP framework?
- Generate hyper-personalized cold emails AND LinkedIn DMs at scale?
- A/B test outreach with different psychological hooks — before sending a single message?

**That's P95.AI.**

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 📊 Clay Enrichment Table
- **203 real companies** enriched with 8 data dimensions
- Multi-platform source badges (Clay, Apollo, LinkedIn, Crunchbase, BuiltWith, GitHub)
- Click any company → detailed modal with score breakdown, direct links, tech stack
- Real-time filtering by score tier, source, and search

</td>
<td width="50%">

### 🧠 Explainable Scoring Engine
- 5-factor ICP scoring (Industry, Size, Funding, Hiring, Tech Stack)
- Transparent rubric — every point is auditable
- **Live Score Simulator** — judges can test any combination
- Max 67 points → Hot (≥45) / Warm (≥25) / Cold (<25)

</td>
</tr>
<tr>
<td width="50%">

### ✉️ Personalized Outreach (Top 50)
- Cold Email + LinkedIn DM for each qualified lead
- Personalization signals: funding stage, hiring status, tech stack, industry
- Profile-aware signatures — your name, role, company in every message
- Character count validation for LinkedIn DMs

</td>
<td width="50%">

### 🧪 A/B Testing Engine (Top 20)
- 2 variants per lead with **different psychological hooks**
- Variant A: Pain Point (Engineering Bandwidth)
- Variant B: Social Proof (Competitor Advantage)
- Predicted response rates + detailed hypotheses

</td>
</tr>
<tr>
<td width="50%">

### 🚀 Campaign Execution
- Generate → Preview → Send via Gmail (auto-populated compose)
- One-click LinkedIn DM copy + company page open
- Batch processing with progress tracking
- Real Gmail integration via compose links

</td>
<td width="50%">

### 🎯 ICP Framework Document
- 5 qualification dimensions with Primary/Secondary/Excluded criteria
- Platform-to-signal mapping for all 6 data sources
- Scoring rationale documentation
- Ready for judge review

</td>
</tr>
<tr>
<td width="50%">

### 🌗 Dark/Light Theme
- Instant smooth transition (0.4s CSS animation)
- Deep navy dark mode palette
- Preference persisted across sessions
- Every component fully themed

</td>
<td width="50%">

### 🌐 Multilingual Support
- 4 languages: English, Hindi, Spanish, French
- One-click language switcher in header
- All UI labels and navigation translated
- Preference saved to localStorage

</td>
</tr>
</table>

**Plus:** User profiles with avatar upload, AI advisor chat widget, skeleton loading states, responsive design, and scroll animations on the landing page.

---

## 🧠 ICP Scoring Model

Our scoring model uses **5 weighted factors** with a maximum score of **67 points**:

```
┌─────────────────────┬────────┬──────────────────────────────────────┐
│ Factor              │ Max    │ Scoring Logic                        │
├─────────────────────┼────────┼──────────────────────────────────────┤
│ Industry Match      │ 15 pts │ AI/ML=15, SaaS/DevTools=10,          │
│                     │        │ Cloud/Data=8, Other=5                │
├─────────────────────┼────────┼──────────────────────────────────────┤
│ Company Size        │ 12 pts │ 50-200=12, 200-500=10,               │
│                     │        │ 500+=6, 1-50=4                       │
├─────────────────────┼────────┼──────────────────────────────────────┤
│ Funding Stage       │ 15 pts │ Series B=15, C=12, A=8,              │
│                     │        │ D/E=6, Other=3                       │
├─────────────────────┼────────┼──────────────────────────────────────┤
│ Hiring Signal       │ 20 pts │ Active MLE roles=20, None=0          │
│ (Highest Weight)    │        │ Strongest buy-intent indicator        │
├─────────────────────┼────────┼──────────────────────────────────────┤
│ Tech Stack Affinity │  5 pts │ Python/PyTorch=5, Other=0            │
└─────────────────────┴────────┴──────────────────────────────────────┘

Classification:  🔥 Hot ≥ 45  |  🌡️ Warm ≥ 25  |  ❄️ Cold < 25
```

**Why these weights?**
- **Hiring Signal (20pts)** is weighted highest because active MLE job postings are the strongest real-time buy-intent signal
- **Industry + Funding (15pts each)** determine product-market fit and budget availability
- **Size (12pts)** identifies the growth-stage sweet spot (50-200 employees = scaling pain)
- **Tech Affinity (5pts)** validates deployment compatibility

---

## 🏗️ System Architecture

```
                    ┌─────────────────────────────────────┐
                    │         P95.AI Platform              │
                    └─────────────┬───────────────────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
    ┌─────────▼─────────┐  ┌─────▼──────┐  ┌────────▼────────┐
    │   Data Layer       │  │  Scoring   │  │  Outreach       │
    │                    │  │  Engine    │  │  Engine          │
    │  Clay.com          │  │            │  │                  │
    │  Apollo.io         │  │  5-Factor  │  │  Cold Email      │
    │  LinkedIn          │──│  ICP Model │──│  LinkedIn DM     │
    │  Crunchbase        │  │            │  │  A/B Variants    │
    │  BuiltWith         │  │  Hot/Warm/ │  │  Gmail Compose   │
    │  GitHub            │  │  Cold Tier │  │                  │
    └────────────────────┘  └────────────┘  └─────────────────┘
              │                   │                   │
    ┌─────────▼───────────────────▼───────────────────▼─────────┐
    │                    SQLite Database                         │
    │              203 Enriched Lead Records                     │
    │    (name, domain, industry, size, funding, techStack,     │
    │     source, hiring, icpScore, score)                      │
    └───────────────────────────────────────────────────────────┘
              │
    ┌─────────▼─────────────────────────────────────────────────┐
    │                   Express.js REST API                      │
    │                                                            │
    │  GET /api/leads          → All 203 leads (sorted by ICP)  │
    │  GET /api/leads/stats    → Hot/Warm/Cold breakdown        │
    │  GET /api/leads/top50    → Top 50 for outreach            │
    │  GET /api/leads/top20    → Top 20 for A/B testing         │
    │  POST /api/generate-outreach → Email + LinkedIn DM        │
    │  POST /api/generate-ab   → 2 A/B variants per lead       │
    │  POST /api/sync-apollo   → Multi-platform sync            │
    └───────────────────────────────────────────────────────────┘
              │
    ┌─────────▼─────────────────────────────────────────────────┐
    │                React Frontend (Vite + Tailwind)            │
    │                                                            │
    │  Landing → Login → Dashboard → Scoring → Outreach →       │
    │  A/B Testing → ICP Framework → Campaign Send → Profile    │
    └───────────────────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```
p95.ai/
├── database/
│   └── data.json                    # 203 enriched leads (multi-platform)
├── backend/
│   ├── package.json
│   └── index.js                     # REST API: scoring, outreach, A/B engine
├── frontend/
│   └── src/
│       ├── main.jsx                 # App entry with providers
│       ├── App.jsx                  # Route configuration (9 routes)
│       ├── index.css                # Design system (light/dark themes)
│       ├── context/
│       │   ├── ThemeContext.jsx      # Dark/light mode toggle
│       │   ├── LangContext.jsx      # i18n (EN, HI, ES, FR)
│       │   └── ProfileContext.jsx   # User identity persistence
│       ├── components/
│       │   ├── Layout.jsx           # App shell, sidebar, header
│       │   └── AdvisorChat.jsx      # AI advisor floating widget
│       └── pages/
│           ├── Landing.jsx          # Public landing (scroll animations)
│           ├── Auth.jsx             # Login / signup
│           ├── Dashboard.jsx        # Clay table + company detail modal
│           ├── ScoringEngine.jsx    # Explainable rubric + simulator
│           ├── Outreach.jsx         # Top 50 email + LinkedIn DM
│           ├── ABTesting.jsx        # Top 20 × 2 variants
│           ├── ICPFramework.jsx     # ICP documentation
│           ├── Sender.jsx           # Gmail compose + LinkedIn actions
│           └── Profile.jsx          # User profile + avatar upload
├── .gitignore
├── package.json                     # Root monorepo orchestrator
└── README.md
```

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/roshandhiman/p95.ai.git
cd p95.ai

# Install all dependencies (frontend + backend)
npm run install:all

# Start both servers
npm start
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3001 |

> **Requirements:** Node.js v18+ · npm

---

## 📈 Results Summary

| Metric | Value |
|---|---|
| Total Enriched Leads | **203** |
| Data Source Platforms | **6** (Clay, Apollo, LinkedIn, Crunchbase, BuiltWith, GitHub) |
| Hot Leads Identified | **~60** |
| Warm Leads | **~80** |
| Cold Leads | **~63** |
| Personalized Outreach Generated | **Top 50** (Email + LinkedIn DM each) |
| A/B Test Variants | **Top 20 × 2** = 40 variants |
| ICP Scoring Factors | **5** (Max 67 points) |
| Outreach Personalization Signals | **5** per message |
| Languages Supported | **4** (EN, HI, ES, FR) |
| Theme Modes | **2** (Light + Dark with smooth transition) |

---

## 🏆 Deliverables Checklist

| # | Deliverable | Status | Location |
|---|---|---|---|
| 1 | Clay table with 200+ enriched leads | ✅ Complete | `/app` — Dashboard |
| 2 | Lead scoring model with explainable criteria | ✅ Complete | `/scoring` — Scoring Engine |
| 3 | Tiered classification (Hot/Warm/Cold) | ✅ Complete | Dashboard + Scoring |
| 4 | Personalized outreach for top 50 leads | ✅ Complete | `/outreach` — Cold Email + LinkedIn DM |
| 5 | A/B test variants for top 20 leads | ✅ Complete | `/ab-testing` — 2 variants each |
| 6 | ICP Framework document | ✅ Complete | `/icp` — ICP Framework page |
| 7 | GitHub repo with all code | ✅ Complete | This repository |

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React 18, Vite, Tailwind CSS | Fast dev, modern component architecture |
| Icons | Lucide React | Consistent, lightweight icon set |
| Routing | React Router v6 | Clean SPA navigation |
| State | React Context API | Profile, theme, language — no Redux bloat |
| Backend | Express.js | Lightweight REST API |
| Database | SQLite | Zero config, portable, auto-seeds |
| Monorepo | Concurrently | Single `npm start` runs everything |

---

## 🔮 Future Roadmap

- [ ] **Live Clay.com API Integration** — Replace seed data with real-time enrichment
- [ ] **Gmail OAuth 2.0** — One-click "Sign in with Google" for auto-send
- [ ] **LinkedIn API Partnership** — Automated DM dispatch
- [ ] **AI-Powered Subject Lines** — GPT-generated A/B variants
- [ ] **Campaign Analytics Dashboard** — Open rates, reply rates, conversion tracking
- [ ] **Team Collaboration** — Shared lead pools, assignment rules
- [ ] **Webhook Integrations** — Slack, HubSpot, Salesforce CRM push

---

<div align="center">

### ⚡ Stop Searching. Start Scaling.

**P95.AI** transforms lead qualification from a manual grind into an intelligent, automated pipeline.

200+ leads. 6 platforms. 5-factor scoring. Personalized outreach. A/B tested. All in one click.

---

*Built with ❤️ for ThinkRoot × Vortex Hackathon 2026*

**Team sudo su**

</div>
