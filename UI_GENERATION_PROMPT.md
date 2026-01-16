# LifeOS - Complete UI Generation Prompt

## Project Overview
Create a comprehensive personal dashboard application called **LifeOS** - a life operating system that helps users manage every aspect of their life through a unified, beautiful interface.

---

## 🎯 Core Concept
LifeOS is an all-in-one productivity and life management platform that combines:
- Personal productivity (habits, tasks, goals)
- Health & fitness tracking
- Financial management
- Knowledge management (study sessions, learning)
- Career development (projects, AI coaching)
- Social connections (contacts, network)
- Analytics & insights across all life areas

---

## 📱 Technical Stack

### Framework & Language
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: lucide-react
- **State Management**: React hooks, Context API
- **Data Storage**: localStorage (offline-first) + optional Google Sheets sync

### Project Structure
```
src/
├── app/
│   ├── page.tsx                    # Dashboard (Home)
│   ├── habits/page.tsx             # Habit Tracker
│   ├── tasks/page.tsx              # Task Manager
│   ├── finance/page.tsx            # Finance Tracker
│   ├── workout/page.tsx            # Workout/Health Manager
│   ├── study/page.tsx              # Study Manager
│   ├── projects/page.tsx           # Project Manager
│   ├── contacts/page.tsx           # Contact Manager
│   ├── progress/page.tsx           # Progress Analytics
│   ├── coach/page.tsx              # AI Career Coach
│   ├── settings/page.tsx           # Settings
│   ├── journal/page.tsx            # Daily Journal (NEW)
│   └── api/                        # API routes
├── components/
│   ├── layout/
│   │   ├── CleanLightLayout.tsx   # Light mode layout
│   │   └── ModernDarkLayout.tsx   # Dark mode layout
│   ├── Sidebar.tsx                 # Desktop navigation
│   ├── BottomNav.tsx               # Mobile navigation
│   └── [feature-components].tsx   # Page-specific components
├── context/
│   └── ThemeContext.tsx            # Theme management
└── lib/
    ├── types.ts                    # TypeScript types
    └── api.ts                      # API utilities
```

---

## 🎨 Design System Requirements

### Dual Theme Architecture
**CRITICAL**: The application must have TWO COMPLETELY DIFFERENT designs:

#### 1. Light Mode - "Fresh Professional"
- **Background**: Clean whites (slate-50, white)
- **Cards**: Subtle shadows, rounded-3xl, border-slate-200
- **Typography**: Sharp, modern sans-serif
- **Accents**: Indigo-600, emerald-500
- **Feel**: Minimalist, airy, professional, "Apple-like"
- **Layout**: Floating cards, generous white space
- **Shadows**: Soft, subtle (shadow-slate-200/40)

