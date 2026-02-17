# Croatia360

**Premium AI-powered travel guide for Croatia.** Your personalized assistant for discovering the wonders of Croatia—sophisticated, elegant, unforgettable.

![Croatia360](https://storage.googleapis.com/croatiasara2026/images/regions/dalmacija/Dubrovnik_wall_tour.jpg)

## Features

- **SARA AI Chatbot** – AI travel assistant that creates personalized itineraries for Croatia. Ask about beaches, wine, culture, nature, or budget—SARA responds in your language.
- **Multi-language support** – Croatian, English, German, Italian, French, Czech, Polish, and Hungarian.
- **Inspiration cards** – Beaches, culture, nature, and gastronomy—each links to the chatbot with pre-filled queries.
- **Explore destinations** – Browse regions (Dalmatia, Istria, Kvarner, etc.) with accommodation, restaurants, and activities.
- **My Trip** – Save and manage your travel plans.
- **Dark/Light theme** – Toggle between themes for comfortable browsing.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **AI:** Vercel AI SDK + Google Gemini
- **Styling:** Tailwind CSS
- **i18n:** react-i18next
- **Database:** Supabase (optional)
- **UI:** Radix UI, shadcn/ui patterns

## Prerequisites

- Node.js 18+
- npm or pnpm

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/hans992/croatia360-v0.2.git
cd croatia360-v0.2
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Create a `.env.local` file in the project root:

```env
# Required for SARA AI chatbot
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

# Optional: Demo mode when API quota is exceeded
# CHAT_DEMO_MODE_ON_QUOTA=true

# Optional: Supabase (for auth, database)
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Get a Gemini API key at [Google AI Studio](https://ai.google.dev/).

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app defaults to Croatian; switch language via the header.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Deployment (Vercel)

1. Push to GitHub and connect the repo to [Vercel](https://vercel.com).
2. Add environment variables in the Vercel dashboard.
3. Deploy. Vercel will auto-detect Next.js and run `next build`.

## Project Structure

```
src/
├── app/
│   ├── [locale]/           # Locale-based routes
│   │   ├── page.tsx        # Home (hero, inspiration, chatbot)
│   │   ├── chat/           # Full chat experience
│   │   ├── explore/        # Destinations
│   │   ├── regions/        # Region pages
│   │   └── ...
│   └── api/
│       └── chat/           # SARA AI API route
├── components/
│   ├── chatbot/            # Chatbot UI
│   ├── HomeHero.tsx        # Hero with background image
│   ├── InspireCard.tsx      # Inspiration category cards
│   └── ...
├── lib/
│   └── i18n/               # i18n configuration
└── styles/
public/
└── locales/                # Translation JSON files
```

## License

Private project. All rights reserved.

---

Built with ❤️ for Croatia
