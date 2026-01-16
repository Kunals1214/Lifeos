# LifeOS Design System

This document outlines the complete design system extracted from the reference HTML designs, ensuring visual consistency across all pages in both light and dark modes.

## 🎨 Design Philosophy

### Light Mode: Professional & Clean
- **Aesthetic**: Minimalist, professional, airy
- **Target Feeling**: Fresh, organized, clarity
- **Visual Style**: Soft shadows, subtle borders, white space

### Dark Mode: Futuristic & Immersive
- **Aesthetic**: Cyberpunk, immersive, high-tech
- **Target Feeling**: Power, focus, sophistication
- **Visual Style**: Glass effects, neon glows, deep space

---

## 📐 Typography

### Light Mode
```css
Primary Font: 'Plus Jakarta Sans', sans-serif
Font Weights:
  - Regular: 400
  - Medium: 500
  - Semibold: 600
  - Bold: 700

Sizes:
  - Heading 1: 48-56px (3xl-5xl), font-bold
  - Heading 2: 36-40px (2xl-4xl), font-bold
  - Heading 3: 24px (xl), font-bold
  - Body: 14px (sm), font-medium
  - Caption: 12px (xs), font-medium
```

### Dark Mode
```css
Display Font: 'Space Grotesk', sans-serif (headings, numbers)
Body Font: 'Inter', sans-serif (text, labels)

Font Weights:
  - Light: 300
  - Regular: 400
  - Medium: 500
  - Semibold: 600
  - Bold: 700

Sizes:
  - Hero: 72-84px (7xl), font-bold, tracking-tighter
  - Heading 1: 56px (5xl), font-bold
  - Heading 2: 36px (2xl), font-bold
  - Body: 14px (sm), font-medium
  - Caption: 10-12px (xs), font-medium, uppercase, tracking-wider
```

---

## 🎨 Color Palette

### Light Mode
```css
/* Backgrounds */
--bg-primary: #F8FAFC (slate-50)
--bg-secondary: #FFFFFF (white)
--bg-sidebar: #334155 (slate-700)
--bg-hover: rgba(255, 255, 255, 0.05)

/* Text */
--text-primary: #1e293b (slate-800)
--text-secondary: #64748b (slate-500)
--text-tertiary: #94a3b8 (slate-400)
--text-inverse: #ffffff (white)

/* Accent Colors */
--accent-primary: #6366f1 (indigo-500)
--accent-secondary: #10b981 (green-500)
--accent-orange: #f97316 (orange-500)
--accent-blue: #3b82f6 (blue-500)
--accent-purple: #8b5cf6 (violet-500)
--accent-pink: #ec4899 (pink-500)
--accent-rose: #f43f5e (rose-500)

/* Category Colors */
--category-mindset: #8b5cf6 (purple)
--category-health: #ec4899 (pink)
--category-study: #3b82f6 (blue)
--category-career: #10b981 (green)

/* Status Colors */
--status-success: #10b981 (green-500)
--status-warning: #f59e0b (amber-500)
--status-error: #ef4444 (red-500)

/* Borders */
--border-light: #e2e8f0 (slate-200)
--border-medium: #cbd5e1 (slate-300)
--border-dark: rgba(0, 0, 0, 0.1)

/* Shadows */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
```

### Dark Mode
```css
/* Backgrounds */
--bg-primary: #0a0a0f (deep space dark)
--bg-secondary: #0f0f16 (card background)
--bg-sidebar: #16161f (slightly lighter)
--bg-card: rgba(255, 255, 255, 0.03)
--bg-card-hover: rgba(255, 255, 255, 0.05)

/* Text */
--text-primary: #ffffff (white)
--text-secondary: #a1a1aa (zinc-400)
--text-tertiary: #71717a (zinc-500)

/* Accent Colors */
--accent-primary: #8b5cf6 (violet-500)
--accent-secondary: #10b981 (green-500)
--accent-cyan: #06b6d4 (cyan-500)
--accent-blue: #3b82f6 (blue-500)
--accent-purple: #a855f7 (purple-500)
--accent-pink: #ec4899 (pink-500)
--accent-orange: #f97316 (orange-500)

/* Category Colors */
--category-mindset: #a855f7 (purple-500)
--category-health: #ec4899 (pink-500)
--category-study: #3b82f6 (blue-500)
--category-career: #10b981 (green-500)

/* Borders */
--border-light: rgba(255, 255, 255, 0.05)
--border-medium: rgba(255, 255, 255, 0.1)
--border-glow: rgba(139, 92, 246, 0.2)

/* Shadows */
--shadow-neon: 0 0 20px rgba(139, 92, 246, 0.3)
--shadow-neon-lg: 0 0 40px rgba(139, 92, 246, 0.4)
--shadow-glow: 0 8px 32px rgba(0, 0, 0, 0.4)
```

