# Moalemi App

Moalemi ist eine Frontend-Anwendung fuer eine Lehrer-Schueler-Plattform mit Fokus auf Quran, Arabisch und Islamkunde.
Die App bietet unter anderem Lehrerprofile, Buchungs-Flow, Authentifizierung und mehrsprachige Oberflaeche (u. a. RTL/LTR-Unterstuetzung).

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- React Router
- Supabase (Auth / Backend-Anbindung)

## Projektstruktur

Das eigentliche Frontend liegt in:

- `app/frontend`

Wichtige Verzeichnisse innerhalb von `app/frontend/src`:

- `pages` - Routen und Seiten
- `components` - UI-Bausteine (Atoms, Molecules, Organisms, UI)
- `services` - API-/Business-Logik (z. B. Auth, Booking)
- `lib` - Utilities, Konfiguration, Supabase-Client
- `i18n` - Sprachen und Lokalisierung
- `data` - statische Daten / Mockdaten

## Voraussetzungen

- Node.js 18 oder neuer
- npm 9 oder neuer

## Installation

```bash
cd app/frontend
npm install
```

## Umgebungsvariablen

Lege in `app/frontend` eine Datei `.env` an:

```env
VITE_SUPABASE_URL=deine_supabase_url
VITE_SUPABASE_ANON_KEY=dein_supabase_anon_key
```

Optional:

```env
VITE_PORT=3000
```

## Entwicklungsstart

```bash
cd app/frontend
npm run dev
```

Standardmaessig laeuft die App auf:

- `http://localhost:3000`

## Build und Preview

Production-Build:

```bash
cd app/frontend
npm run build
```

Build lokal pruefen:

```bash
cd app/frontend
npm run preview
```

## Linting

```bash
cd app/frontend
npm run lint
```

## Zusaetzliche Dokumentation

- Architektur und Design-Dokumente: `app/frontend/docs/design`
- Frontend-spezifische README: `app/frontend/README.md`
