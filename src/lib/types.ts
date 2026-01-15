export interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  target: number;
  color: string;
  category: 'morning' | 'afternoon' | 'evening' | 'anytime';
  time?: string;
  icon?: string;
  completedDates: string[];
  skippedDates?: { date: string; reason: string }[];
  notes?: { date: string; note: string; mood?: number }[];
  linkedHabitId?: string; // For habit stacking
  order?: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  dueTime?: string;
  category: string;
  tags: string[];
  assignee?: string;
  subtasks: { id: string; title: string; completed: boolean }[];
  recurring?: 'daily' | 'weekly' | 'monthly';
  createdAt: string;
  completedAt?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  progress: number;
  category: string;
  deadline?: string;
  team: string[];
  tasks: string[]; // Task IDs
  createdAt: string;
}

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  tags: string[];
  notes?: string;
  linkedin?: string;
  github?: string;
  isFavorite: boolean;
  lastContact?: string;
  createdAt: string;
}

export interface Workout {
  id: string;
  date: string;
  type: string;
  duration: number; // minutes
  calories?: number;
  exercises: {
    name: string;
    sets: { weight: number; reps: number }[];
  }[];
  notes?: string;
}

export interface StudySession {
  id: string;
  date: string;
  subject: string;
  topic: string;
  duration: number; // minutes
  type: 'pomodoro' | 'deep-work' | 'review';
  notes?: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  isRecurring: boolean;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
}

export interface Quote {
  text: string;
  author: string;
}

export interface Weather {
  temp: number;
  condition: string;
  icon: string;
}
