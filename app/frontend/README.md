# Moalemi / Mein Lehrer

A bilingual (Arabic/German) marketplace platform connecting students with qualified teachers for Quran, Arabic language, and Islamic studies.

## Tech Stack

- **React 18** with TypeScript
- **Vite** — Fast build tool
- **Tailwind CSS** — Utility-first styling
- **shadcn/ui** — Accessible UI components
- **React Router v6** — Client-side routing
- **RTL/LTR Support** — Dynamic direction switching

## Features

- 🌐 Bilingual interface (Arabic RTL / German LTR)
- 👨‍🏫 Teacher profiles with specializations and ratings
- 📅 Booking system with confirmation
- 🔐 Authentication flow (login/register)
- 📊 Student & Teacher dashboards
- 🎨 Islamic-inspired color palette

## Getting Started

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## Build

```bash
npm run build
```

## Project Structure

- `src/components/` — Reusable UI components (atoms, molecules, organisms)
- `src/pages/` — Route-level page components
- `src/i18n/` — Internationalization (LanguageContext, translations)
- `src/data/` — Mock data and types