# LifeOS - Your Personal Dashboard

A comprehensive life management dashboard built with Next.js 14, featuring habit tracking, task management, workout logging, study sessions, project management, AI career coaching, and more.

## 🚀 Features

### 📊 Dashboard
- Overview of all life metrics
- Activity charts and statistics
- Quick access to all modules

### ✅ Habit Tracker
- Daily/weekly habit tracking
- Streak tracking with gamification
- Category-based organization
- Visual progress heatmap

### 📋 Task Manager
- Priority-based task management
- Subtasks and categories
- Due dates and reminders
- Recurring tasks support

### 💰 Finance Tracker
- Income and expense tracking
- Category-based budgeting
- Visual spending analytics

### 🏋️ Workout Manager
- Pre-built workout templates
- Exercise tracking with sets/reps
- Workout timer with rest intervals
- Weekly workout statistics

### 📚 Study Manager
- Pomodoro timer (25/5/15 intervals)
- Subject and topic tracking
- Study session logging
- Weekly progress charts

### 📁 Project Manager
- Project creation and tracking
- Task management per project
- Team member assignment
- Progress visualization

### 👥 Contact Manager
- Professional network management
- Tags and favorites
- Social links (LinkedIn, GitHub)
- Search and filter

### 🤖 AI Career Coach
- Gemini AI powered coaching
- Resume and interview tips
- Skill gap analysis
- Career strategy advice
- Offline fallback responses

### ⚙️ Settings
- Profile customization
- Theme settings (Dark/Light)
- Accent color selection
- Data export/import (JSON)
- Google Sheets sync
- Gemini API configuration

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Storage**: localStorage (offline-first)
- **Backend**: Google Apps Script (optional sync)
- **AI**: Google Gemini API

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🔧 Configuration

### Google Sheets Sync (Optional)

1. Create a new Google Sheet
2. Go to Extensions > Apps Script
3. Copy the contents of `google-apps-script.js`
4. Run the `setupSheets` function once to create all required sheets
5. Deploy as Web App:
   - Execute as: Me
   - Who has access: Anyone
6. Copy the deployment URL
7. Add to Settings > Data & Sync in the app

### Gemini AI (Optional)

1. Get an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to Settings > Privacy & Security in the app

## 📱 Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard overview |
| `/habits` | Habit tracker |
| `/tasks` | Task manager |
| `/finance` | Finance tracker |
| `/workout` | Workout manager |
| `/study` | Study sessions |
| `/projects` | Project manager |
| `/contacts` | Contact manager |
| `/coach` | AI career coach |
| `/settings` | App settings |

## 🎨 Design

- Dark theme inspired by modern productivity apps
- Glassmorphism UI elements
- Responsive design for all screen sizes
- Smooth animations and transitions

## 📄 License

MIT License
