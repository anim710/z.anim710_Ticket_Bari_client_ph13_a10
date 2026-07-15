# TicketBari
# TicketBari

An online ticket booking platform for bus, train, launch, and flight tickets across Bangladesh.

## Live URL
## Live URL

[https://ticketbari.vercel.app](https://z-anim710-ticket-bari-client-ph13-git-a31a75-anim710s-projects.vercel.app/)

## Purpose
## Purpose

TicketBari allows users to discover and book travel tickets across Bangladesh. Vendors can list tickets for approval, and admins manage the entire platform including user roles, ticket verification, and advertisements.

## User Roles
## User Roles

| Role | Access |
|------|--------|
| User | Browse tickets, book tickets, make payments |
| Vendor | Add/manage tickets, accept/reject bookings, view revenue |
| Admin | Approve/reject tickets, manage users, advertise tickets |

## Key Features
## Key Features

- Email/password authentication with JWT
- Google OAuth login via BetterAuth
- Browse tickets with search, filter, sort, and pagination (9 per page)
- Real-time departure countdown timer on ticket details
- Booking flow: pending → accepted → pay → paid
- Stripe payment integration
- ImgBB image upload for vendor ticket images
- Vendor revenue overview with charts
- Admin fraud detection — hides all vendor tickets on fraud mark
- Dark / Light mode toggle
- Fully responsive — mobile, tablet, desktop
- Email/password authentication with JWT
- Google OAuth login via BetterAuth
- Browse tickets with search, filter, sort, and pagination (9 per page)
- Real-time departure countdown timer on ticket details
- Booking flow: pending → accepted → pay → paid
- Stripe payment integration
- ImgBB image upload for vendor ticket images
- Vendor revenue overview with charts
- Admin fraud detection — hides all vendor tickets on fraud mark
- Dark / Light mode toggle
- Fully responsive — mobile, tablet, desktop

## NPM Packages Used
## NPM Packages Used

### Client


- `next` — React framework with App Router
- `react` — UI library
- `@heroui/react` — UI component library (v3)
- `@heroui/styles` — HeroUI CSS-first design tokens (pulled in by `@heroui/react`; imported in `globals.css`)
- `@heroui/styles` — HeroUI CSS-first design tokens (pulled in by `@heroui/react`; imported in `globals.css`)
- `tailwindcss` — Utility-first CSS (v4)
- `@tailwindcss/postcss` — Tailwind v4 PostCSS plugin
- `framer-motion` — Animation library
- `framer-motion` — Animation library
- `better-auth` — Google OAuth authentication
- `axios` — HTTP client for API calls
- `@stripe/react-stripe-js` — Stripe React components
- `@stripe/stripe-js` — Stripe browser SDK
- `swiper` — Touch slider for hero banner
- `@gravity-ui/icons` — Icon library
- `next-themes` — Dark/light mode management (`class` attribute on `<html>`)
- `next-themes` — Dark/light mode management (`class` attribute on `<html>`)
- `recharts` — Charts for vendor revenue page
- `typescript` — TypeScript tooling
- `typescript` — TypeScript tooling

### Server


- `express` — Web framework
- `cors` — Cross-origin resource sharing
- `dotenv` — Environment variable loader
- `jsonwebtoken` — JWT creation and verification
- `bcryptjs` — Password hashing
- `better-auth` — Google OAuth handler
- `mongodb` — MongoDB native driver
- `stripe` — Stripe payment processing
- `nodemon` — Auto-restart for development

## Run Locally
## Run Locally

### Server


```bash
cd ticketbari_server
cd ticketbari_server
npm install
# Fill in .env with your credentials
node seed.js   # seed the database
npm run dev
```

### Client


```bash
cd ticketbari_client
cd ticketbari_client
npm install
# Fill in .env with your credentials
# Fill in .env with your credentials
npm run dev
```

## Environment Variables
## Environment Variables

### Server `.env`

```
PORT=5000
CLIENT_URL=http://localhost:3000
MONGODB_URI=
DB_NAME=
JWT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
BETTER_AUTH_SECRET=
# Must match the public frontend origin (Next proxies /api/auth/better to the API).
BETTER_AUTH_URL=http://localhost:3000
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

Production (Render): set `CLIENT_URL` and `BETTER_AUTH_URL` to the **exact** Vercel origin users open (same value). Google redirect URI must be:

`{BETTER_AUTH_URL}/api/auth/better/callback/google`

### Client `.env`

```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PK=
NEXT_PUBLIC_IMGBB_KEY=
```

Production (Vercel): `NEXT_PUBLIC_API_URL` = Render API origin; `NEXT_PUBLIC_APP_URL` = Vercel origin.

## Theming (HeroUI v3)

HeroUI v3 uses a CSS-first system (not the old `@heroui/theme` Tailwind plugin):

1. Import styles in `src/app/globals.css`: `@import "tailwindcss";` then `@import "@heroui/styles";`
2. Wrap the app with `next-themes` `ThemeProvider` (`attribute="class"`) in `src/providers/Providers.tsx`
3. Toggle light/dark via `useTheme()` — HeroUI reads the `dark` / `light` class on `<html>`
