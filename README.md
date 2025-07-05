# MarketReady.ai – AI-Powered Real-Estate SaaS Platform

MarketReady.ai leverages Makerkit Pro Turbo under the hood and adds a suite of AI productivity tools designed specifically for real-estate professionals.

Stage 1 delivers the foundation: authentication, onboarding, dashboards, billing and an extendable "Tool Loader" ready for rapid AI-tool deployment.

### Prerequisites

* Node >= 18 (use `.nvmrc`)
* pnpm >= 8 _(preferred)_ or npm
* Supabase project (free tier is fine)
* Stripe account (test mode)

### Local setup

```bash
pnpm install
cp .env.example .env.local   # fill Supabase + Stripe keys
pnpm dev                      # starts all apps via Turbo
```

Open `http://localhost:3000` and create an account to walk through the onboarding flow.

[Please follow the documentation to get started](https://makerkit.dev/docs/next-supabase-turbo/introduction).

**Please remember to update the repository daily**.

## Getting Started

This project was built using the Makerkit Pro SaaS Starter Kit.

## Architecture Overview

```
apps/
  web/        – Next.js 14 App Router frontend
  dev-tool/   – Environment & data seeding helper
packages/
  **          – Makerkit core libraries (auth, billing, ui, etc.)
```

Key technologies:

* **Supabase** – Postgres, Auth, Storage
* **Stripe** – Subscription billing (free-trial → Pro)
* **Next.js** – SSR/ISR + API routes
* **Tailwind + shadcn** – UI kit

### Stage 1 Features

1. 🔑 **Auth & Profile** – Email/password, magic-link, social (soon)
2. 🧭 **Onboarding Wizard** – Property type, state, agency, timezone, credentials
3. 📊 **Dashboard** – Dynamic cards rendered from `/config/tools.ts`
4. 💬 **AI Command Bar** – Quick search & launch tools
5. 🔔 **Notifications** – Realtime updates, onboarding reminders
6. 💳 **Billing** – 14-day trial, monthly & yearly Pro plans

## Makerkit Upstream

This repository still tracks the original Makerkit codebase so you can receive upstream bug-fixes. Merging strategy:

1. Add the original Makerkit repo as an upstream remote if you haven't already (
   git remote add upstream https://github.com/MakerKit/makerkit-pro.git

2. When ready to fetch updates:
   git fetch upstream
   git merge upstream/main

⚠️  **Note:** Upstream merges may introduce breaking changes. Review each diff carefully.

---

© 2025 MarketReady.ai – All rights reserved.

Makerkit updates may include breaking changes. Pulling them into a customised project can overwrite or break existing code.
Always review the changes before merging.