---

## 🏗️ Component Patterns

### Cards

#### Light Mode
```tsx
<div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
  {/* Content */}
</div>

// Hover state
hover:shadow-md hover:border-slate-200 transition-shadow
```

#### Dark Mode
```tsx
<div className="bg-white/[0.03] backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-neon">
  {/* Content */}
</div>

// Hover state
hover:bg-white/5 hover:border-white/20 transition-all
```

### Buttons

#### Light Mode
```tsx
// Primary
<button className="bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-600 transition-colors shadow-md">
  Button Text
</button>

// Secondary
<button className="bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-200 transition-colors">
  Button Text
</button>

// Ghost
<button className="text-slate-600 hover:text-slate-800 hover:bg-slate-50 px-4 py-2 rounded-lg transition-colors">
  Button Text
</button>
```

#### Dark Mode
```tsx
// Primary
<button className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:brightness-110 transition-all shadow-neon">
  Button Text
</button>

// Secondary
<button className="bg-white/10 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 border border-white/10 transition-colors backdrop-blur-sm">
  Button Text
</button>

// Ghost
<button className="text-zinc-400 hover:text-white hover:bg-white/5 px-4 py-2 rounded-lg transition-colors">
  Button Text
</button>
```

### Sidebar

#### Light Mode
```tsx
<aside className="w-64 bg-slate-700 h-screen flex flex-col">
  {/* Logo */}
  <div className="p-6">
    <h1 className="text-white text-2xl font-bold">LifeOS</h1>
  </div>
  
  {/* Navigation */}
  <nav className="flex-1 px-3">
    <a className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
      <span className="material-icons-round">dashboard</span>
      <span className="font-medium">Dashboard</span>
    </a>
    {/* Active state */}
    <a className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 text-white font-semibold">
      <span className="material-icons-round">check_circle</span>
      <span>Habits</span>
    </a>
  </nav>
  
  {/* User Profile */}
  <div className="p-4 border-t border-white/10">
    <div className="flex items-center gap-3">
      <img className="w-10 h-10 rounded-full" />
      <div>
        <p className="text-sm font-semibold text-white">Alex Morgan</p>
        <p className="text-xs text-slate-400">Pro Plan</p>
      </div>
    </div>
  </div>
</aside>
```

#### Dark Mode
```tsx
<aside className="w-64 bg-[#16161f] border-r border-white/5 h-screen flex flex-col">
  {/* Logo with glow */}
  <div className="p-6">
    <h1 className="text-white text-2xl font-bold font-display tracking-tight">
      Life<span className="text-violet-500">OS</span>
    </h1>
  </div>
  
  {/* Navigation */}
  <nav className="flex-1 px-3">
    <a className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:bg-white/5 hover:text-white transition-colors group">
      <span className="material-icons-round text-lg">dashboard</span>
      <span className="font-medium">Dashboard</span>
    </a>
    {/* Active state with gradient */}
    <a className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-white font-semibold border border-violet-500/30 shadow-neon">
      <span className="material-icons-round text-lg">check_circle</span>
      <span>Habits</span>
    </a>
  </nav>
  
  {/* User Profile with glow */}
  <div className="p-4 border-t border-white/10">
    <div className="flex items-center gap-3">
      <img className="w-10 h-10 rounded-full border-2 border-violet-500" />
      <div>
        <p className="text-sm font-bold text-white">Alex Morgan</p>
        <p className="text-xs text-zinc-400">Pro Member</p>
      </div>
    </div>
  </div>
</aside>
```

### Header Bar

#### Light Mode
```tsx
<header className="sticky top-0 z-10 bg-white/70 backdrop-blur-md px-8 py-5 flex justify-between items-center border-b border-slate-200">
  <div className="flex items-center gap-4">
    <h1 className="font-bold text-xl text-slate-800">DASHBOARD</h1>
    <nav className="flex gap-6 text-sm font-medium text-slate-400">
      <a className="text-slate-800 border-b-2 border-slate-800 pb-1">Overview</a>
      <a className="hover:text-slate-600">Insights</a>
    </nav>
  </div>
  <div className="flex items-center gap-4">
    {/* Right side content */}
  </div>
</header>
```

#### Dark Mode
```tsx
<header className="sticky top-0 z-10 bg-[#0a0a0f]/70 backdrop-blur-md px-8 py-5 flex justify-between items-center border-b border-white/5">
  <div className="flex items-center gap-4">
    <h1 className="font-display font-bold text-xl uppercase tracking-widest text-white">DASHBOARD</h1>
    <nav className="flex gap-6 text-sm font-medium text-zinc-500">
      <a className="text-white border-b-2 border-violet-500 pb-1">Overview</a>
      <a className="hover:text-zinc-300 transition-colors">Insights</a>
    </nav>
  </div>
  <div className="flex items-center gap-4">
    {/* Right side content */}
  </div>
</header>
```