#### 2. Dark Mode - "Immersive Imperial"
- **Background**: Deep dark (#0a0a0f, #111118)
- **Cards**: Glassmorphism, backdrop-blur-xl
- **Typography**: Bold, UPPERCASE tracking for headers
- **Accents**: Violet-500, emerald-500, neon glows
- **Feel**: Command center, gaming UI, cyberpunk aesthetic
- **Layout**: Overlapping elements, gradient backgrounds
- **Effects**: Glowing accents, blur backgrounds, ambient lighting

### Mobile-First Design
- All pages MUST be fully responsive
- Mobile breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- Bottom navigation for mobile (< 1024px)
- Sidebar navigation for desktop (≥ 1024px)
- Touch-friendly targets (min 44px)
- Swipe gestures where appropriate

### Typography Scale
- Hero: text-4xl / text-5xl
- Headings: text-2xl / text-3xl
- Subheadings: text-xl
- Body: text-base
- Small: text-sm / text-xs
- Micro: text-[10px] (for labels)

### Spacing System
- Tight: gap-2, space-y-2
- Normal: gap-4, space-y-4
- Comfortable: gap-6, space-y-6
- Generous: gap-8, space-y-8

---

## 📄 Page Details

### 1. Dashboard (Home) `/`
**Purpose**: Central hub showing overview of all life areas

**Components**:
- **Header Section**
  - Dynamic greeting based on time (Good Morning/Afternoon/Evening)
  - Current streak counter
  - Pending tasks count
  - User avatar/profile

- **AI Daily Protocol** (Hero Section)
  - AI-generated personalized daily checklist
  - 6 categories: Health, Wealth, Wisdom, Mindset, Social, Career
  - Interactive checkboxes
  - Regenerate button
  - Uses user biometrics (height, weight, body measurements)

- **Quick Stats Grid** (4 columns on desktop, 2 on mobile)
  - Discipline Streak (with flame icon)
  - Missions Cleared (completed/total tasks)
  - Empire Level (gamification metric)
  - Focus Duration (daily time tracked)

- **Task Quick List**
  - Top 5 pending tasks
  - Quick add task input
  - One-click complete/uncomplete
  - Link to full task manager

- **Inspirational Content**
  - Daily wisdom quote (Hindu philosophy, motivation)
  - Billionaire affirmation (wealth mindset)
  - Rotating every 30 seconds

- **Meditation Timer**
  - Simple timer with play/pause/reset
  - Minutes:seconds display
  - Peaceful UI

- **Life Areas Overview** (6 cards)
  - Health & Fitness
  - Wealth & Finance
  - Knowledge & Growth
  - Mindset & Spirit
  - Relationships
  - Career & Skills
  - Each with icon, name, progress bar

- **English Vocabulary Tip**
  - Word of the day
  - Pronunciation guide
  - Definition
  - Example sentence

### 2. Habits `/habits`
**Purpose**: Track and build daily/weekly habits

**Features**:
- Habit list with completion checkboxes
- Daily/weekly frequency toggles
- Streak counters (with fire emojis for long streaks)
- Category tags (Health, Productivity, Learning, etc.)
- Add habit modal with:
  - Name, description
  - Frequency (daily, specific days, custom)
  - Category selection
  - Icon picker
- Heatmap calendar view (GitHub contribution style)
- Stats dashboard:
  - Total active habits
  - Current streak
  - Best streak
  - Completion rate
- Edit/delete habits
- Archive completed habits

**UI Elements**:
- Large toggle buttons for completion
- Color-coded by category
- Confetti animation on completion
- Progress rings for weekly habits

### 3. Tasks `/tasks`
**Purpose**: Comprehensive task and todo management

**Features**:
- Task list with filters:
  - All, Todo, In Progress, Completed
  - Priority: High, Medium, Low
  - Category: Work, Personal, Health, Learning, etc.
- Task cards showing:
  - Title, description
  - Priority badge (color-coded)
  - Due date
  - Category tag
  - Subtasks progress (2/5 completed)
- Add task modal:
  - Title, description (textarea)
  - Priority selector
  - Due date picker
  - Category dropdown
  - Tags (multi-select)
  - Subtasks (add/remove list)
  - Recurring option (daily, weekly, monthly)
- Drag and drop reordering
- Bulk actions (select multiple, delete, mark complete)
- Calendar view option
- Kanban board view option

**UI Elements**:
- Status badges
- Priority indicators (!, !!, !!!)
- Progress bars for subtasks
- Date picker with calendar
- Tag chips

### 4. Finance `/finance`
**Purpose**: Track income, expenses, and financial goals

**Features**:
- Dashboard showing:
  - Current balance
  - Monthly income
  - Monthly expenses
  - Savings rate
- Transaction list:
  - Date, description, amount, category
  - Filter by date range, category, type
  - Search transactions
- Add transaction modal:
  - Type (income/expense)
  - Amount (currency input)
  - Category (dropdown with icons)
  - Date picker
  - Description (optional)
  - Payment method (cash, card, UPI, etc.)
- Category breakdown (pie chart)
- Monthly spending trends (line chart)
- Budget vs actual comparison (bar chart)
- Recurring transactions setup
- Financial goals:
  - Target amount
  - Current progress
  - Deadline
  - Progress bar

**Categories**:
- Income: Salary, Freelance, Investment, Other
- Expense: Food, Transport, Shopping, Bills, Entertainment, Health, Education, Other

### 5. Workout (Health) `/workout`
**Purpose**: Track workouts, exercises, and fitness progress

**Features**:
- Workout templates:
  - Full Body, Upper Body, Lower Body, Cardio, Yoga
  - Each with exercise list
- Active workout mode:
  - Exercise list with sets/reps/weight
  - Timer for rest intervals
  - Checkmarks for completed sets
  - Next exercise preview
  - Finish workout summary
- Workout history:
  - Date, type, duration, exercises
  - Total volume (sets × reps × weight)
  - Calories burned estimate
- Exercise library:
  - Name, category (chest, back, legs, etc.)
  - Description, form tips
  - Video link placeholder
- Progress tracking:
  - Weekly workout count
  - Total volume over time
  - Personal records (PRs)
  - Body measurements (weight, chest, arms, etc.)
- Calendar view of workout days

**UI Elements**:
- Large workout cards
- Timer with progress ring
- Exercise illustrations (icons)
- Weight/rep input fields
- PR badges

### 6. Study `/study`
**Purpose**: Track study sessions with Pomodoro technique

**Features**:
- Pomodoro timer:
  - 25 min focus / 5 min break / 15 min long break
  - Customizable durations
  - Audio notification on completion
  - Pause/resume/skip
- Study session logger:
  - Subject/topic selection
  - Duration (auto-filled from timer)
  - Notes (optional)
  - Date stamp
- Subject management:
  - Add/edit subjects
  - Color coding
  - Icon selection
- Study history:
  - Sessions by date
  - Total hours per subject
  - Daily/weekly/monthly views
- Analytics:
  - Total study hours (today, week, month)
  - Most studied subjects (bar chart)
  - Study streak
  - Peak study hours (heatmap)

**UI Elements**:
- Large circular timer
- Subject color badges
- Time duration badges
- Progress charts

### 7. Projects `/projects`
**Purpose**: Manage projects and their associated tasks

**Features**:
- Project cards showing:
  - Name, description
  - Status (Planning, Active, Paused, Completed)
  - Progress percentage
  - Task count (completed/total)
  - Team members (avatars)
  - Deadline
- Add project modal:
  - Name, description
  - Status dropdown
  - Start/end dates
  - Team member emails (comma-separated)
  - Tags
- Project detail view:
  - Task list (same as main tasks but filtered)
  - Milestone timeline
  - Activity log
  - Team member list
- Kanban board for tasks within project
- Gantt chart view (optional)

**UI Elements**:
- Status badges with colors
- Progress rings
- Avatar stacks for team
- Timeline visualization

### 8. Contacts `/contacts`
**Purpose**: Manage professional and personal network

**Features**:
- Contact cards:
  - Name, email, phone
  - Company, position
  - Photo/avatar
  - Tags (Client, Colleague, Friend, Family, etc.)
  - Social links (LinkedIn, Twitter, GitHub, website)
  - Notes
- Add/edit contact modal
- Search and filter:
  - By name, company, tag
  - Favorites filter
- Alphabetical grouping (A, B, C sections)
- Quick actions:
  - Call, email, message icons
  - Favorite/unfavorite star
- Contact detail view:
  - Full information
  - Interaction history log
  - Related projects

**UI Elements**:
- Avatar grid/list toggle
- Tag chips
- Social icons
- Favorite star
- Search bar with live filtering

### 9. Progress `/progress`
**Purpose**: Analytics and insights across all life areas

**Features**:
- Overview stats:
  - Total habits tracked
  - Tasks completed
  - Study hours logged
  - Workouts completed
  - Money saved
- Habit analytics:
  - Completion rate over time (line chart)
  - Best/current streaks
  - Most consistent habits
- Task analytics:
  - Completion velocity (tasks/day)
  - Task breakdown by category (pie)
  - Average completion time
- Study analytics:
  - Total hours by subject (bar chart)
  - Study pattern (time of day heatmap)
  - Weekly comparison
- Workout analytics:
  - Workout frequency
  - Volume progression
  - Body measurements over time
- Finance analytics:
  - Net worth over time
  - Spending patterns
  - Savings rate trend
- Life score calculation:
  - Overall score (0-100)
  - Category scores (Health, Wealth, Wisdom, etc.)
  - Radar chart visualization

### 10. AI Coach `/coach`
**Purpose**: AI-powered career advice and guidance

**Features**:
- Chat interface:
  - Message bubbles (user vs AI)
  - Typing indicator
  - Timestamp
- Pre-defined prompts:
  - "Help me with career planning"
  - "How do I improve my skills?"
  - "What should I learn next?"
  - "Review my progress"
- AI responses:
  - Formatted with markdown support
  - Code blocks for technical advice
  - Bulleted lists
  - Personalized based on user data
- Chat history:
  - Saved conversations
  - Clear history option
- Context-aware:
  - AI has access to user's habits, tasks, study data
  - Provides personalized recommendations

**UI Elements**:
- Chat bubbles with tails
- Gradient AI avatar
- Smooth message animations
- Input with send button
- Prompt suggestion chips

### 11. Settings `/settings`
**Purpose**: Configure app preferences

**Features**:
- **Profile**:
  - Name, email
  - Avatar upload
  - Bio
  - Biometrics (height, weight, body measurements)
  
- **Appearance**:
  - Theme toggle (Light/Dark/System)
  - Accent color picker
  - Font size adjustment
  
- **Data & Sync**:
  - Google Sheets sync setup
  - Export data (JSON)
  - Import data
  - Clear all data (with confirmation)
  
- **Notifications**:
  - Habit reminders
  - Task due date alerts
  - Study session reminders
  - Browser notification toggle
  
- **Privacy**:
  - Password protection (optional)
  - Biometric lock (if supported)
  - Data encryption toggle
  
- **About**:
  - Version number
  - Credits
  - GitHub link
  - Support/feedback

### 12. Journal `/journal` ⚡ NEW PAGE
**Purpose**: Daily journaling and reflection

**Features**:
- **Daily Entries**:
  - Date selector (calendar icon)
  - Rich text editor for journal entry
  - Mood selector (emoji picker)
  - Gratitude prompts (3 things)
  - Goals for the day (3 items)
  - Evening reflection (What went well? What to improve?)
  
- **Journal History**:
  - Calendar view showing days with entries
  - List view with previews
  - Search entries by keyword
  - Filter by mood/date range
  
- **Prompts Library**:
  - Morning prompts: "What am I grateful for?", "What's my intention today?"
  - Evening prompts: "What did I learn?", "What challenged me?"
  - Weekly review: "What progress did I make?", "What needs attention?"
  
- **Insights**:
  - Mood tracking over time (line chart)
  - Most common themes/words (word cloud)
  - Writing streak counter
  - Total entries count
  
- **Templates**:
  - Morning Routine
  - Evening Reflection
  - Weekly Review
  - Gratitude Journal
  - Dream Journal
  - Custom templates

**UI Elements**:
- Rich text editor (bold, italic, lists, headings)
- Mood emoji selector (😊😐😔😡😰)
- Date picker calendar
- Word count indicator
- Auto-save indicator
- Markdown support

---

## 🎯 Key Features Across All Pages

### Navigation
- **Desktop (≥1024px)**:
  - Left sidebar (280px wide, collapsible to 80px)
  - Brand logo at top
  - Navigation items with icons and labels
  - Active state with accent bar
  - User profile at bottom
  - Logout button
  
- **Mobile (<1024px)**:
  - Fixed bottom navigation bar (80px height, rounded-3xl)
  - 4 main items + "More" menu
  - Active state with top accent line
  - Floating drawer for "More" items

### Authentication
- Simple password-based login
- No backend required
- Password stored in localStorage
- Login screen with:
  - App logo/name
  - Password input
  - Remember me checkbox
  - Login button

### Data Management
- All data stored in localStorage
- Optional Google Sheets sync
- Import/export functionality
- Auto-save on changes
- Offline-first approach

### Animations & Interactions
- Framer Motion for page transitions
- Smooth hover effects
- Loading states with spinners
- Success feedback (checkmarks, confetti)
- Error states with messages
- Skeleton loaders for data fetching
- Micro-interactions on buttons
- Smooth scroll behavior

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus indicators
- Screen reader support
- Color contrast compliance (WCAG AA)

---

## 🔧 Component Requirements

### Reusable Components Needed

1. **Cards**
   - `Card` - base card component
   - `StatsCard` - for metrics
   - `InfoCard` - for content

2. **Forms**
   - `Input` - text input
   - `Textarea` - multiline input
   - `Select` - dropdown
   - `DatePicker` - date selection
   - `Toggle` - switch
   - `Checkbox` - checkbox
   - `Radio` - radio button

3. **Buttons**
   - `Button` - primary action
   - `IconButton` - icon only
   - `FloatingActionButton` - fab

4. **Modals**
   - `Modal` - base modal
   - `ConfirmDialog` - confirmation
   - `DrawerModal` - slide from side

5. **Data Display**
   - `Table` - data table
   - `List` - item list
   - `Badge` - status badge
   - `Avatar` - user avatar
   - `ProgressBar` - linear progress
   - `ProgressRing` - circular progress

6. **Charts** (using Recharts)
   - `LineChart` - trends
   - `BarChart` - comparisons
   - `PieChart` - proportions
   - `AreaChart` - filled trends
   - `RadarChart` - multi-axis

7. **Feedback**
   - `Toast` - notifications
   - `Loading` - spinner
   - `Empty` - no data state
   - `Error` - error state

---

## 📊 Data Models

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  biometrics: {
    height: string;
    weight: string;
    chest: string;
    stomach: string;
  };
}

