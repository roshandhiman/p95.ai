# 🚀 P95.AI — Autonomous Lead Intelligence & Outreach System

> **ThinkRoot x Vortex Hackathon 2026 · Track A: Intelligent Lead Scoring, Enrichment & Outreach**

---

## 📖 Overview

P95.AI is a fully autonomous B2B lead qualification and personalized outreach platform. It replaces manual SDR processes with a programmatic pipeline that enriches 200+ enterprise leads from 6 data platforms, scores them against a rigorous ICP framework, and generates hyper-personalized cold outreach with A/B tested variants.

---

## 🏆 Deliverables Checklist

| Deliverable | Status | Details |
|---|---|---|
| Clay table with 200+ enriched leads | ✅ | 203 leads from Clay.com, Apollo.io, LinkedIn, Crunchbase, BuiltWith, GitHub |
| Lead scoring model with explainable criteria | ✅ | 5-factor ICP scoring (Industry, Size, Funding, Hiring, Tech Stack). Max 67pts. Hot/Warm/Cold tiers |
| Personalized outreach for top 50 leads | ✅ | Cold email + LinkedIn DM for each of the top 50 qualified leads |
| A/B test variants for top 20 leads | ✅ | 2 variants per lead with different hooks, CTAs, and response rate hypotheses |
| ICP Framework document | ✅ | Full qualification dimensions with Primary/Secondary/Excluded criteria |
| GitHub repo with code, prompts, scoring rubric | ✅ | Clean full-stack architecture with all source code |

---

## ⚡ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, Lucide Icons, React Router |
| Backend | Node.js, Express.js |
| Database | SQLite |
| Enrichment Sources | Clay.com, Apollo.io, LinkedIn Sales Nav, Crunchbase, BuiltWith, GitHub Search |
| Orchestration | Concurrently (monorepo dev server) |

---

## 🗂 Project Structure

```
p95.ai/
├── database/
│   └── data.json                # 203 enriched leads with multi-platform data
├── backend/
│   ├── package.json
│   └── index.js                 # Express API: scoring engine, outreach gen, A/B testing
├── frontend/
│   └── src/
│       ├── App.jsx              # Route configuration
│       ├── components/
│       │   ├── Layout.jsx       # App shell with sidebar navigation
│       │   └── AdvisorChat.jsx  # AI advisor widget
│       └── pages/
│           ├── Landing.jsx      # Public landing page with scroll animations
│           ├── Auth.jsx         # Login/signup
│           ├── Dashboard.jsx    # Clay enrichment table (200+ leads, 8 columns, filters)
│           ├── ScoringEngine.jsx# Explainable ICP scoring rubric + live simulator
│           ├── Outreach.jsx     # Top 50 personalized outreach (email + LinkedIn DM)
│           ├── ABTesting.jsx    # Top 20 A/B variants with hypotheses
│           ├── ICPFramework.jsx # ICP qualification document
│           └── Sender.jsx       # Campaign execution dispatch
├── package.json                 # Root orchestrator
└── README.md
```

---

## 🛠 Getting Started

### Prerequisites
- Node.js v18+
- npm

### Quick Start

```bash
# 1. Clone
git clone git@github.com:roshandhiman/p95.ai.git
cd p95.ai

# 2. Install dependencies
npm run install:all

# 3. Start both servers
npm start
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

---

## 🧠 ICP Scoring Model

| Factor | Weight | Rationale |
|---|---|---|
| Industry Match | +15 (AI/ML) | Primary ICP vertical |
| Company Size | +12 (50-200) | Growth-stage sweet spot |
| Funding Stage | +15 (Series B) | Budget + urgency to scale |
| Hiring Signal | +20 (Active MLE roles) | Strongest buy-intent signal |
| Tech Stack Affinity | +5 (Python/PyTorch) | Highest adoption potential |

**Classification**: Hot ≥45 · Warm ≥25 · Cold <25 (Max: 67 points)

---

## 📊 Data Sources

Each lead is enriched from multiple platforms:
- **Clay.com**: Company firmographics, technographics, team size
- **Apollo.io**: Contact discovery, email verification, seniority
- **LinkedIn Sales Nav**: Hiring signals, headcount trends
- **Crunchbase**: Funding rounds, investors, valuations
- **BuiltWith**: Technology stack analysis
- **GitHub Search**: Technical depth validation, ML framework usage

---

<p align="center">
  <strong>P95.AI</strong> — Stop searching. Start scaling.<br>
  Built for ThinkRoot x Vortex Hackathon 2026
</p>
