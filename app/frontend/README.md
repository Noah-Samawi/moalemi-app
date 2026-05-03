# Moalemi / Mein Lehrer

A bilingual (Arabic/German) marketplace platform connecting students with qualified teachers for Quran, Arabic language, and Islamic studies.

## Tech Stack

- **React 18** with TypeScript
- **Vite** — Fast, modern build tool
- **Tailwind CSS** — Utility-first styling
- **shadcn/ui** — Accessible UI components
- **React Router v6** — Client-side routing
- **Supabase** — Auth and PostgreSQL backend
- **RTL / LTR Support** — Dynamic direction switching for Arabic and German

## Features

- 🌐 Bilingual UX: Arabic RTL and German LTR support
- 👩‍🏫 Live teacher listings fetched from Supabase
- 📅 Booking submission via Supabase `bookings` table
- 🔐 Authentication using Supabase auth
- 🧑‍💼 Admin dashboard for teacher management and booking review
- 🎨 Islamic-modern styling with emerald accents

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file with your Supabase settings:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Start the development server:

```bash
npm run dev
```

4. Open the app at `http://localhost:5173`.

## Build

```bash
npm run build
```

## Important Routes

- `/` — Home page with teacher listings
- `/teacher/:id` — Teacher profile and booking page
- `/admin` — Admin dashboard (requires admin user)

## Project Structure

- `src/components/` — Reusable UI components (`atoms`, `molecules`, `organisms`)
- `src/pages/` — Route-level page components
- `src/context/` — Shared app state and live data provider
- `src/i18n/` — Language context and translations
- `src/lib/` — App utilities and Supabase client
- `src/data/` — Mock data and local fixtures

## Notes

- The app supports real-time refresh of teachers and bookings via Supabase.
- The UI adapts automatically when switching between German and Arabic.