### Hero Cards

#### Light Mode
```tsx
<div className="bg-gradient-to-br from-[#457b9d] to-[#1d3557] rounded-3xl p-8 relative overflow-hidden shadow-lg text-white">
  <div className="absolute top-0 right-0 w-full h-full opacity-20 bg-[url('pattern.png')]"></div>
  <div className="relative z-10">
    <p className="text-blue-100 mb-1 font-medium">Monday, Oct 24</p>
    <h2 className="text-5xl font-bold mb-4">Keep it up, Alex!</h2>
    <div className="flex items-center gap-4">
      <div className="text-5xl font-light">82<span className="text-2xl opacity-70">%</span></div>
    </div>
  </div>
</div>
```

#### Dark Mode
```tsx
<div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 relative overflow-hidden group backdrop-blur-xl">
  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-violet-500/10"></div>
  <div className="relative z-10">
    <h3 className="text-zinc-400 text-sm font-medium mb-1">Current Streak</h3>
    <div className="font-display font-bold text-7xl text-white tracking-tighter">
      24<span className="text-4xl text-violet-500 align-top">Days</span>
    </div>
  </div>
  <div className="absolute bottom-0 right-0 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl"></div>
</div>
```

### Stats Cards

#### Light Mode
```tsx
<div className="bg-orange-100 rounded-3xl p-6 shadow-sm relative">
  <div className="flex justify-between items-start mb-2">
    <h3 className="font-bold text-slate-800">Consistency</h3>
    <span className="bg-white text-xs font-bold px-2 py-1 rounded-md text-slate-500">+2%</span>
  </div>
  <div className="flex items-end gap-2 mb-4">
    <span className="text-6xl font-light text-slate-800">87</span>
    <span className="text-2xl text-slate-400 mb-2">/100</span>
  </div>
  {/* Circular progress */}
  <div className="absolute top-8 right-8 w-24 h-24">
    <svg className="transform -rotate-90">
      <circle className="text-orange-200" stroke="currentColor" stroke-width="3" />
      <circle className="text-orange-500" stroke="currentColor" stroke-dasharray="87, 100" />
    </svg>
  </div>
</div>
```

#### Dark Mode
```tsx
<div className="bg-[#1a1512] border border-orange-900/30 rounded-3xl p-8 relative overflow-hidden backdrop-blur-sm">
  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-bl-full"></div>
  <div className="flex justify-between items-start z-10">
    <div>
      <h3 className="text-orange-200/60 font-medium mb-1">Discipline</h3>
      <div className="font-display font-bold text-6xl text-orange-50">
        87<span className="text-2xl align-top text-orange-400">%</span>
      </div>
    </div>
    {/* Circular progress with glow */}
    <div className="relative w-20 h-20">
      <svg className="w-full h-full transform -rotate-90">
        <circle className="text-orange-900/40" stroke="currentColor" stroke-width="8" />
        <circle className="text-orange-500" stroke="currentColor" stroke-dasharray="226" stroke-dashoffset="30" />
      </svg>
    </div>
  </div>
</div>
```

### Habit List Items

#### Light Mode
```tsx
<label className="relative flex items-center cursor-pointer p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
  <input type="checkbox" className="form-checkbox h-6 w-6 text-green-500 rounded-lg border-slate-300" />
  <div className="ml-4 flex-1">
    <span className="block text-sm font-bold text-slate-800">Morning Meditation</span>
    <span className="block text-xs text-slate-400">Scheduled: 7:00 AM</span>
  </div>
  <div className="bg-green-50 p-2 rounded-full text-green-500">
    <span className="material-icons-round text-sm">self_improvement</span>
  </div>
</label>
```

#### Dark Mode
```tsx
<div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors group cursor-pointer">
  <div className="relative">
    <img className="w-12 h-12 rounded-full border-2 border-white/10" />
    <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-[#0f0f16]"></div>
  </div>
  <div className="flex-1">
    <h4 className="font-semibold text-white text-sm">Morning Meditation</h4>
    <div className="flex items-center gap-2 mt-1">
      <span className="text-xs px-2 py-0.5 rounded-md bg-purple-900/30 text-purple-300">Mindset</span>
      <span className="text-xs text-zinc-400">15 min</span>
    </div>
  </div>
  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors">
    <span className="material-icons-round text-lg">check</span>
  </div>
</div>
```

---

## 🎭 Effects & Animations

### Light Mode
```css
/* Hover Effects */
.hover-lift {
  transition: transform 0.2s, shadow 0.2s;
}
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

/* Smooth Transitions */
transition-colors duration-200
transition-all duration-300

/* Subtle Shadows */
shadow-sm
shadow-md
shadow-lg
```

