# MarketReady.ai

**AI-powered SaaS platform for real estate professionals**

---

MarketReady.ai is a modern, extensible SaaS platform built for real estate teams and agents. It features robust authentication, a beautiful onboarding wizard, a responsive dashboard, and a foundation for rapid AI tool deployment.

## Features
- **Modern Onboarding Flow:** Multi-step wizard for new users (personal info, business info, integrations)
- **Secure Authentication:** Email/password, email verification, terms acceptance, session management
- **Responsive Dashboard:** Sidebar navigation, AI command bar, notifications, tool categories, and favorites
- **Billing Ready:** Stripe integration (test mode)
- **Supabase Backend:** Secure, scalable, with row-level security
- **Developer Friendly:** TurboRepo, Next.js 15, TypeScript, Tailwind, Shadcn UI

## Project Structure
```
/apps/web/
  /app
    /onboarding      # Multi-step onboarding wizard
    /home            # Dashboard and app shell
      /(user)        # Personal workspace
      /[account]     # Team workspace
    /(marketing)     # Marketing pages
    /auth            # Auth pages
  /components        # Global components
  /config            # App and navigation config
  /lib               # Utilities
  /supabase          # Supabase client/root
```

## Getting Started

### Prerequisites
- Node.js >= 18 (see `.nvmrc`)
- pnpm >= 8 (preferred)
- Supabase project (free tier is fine)
- Stripe account (for billing features)

### Local Development
```sh
pnpm install
cp .env.example .env.local    # Add your Supabase/Stripe keys
pnpm dev                      # Start all apps
```
Visit [http://localhost:3000](http://localhost:3000) and create an account to experience the onboarding flow and dashboard.

## Contributing
- All changes should be committed to the main branch.
- **/docs** is ignored from git to avoid pushing internal PRDs or notes.

## License
This project is based on Makerkit Pro Turbo but is fully rebranded and extended for MarketReady.ai. See LICENSE for details.

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
