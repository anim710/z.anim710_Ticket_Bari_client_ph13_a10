# TicketBari 🎫

An online ticket booking platform for bus, train, launch, and flight tickets across Bangladesh.

## 🌐 Live URL

[https://ticketbari.vercel.app](https://z-anim710-ticket-bari-client-ph13-git-a31a75-anim710s-projects.vercel.app/)

## 🎯 Purpose

TicketBari allows users to discover and book travel tickets across Bangladesh. Vendors can list tickets for approval, and admins manage the entire platform including user roles, ticket verification, and advertisements.

## 👥 User Roles

| Role | Access |
|------|--------|
| User | Browse tickets, book tickets, make payments |
| Vendor | Add/manage tickets, accept/reject bookings, view revenue |
| Admin | Approve/reject tickets, manage users, advertise tickets |

## ✨ Key Features

- 🔐 Email/password authentication with JWT
- 🔑 Google OAuth login via BetterAuth
- 🎫 Browse tickets with search, filter, sort, and pagination (9 per page)
- ⏱️ Real-time departure countdown timer on ticket details
- 📦 Booking flow: pending → accepted → pay → paid
- 💳 Stripe payment integration
- 🖼️ ImgBB image upload for vendor ticket images
- 📊 Vendor revenue overview with charts
- 🛡️ Admin fraud detection — hides all vendor tickets on fraud mark
- 🌙 Dark / Light mode toggle
- 📱 Fully responsive — mobile, tablet, desktop



## 📦 NPM Packages Used

### Client
- `next` — React framework with App Router
- `react` — UI library
- `@heroui/react` — UI component library (v3)
- `@heroui/theme` — HeroUI theme plugin for Tailwind v4
- `tailwindcss` — Utility-first CSS (v4)
- `@tailwindcss/postcss` — Tailwind v4 PostCSS plugin
- `framer-motion` — Animation library (required by HeroUI)
- `better-auth` — Google OAuth authentication
- `axios` — HTTP client for API calls
- `@stripe/react-stripe-js` — Stripe React components
- `@stripe/stripe-js` — Stripe browser SDK
- `swiper` — Touch slider for hero banner
- `@gravity-ui/icons` — Icon library
- `next-themes` — Dark/light mode management
- `recharts` — Charts for vendor revenue page

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

## 🚀 Run Locally

### Server
```bash
cd ticketbari-server
npm install
# Fill in .env with your credentials
node seed.js   # seed the database
npm run dev
```

### Client
```bash
cd ticketbari-client
npm install
# Fill in .env.local with your credentials
npm run dev
```

## 🔧 Environment Variables

### Server `.env`