### Dark Mode
```css
/* Glass Effect */
.glass {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Neon Glow */
.neon-glow {
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
}

.neon-glow-lg {
  box-shadow: 0 0 40px rgba(139, 92, 246, 0.4);
}

/* Gradient Blur Backgrounds */
.blur-orb {
  position: absolute;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%);
  filter: blur(120px);
  pointer-events: none;
}

/* Hover Glow */
.hover-glow:hover {
  box-shadow: 0 0 30px rgba(139, 92, 246, 0.4);
  border-color: rgba(139, 92, 246, 0.5);
}

/* Smooth Transforms */
transition-all duration-300
hover:scale-110
hover:brightness-110
```

---

## 📱 Responsive Patterns

### Breakpoints
```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Grid Patterns
```tsx
/* Light & Dark Mode */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>

<div className="grid grid-cols-12 gap-6">
  <div className="col-span-12 lg:col-span-8">{/* Main content */}</div>
  <div className="col-span-12 lg:col-span-4">{/* Sidebar */}</div>
</div>
```

---

## 🔤 Spacing Scale

### Consistent Spacing
```css
/* Light Mode */
Card padding: p-6 (24px)
Section margin: mb-8 (32px)
Element gap: gap-4 (16px)
Border radius: rounded-3xl (24px), rounded-xl (12px)

/* Dark Mode */
Card padding: p-6 to p-8 (24-32px)
Section margin: mb-8 (32px)
Element gap: gap-4 to gap-6 (16-24px)
Border radius: rounded-3xl (24px), rounded-2xl (16px), rounded-xl (12px)
```

---

## 🎯 Icons

### Light Mode
- **Icon Set**: Material Icons Round
- **Size**: text-sm (16px), text-lg (18px)
- **Colors**: Match parent or use accent colors

### Dark Mode
- **Icon Set**: Material Icons Round
- **Size**: text-sm to text-lg (16-20px)
- **Colors**: White, violet-500, cyan-500, with glow effects
- **Style**: Often combined with gradient backgrounds or neon shadows

---

## 🎨 Category Color System

### Both Modes
```tsx
const categoryColors = {
  mindset: {
    light: 'bg-purple-100 text-purple-600',
    dark: 'bg-purple-900/30 text-purple-300'
  },
  health: {
    light: 'bg-pink-100 text-pink-600',
    dark: 'bg-pink-900/30 text-pink-300'
  },
  study: {
    light: 'bg-blue-100 text-blue-600',
    dark: 'bg-blue-900/30 text-blue-300'
  },
  career: {
    light: 'bg-green-100 text-green-600',
    dark: 'bg-green-900/30 text-green-300'
  },
  wellness: {
    light: 'bg-indigo-100 text-indigo-600',
    dark: 'bg-indigo-900/30 text-indigo-300'
  },
  finance: {
    light: 'bg-emerald-100 text-emerald-600',
    dark: 'bg-emerald-900/30 text-emerald-300'
  }
}
```

---

## 📋 Usage Guidelines

### When to Use Light Mode
- Daytime work sessions
- Reading-heavy content
- Professional environments
- Users who prefer high contrast

### When to Use Dark Mode
- Evening/night work sessions
- Reducing eye strain
- Immersive focus sessions
- Power users and developers

### Implementation Checklist
For each page, ensure:
- ✅ Light mode uses: slate colors, white cards, subtle shadows, rounded-3xl
- ✅ Dark mode uses: deep space bg, glass effects, neon glows, gradient accents
- ✅ Typography changes between Plus Jakarta Sans (light) and Space Grotesk/Inter (dark)
- ✅ Buttons have appropriate styles for each theme
- ✅ Hover states are distinct and smooth
- ✅ Icons match theme aesthetic
- ✅ Spacing is consistent
- ✅ Mobile responsiveness works in both themes
- ✅ Transitions are smooth (200-300ms)
- ✅ Colors follow the established palette

---

## 🚀 Quick Reference

### Light Mode Class Patterns
```css
bg-slate-50         /* Page background */
bg-white            /* Card background */
bg-slate-700        /* Sidebar */
text-slate-800      /* Primary text */
text-slate-500      /* Secondary text */
border-slate-200    /* Borders */
rounded-3xl         /* Card radius */
shadow-sm           /* Card shadow */
hover:shadow-md     /* Hover shadow */
```

### Dark Mode Class Patterns
```css
bg-[#0a0a0f]              /* Page background */
bg-white/[0.03]           /* Card background */
backdrop-blur-xl          /* Glass effect */
bg-[#16161f]              /* Sidebar */
text-white                /* Primary text */
text-zinc-400             /* Secondary text */
border-white/10           /* Borders */
rounded-3xl               /* Card radius */
shadow-neon               /* Card glow */
hover:border-white/20     /* Hover border */
font-display              /* Space Grotesk */
tracking-tighter          /* Tight spacing */
```
