# Agentic AI RFP Assistant — Slide-by-Slide README (Prototype)

A multi-agent, dashboard-driven system that **scales and accelerates B2B RFP responses** for a **wires & cables / FMEG manufacturer** bidding into large infrastructure-led tenders.

---

## Table of Contents
- [Slide 1 — Executive Summary](#slide-1--executive-summary)
- [Slide 2 — Problem Statement](#slide-2--problem-statement)
- [Slide 3 — End-to-End Solution + Key Differentiators](#slide-3--end-to-end-solution--key-differentiators)
- [Slide 4 — Deployment Snapshot: Dashboard in Action](#slide-4--deployment-snapshot-dashboard-in-action)
- [Slide 5 — RFP Timeline + User Path to Value](#slide-5--rfp-timeline--user-path-to-value)
- [Slide 6 — Architecture](#slide-6--architecture)
- [Slide 7 — Specification Matching Engine](#slide-7--specification-matching-engine)
- [Slide 8 — Success Metrics + ROI](#slide-8--success-metrics--roi)
- [Slide 9 — Scalability + Future Scopes](#slide-9--scalability--future-scopes)

---

## Slide 1 — Executive Summary

This prototype demonstrates an **Agentic AI system** that mirrors the real enterprise workflow:

**Sales → Technical → Pricing → Consolidation**

…while removing bottlenecks that reduce win-rate—especially:
- **Late RFP discovery**
- **Slow SKU-to-spec matching**

### Agent Responsibilities

**1) Sales Agent**
- Opens **tender URLs or attached PDFs** (via Gemini API)
- Extracts key fields as **strict JSON**, including:
  - Tender ID, issuer, submission deadline
  - Scope-of-supply line items
  - Technical specifications
  - Testing/acceptance clauses
- Applies **rule + relevance scoring** to prioritize actionable RFPs

**2) Technical Agent**
- Consumes selected **RFP JSON**
- Runs **SpecMatch (%)** against product datasheet repository using:
  - **Attribute-level comparison** across required parameters
  - **Equal weightage**
- Returns:
  - **Top-3 SKU shortlist per line item**
  - A **side-by-side comparison table** (RFP spec vs SKU1/SKU2/SKU3)

**3) Pricing Agent**
- Combines chosen SKUs with **pricing + services catalogs**
- Overlays feasibility signals:
  - stock, unit, lead time, average cost
- Adds testing/inspection/acceptance costs
- Produces a **consolidated quote table**

**4) Main Orchestrator**
- Aggregates all outputs into a submission-ready response pack:
  - SKU mapping
  - Spec compliance summary
  - Pricing breakup
  - Assumptions
- Delivered via a **dashboard-driven end-to-end flow**

### Business Impact
- **Accelerates RFP response throughput** via end-to-end automation (discovery → matching → pricing handoffs)
- **Improves bid win rates** with faster, spec-accurate, on-time submissions
- **Drives sustainable revenue + margin uplift** by reducing rework, mis-bids, and suboptimal SKU selection

> Note: RFPs are filtered on a target window (e.g., next 3 months) and matched using domain keywords/standards (e.g., XLPE/PVC, kV rating, sqmm, cores, armoured/unarmoured, IS/IEC standards).

---

## Slide 2 — Problem Statement

The client (leading industrial manufacturer in FMEG) faces **delays and inefficiencies** in responding to B2B RFPs. Current workflow is **manual, siloed, time-intensive**, causing missed opportunities and slow response cycles.

### Industry Analysis & Pain Points (as shown)
- **8000+ tenders daily** (RFP surge)
- **143 Lakh Cr.** India’s infrastructure boom
- **29% manufacturers use AI** *(only 16% scaled)*
- **₹1.2 Lakh Cr annual tender value**
- **7–10 days** average time per RFP response  
  *(BCG Report 2024)*

### Challenges → Business Impact
- Delayed RFP identification → missed bids / reduced market share
- Manual SKU matching → long turnaround time, dependency on experts
- Siloed communication (Sales–Tech–Pricing) → operational inefficiency, low scalability
- Late submissions → direct drop in win probability (**-40%**)

### Why Agentic AI?
- Enables intelligent, data-driven decisions
- Coordinates agents for seamless collaboration
- Learns continuously to improve accuracy
- Scales efficiently with transparent insights

### Automated Multi-Agent Workflow (headline outcomes shown)
- **RFP turnaround time:** 2–3 days (**~60% decrease**)
- **Win probability:** **+25%**
- **RFPs qualified/quarter:** **250–300** (**+2.5×**)
- **Revenue growth potential:** **+5×**

---

## Slide 3 — End-to-End Solution + Key Differentiators

### Live Multi-Agent Coordination (user experience)
1. Main Agent monitors and coordinates **Sales, Technical, Pricing** agents with live status  
2. Real-time communication where agents share progress and AI manages workflow execution  
3. Final RFP output summarized with **total cost, confidence score, and deadline** (review-ready)  
4. Detailed breakdown of each agent’s contribution (pricing estimate, testing requirements, etc.)

### Key Differentiators
- **Win Probability Computation**  
  Analyzes historical RFP outcomes, past win rates, and agent agreement levels to estimate likelihood of success
- **Multi-Agent Orchestration**  
  Central Main Orchestrator coordinates specialized agents (Sales + Technical + Pricing)
- **AI-Enabled Stock Check**  
  Uses live inventory/ERP data to predict shortages and recommend alternate SKUs (quote only deliverable products)
- **Forecasting for Peak RFP Periods**  
  Studies historical timelines + seasonal patterns to predict upcoming high-demand periods
- **Intelligent Specification Matching**  
  Structured requirements → matching logic → ranked OEM products with match %

---

## Slide 4 — Deployment Snapshot: Dashboard in Action

The dashboard demonstrates **end-to-end visibility** across RFP pipeline stages.

### What the UI shows (as annotated)
- **12% increase in RFPs scanned** vs previous period (e.g., last week/month)
- An **AI confidence score** per RFP (how sure the system is about data accuracy / decision quality)
- Live RFP stage progress (e.g., Scanning, Qualification, In Progress)
- Technical Agent auto-compares requirements vs catalogue and finds best fit
- **Win percentage**: ratio of RFPs won to those submitted
- Highlights RFPs currently in progress (ongoing bids)
- Shows current workflow stage (e.g., “Tech Mapped”, “Pricing”, “Qualified”, “In Progress”)
- Shows how many RFPs are nearing deadline (e.g., within a week)
- Human review actions to finalize AI recommendation

### Example pipeline counters shown
- **256** RFPs Scanned  
- **78** RFPs Qualified  
- **12** RFPs In Progress  
- **9** Responses Submitted  
- **33%** Success Rate

---

## Slide 5 — RFP Timeline + User Path to Value

### “RFP Timeline: Clicks to Contracts”
1. **Open Internet Tender Sources**
2. Scrape data → populate **Local RFPs Database**
3. **RSP Dashboard** filters/prioritizes actionable RFPs
4. **RFP Review & Analysis Panel**
5. Confidence score generated vs inventory
6. **Actionable insights, confidence, and matching analytics dashboard**

### The User’s Path to Value
- **Tender Tracker (AI-powered RFP Console)**
  - Store inventory data in the database
  - Powered by live agent statuses (Sales/Technical/Pricing)
- **Backend Inventory Library**
- **Deadline Display & SKU Matching Centre**
  - Agents *investigate, evaluate, and recommend* RFPs
  - “Succinct & dynamic synopsis” surfaced to the user
- **Productivity: Dynamic Calendar & Executive Summaries**
  - Stay ahead of bidding schedules and follow-ups
- **One-Push Live Inventory Management**
  - Manage, push, read, edit, update, delete inventory with real-time table/agent updates
- **View Stock Stats**
  - Track stock availability and get agent autonomy over reporting

---

## Slide 6 — Architecture

Architecture is decomposed into independent domain agents (Sales, Technical, Pricing, Orchestrator) running on a **4-layer LLM stack**:

**Retrieval → Understanding → Reasoning → Generation**  
This ensures **modularity, scalability, and precision**.

### 4-Layer LLM Structure

**Layer 1: Retrieval / Embedding**
- Dense embedding model (sentence-BERT and LLaMA embeddings)
- Converts RFPs, product specs, test requirements into vectors in a Vector DB

**Layer 2: Language Understanding**
- Domain-tuned LLM (fine-tuned on electrical specs, IS/IEC standards)
- Extracts technical fields, deadlines, scope, test requirements

**Layer 3: Reasoning & Planning**
- System-prompt constrained LLM + feedback loop
- Decisions: shortlist RFPs, compute SpecMatch %, select SKUs

**Layer 4: Generation**
- Specialized response formatter using NLP
- Produces structured tables (CSV/PDF) + summaries for final response

### Agent Tech Stack (as shown)

**Sales Agent**
- Web scraper (BeautifulSoup)
- RAG search over historical wins/losses
- Vector DB: OpenSearch  
- Functions: crawl URLs, forecast peak periods, run confidence %, select viable RFP

**Main Agent**
- LangGraph
- Message Queues (AWS)
- State stored in DynamoDB  
- Functions: win rate prediction, confidence checks, summary/tables generation

**Technical Agent**
- Scikit-learn (calibration)
- Pydantic (schemas)
- RAG search OEM datasheets  
- Functions: comparison table, stock prediction, select final SKU

**Pricing Agent**
- Rules engine (tax/freight)
- Regression
- Optimization
- Pandas  
- Functions: bid price prediction, stock prediction, select final SKU

### UI / Backend
- **UI:** React + TypeScript + Tailwind + Vite
- **Backend:** Supabase

---

## Slide 7 — Specification Matching Engine

### Process (1 → 5)
1. Convert RFP specifications into structured requirements  
2. Evaluate each OEM SKU independently against RFP requirements  
3. Perform attribute-wise comparison using deterministic rules  
4. Compute **Spec Match Score (%)** for every SKU  
5. Shortlist top 3 SKUs and select best-fit SKU

### SpecMatch Metric
**Spec Match Score (%)** =  
`(Number of Matching Specifications / Total Required Specifications) × 100`

- All required specs are treated with **equal weight** → unbiased and transparent evaluation

### Example (SKU A)
- Spec Match Score = **4 / 5 = 80%**

### Why this method?
- **Engineering-first & deterministic:** mirrors technical compliance evaluation
- **Fully explainable & auditable:** every score traceable to a spec
- **Zero training data required:** no historical bid dependency
- **Enterprise-safe:** avoids black-box decisions in regulated tender environments

---

## Slide 8 — Success Metrics + ROI

### Impact (headline)
- **25% throughput increase** (higher desk-work productivity + automation of repetitive proposal steps)
- **1 pp gross margin uplift** (accurate costing, reduced rework, tighter spec fit, workforce reduction)
- **5× revenue growth** (for top quartile; driven by productivity + outsized revenue gains)

### Cycle Time Reduction (RFP Cycle)
**Before integrating AI:** 40% / 35% / 20% / 5% split across stages  
**After integrating AI:** shows a redesigned distribution (labels shown: **25%, 15%, 15%, 5%**) and a headline **20% reduction in RFP cycle**  
Stages referenced:
- RFP discovery & qualification (automated scanning of PSU portals/emails)
- Technical spec matching (spec-match algorithm, auto datasheet parsing)
- Pricing & test-cost estimation (auto-mapping product SKUs + test database)
- Consolidation & submission (minimal change)

### Growth Metrics (Baseline vs With Agentic AI)
- **RFP responses/year:** 600 → **750**
- **Wins/year:** 108 → **165**
- **Revenue (₹ Cr):** 129.6 → **198**
- **Gross Profit (₹ Cr):** 28.5 → **45.5**

### ROI (as shown)
Assumptions:
- Average order value = **₹1.2 Cr**
- Gross margin after AI = **23%**
- Investment to build/run AI solution: (shown in slide assumptions)

Calculation shown:
- Additional wins: **132 − 108 = 24**
- Incremental revenue: **24 × ₹1.2 Cr = ₹28.8 Cr**
- Incremental gross profit: **₹35.6 Cr − ₹28.5 Cr = ₹7.1 Cr** (rounded)
- ROI displayed: **~1.38×**

---

## Slide 9 — Scalability + Future Scopes

### Scalability
- **Automated RFP ingestion at scale:** continuous scanning across govt/PSU/LSTK sites
- **Parallel agent execution:** Sales/Technical/Pricing agents process multiple RFPs simultaneously
- **Expandable product knowledge base:** centralized OEM datasheet repository (new SKUs/standards/categories without redesign)
- **Cloud-ready architecture:** scale compute/storage on demand without growing team size
- **Containerized agent deployment:** dockerized agents for dependable scaling, isolation, reliability
- **Observability + backend integration:** API Gateway + Lambda; CloudWatch + OpenTelemetry for monitoring/tracing/failure recovery

### Future Scopes
- **Automated compliance matrix & bid documentation generation**
  - Auto-generate compliance tables and bid-ready documents by mapping clauses to OEM datasheets + technical outputs
- **Win-probability scoring for RFP prioritization**
  - Use historical win–loss patterns to prioritize high-value RFPs with higher success odds
- **Dedicated RFP management application**
  - Web/mobile app to track discovery, agent outputs, pricing summaries, and submission status in one interface

---

## Repo Notes / Suggested README Add-ons (Optional)
- Add a “Quickstart” section (env vars, database setup, run scripts)
- Add an “API + WebSocket Statuses” section (pending → routing → building → submitted → confirmed/failed)
- Add a “Data Model” section (RFP JSON schema, SKU schema, match tables, pricing tables)
- Add a “Demo Walkthrough” section mapping directly to Slides 4–5