interface Habit {
  id: string;
  name: string;
  description?: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'custom';
  daysOfWeek?: number[]; // 0-6 for Sun-Sat
  icon?: string;
  color?: string;
  streak: number;
  bestStreak: number;
  completedDates: string[]; // ISO date strings
  createdAt: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  category: string;
  tags: string[];
  dueDate?: string;
  subtasks: Subtask[];
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
  };
  createdAt: string;
  completedAt?: string;
}

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description?: string;
  date: string;
  paymentMethod?: string;
  recurring?: boolean;
}

interface Workout {
  id: string;
  name: string;
  type: string;
  exercises: Exercise[];
  date: string;
  duration: number; // minutes
  notes?: string;
}

interface Exercise {
  id: string;
  name: string;
  sets: Set[];
  category: string;
}

interface Set {
  reps: number;
  weight: number;
  completed: boolean;
}

interface StudySession {
  id: string;
  subject: string;
  topic?: string;
  duration: number; // minutes
  date: string;
  notes?: string;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'paused' | 'completed';
  startDate: string;
  endDate?: string;
  tasks: string[]; // task IDs
  team: string[]; // emails
  tags: string[];
  progress: number; // 0-100
}

interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  avatar?: string;
  tags: string[];
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  notes?: string;
  favorite: boolean;
}

interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood?: string; // emoji
  gratitude?: string[];
  goals?: string[];
  reflection?: string;
}
```

---

## 🎨 Design Specifications

### Color Palette

**Light Mode**:
- Primary: `indigo-600` (#4F46E5)
- Secondary: `emerald-500` (#10B981)
- Background: `slate-50` (#F8FAFC)
- Surface: `white` (#FFFFFF)
- Text: `slate-900` (#0F172A)
- Muted: `slate-500` (#64748B)
- Border: `slate-200` (#E2E8F0)
- Error: `red-500` (#EF4444)
- Warning: `amber-500` (#F59E0B)
- Success: `green-500` (#22C55E)

**Dark Mode**:
- Primary: `violet-500` (#8B5CF6)
- Secondary: `emerald-500` (#10B981)
- Background: `#0a0a0f`
- Surface: `#111118`
- Text: `zinc-50` (#FAFAFA)
- Muted: `zinc-400` (#A1A1AA)
- Border: `zinc-800` (#27272A)
- Error: `red-500` (#EF4444)
- Warning: `amber-500` (#F59E0B)
- Success: `green-500` (#22C55E)

### Border Radius
- Small: `rounded-lg` (0.5rem)
- Medium: `rounded-xl` (0.75rem)
- Large: `rounded-2xl` (1rem)
- XLarge: `rounded-3xl` (1.5rem)
- Full: `rounded-full` (9999px)

### Shadows
- Light: `shadow-sm`
- Normal: `shadow-md`
- Large: `shadow-lg`
- XLarge: `shadow-xl`
- Custom: `shadow-indigo-500/30` (colored shadow)

---

## 🚀 Implementation Priority

### Phase 1 (MVP)
1. Authentication & Layout
2. Dashboard (Home)
3. Habits
4. Tasks
5. Settings

### Phase 2 (Core Features)
6. Finance
7. Workout
8. Study
9. Projects

### Phase 3 (Advanced)
10. Contacts
11. Progress
12. AI Coach
13. Journal

---

## 📝 Additional Requirements

### Performance
- Code splitting per page
- Lazy loading for charts
- Debounced search inputs
- Optimistic UI updates
- Virtual scrolling for long lists

### SEO & PWA
- Metadata for each page
- Open Graph tags
- PWA manifest
- Service worker for offline
- App icons (192x192, 512x512)

### Error Handling
- Try-catch blocks for API calls
- Error boundaries for React
- User-friendly error messages
- Retry mechanisms
- Fallback UI

### Testing Considerations
- Unit tests for utilities
- Integration tests for components
- E2E tests for critical flows
- Accessibility tests

---

## 🎯 Success Metrics

The UI should enable users to:
1. Track habits consistently (>80% completion rate)
2. Manage tasks efficiently (reduce cognitive load)
3. Visualize progress clearly (charts, graphs)
4. Access data quickly (< 2 seconds page load)
5. Switch themes seamlessly (instant)
6. Use on any device (responsive)
7. Work offline (PWA)
8. Export their data (portability)

---

## 📋 Final Notes

- All pages should feel cohesive despite different themes
- Prioritize user experience over flashy animations
- Keep the UI clean and uncluttered
- Use consistent spacing and sizing
- Ensure accessibility at every step
- Make it feel personal and customizable
- Focus on productivity, not distraction

**This is a complete productivity ecosystem, not just a dashboard.**

---

## 🎨 DESIGN AESTHETICS

*[User will provide design aesthetic preferences here]*

### Design Direction Placeholder:
- Visual style: [Minimalist / Futuristic / Organic / Geometric]
- Color intensity: [Subtle / Vibrant / Neon]
- Animation style: [Smooth / Snappy / Fluid]
- Layout density: [Compact / Comfortable / Spacious]
- Component style: [Rounded / Sharp / Mixed]
- Effects: [Shadows / Glows / Gradients / Flat]
- Overall mood: [Professional / Playful / Serious / Energetic]

---

**End of Prompt**

*Use this prompt to generate a complete, production-ready UI for LifeOS. All pages, components, and features are detailed above. Implement with attention to design system consistency and user experience.*
