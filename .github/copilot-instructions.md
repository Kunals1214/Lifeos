# LifeOS Project Instructions

## Project Overview
LifeOS is a comprehensive personal dashboard built with Next.js 14, featuring:
- Sidebar navigation with dark theme
- Multiple management pages (Habits, Tasks, Finance, Workout, Study, Projects, Contacts)
- AI Career Coach powered by Gemini
- Google Sheets sync for data persistence

## Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with dark theme (#0a0a0f background)
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: lucide-react
- **Storage**: localStorage (offline-first), Google Sheets (optional sync)

## Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── coach/        # AI Coach endpoint
│   │   └── ...
│   ├── habits/           # Habit tracker page
│   ├── tasks/            # Task manager page
│   ├── workout/          # Workout manager page
│   ├── study/            # Study manager page
│   ├── projects/         # Project manager page
│   ├── contacts/         # Contact manager page
│   ├── coach/            # AI Coach page
│   ├── settings/         # Settings page
│   └── page.tsx          # Dashboard (home)
├── components/            # React components
│   ├── Sidebar.tsx       # Main navigation
│   ├── ClientLayout.tsx  # Layout wrapper
│   ├── Dashboard.tsx     # Main dashboard
│   └── ...               # Feature components
└── lib/                   # Utilities and types
```

## Development Commands
```bash
npm run dev    # Start dev server
npm run build  # Build for production
npm run lint   # Run ESLint
```

## Design Guidelines
- Use dark backgrounds: #0a0a0f, #16161d, #111118
- Accent colors: emerald-500, cyan-500
- All components should use Tailwind CSS
- Animations via Framer Motion

## Google Sheets Setup
1. Copy `google-apps-script.js` to Apps Script
2. Run `setupSheets()` function
3. Deploy as Web App
4. Add URL to Settings > Data & Sync
