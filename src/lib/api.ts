import { Habit, Task, Project, Contact, Workout, StudySession, Transaction, CalendarEvent } from './types';

const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;

// Helper to get password from storage or env (client-side only for storage)
const getPassword = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('lifeos-password') || process.env.APP_PASSWORD || 'shinde1214';
  }
  return process.env.APP_PASSWORD || 'shinde1214';
};

export async function fetchDirect(action: string, method: 'GET' | 'POST' = 'GET', data?: any) {
  // Direct call to Google Apps Script (Server-side only or if configured)
  const scriptUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || process.env.APPS_SCRIPT_URL;
  if (!scriptUrl) {
      console.error('API URL missing');
      return null;
  }
  
  const password = getPassword();

  try {
    const url = new URL(scriptUrl);
    url.searchParams.append('action', action);
    
    // Auth for GET
    if (method === 'GET') {
      url.searchParams.append('auth', password);
      if (data) {
        Object.entries(data).forEach(([key, value]) => {
          url.searchParams.append(key, String(value));
        });
      }
    }

    const options: RequestInit = {
      method,
      cache: 'no-store', 
    };

    if (method === 'POST') {
      options.body = JSON.stringify({ ...data, action, auth: password });
      options.headers = {
        'Content-Type': 'text/plain;charset=utf-8',
      };
    }

    const res = await fetch(url.toString(), options);
    const json = await res.json();
    
    if (json.error) {
      throw new Error(json.error);
    }
    
    return json;
  } catch (error) {
    console.error(`API Error (${action}):`, error);
    throw error;
  }
}

async function fetchProxy(action: string, method: 'GET' | 'POST' = 'GET', data?: any) {
  // Proxy call through Next.js API (Client-side)
  let url = `/api/proxy?action=${action}`;
  const options: RequestInit = { method };

  if (method === 'GET' && data) {
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
       params.append(key, String(value));
    });
    url += `&${params.toString()}`;
  } else if (method === 'POST') {
     options.body = JSON.stringify({ ...data, action }); // Action handled in body for POST
     options.headers = { 'Content-Type': 'application/json' };
  }

  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`Proxy error: ${res.statusText}`);
  return res.json();
}

export async function fetchFromSheet(action: string, method: 'GET' | 'POST' = 'GET', data?: any) {
  if (typeof window !== 'undefined') {
    return fetchProxy(action, method, data);
  }
  return fetchDirect(action, method, data);
}

// ===== API WRAPPER =====
export const api = {
  habits: {
    list: () => fetchFromSheet('getHabits'),
    add: (habit: Habit) => fetchFromSheet('addHabit', 'POST', { habit }),
    update: (habit: Habit) => fetchFromSheet('updateHabit', 'POST', { habit }),
    delete: (habitId: string) => fetchFromSheet('deleteHabit', 'POST', { habitId }),
    log: (habitId: string, date: string) => fetchFromSheet('logCompletion', 'POST', { habitId, date }),
    unlog: (habitId: string, date: string) => fetchFromSheet('removeCompletion', 'POST', { habitId, date }),
  },
  
  tasks: {
    list: () => fetchFromSheet('getTasks'),
    add: (task: Task) => fetchFromSheet('addTask', 'POST', { task }),
    update: (task: Task) => fetchFromSheet('updateTask', 'POST', { task }),
    delete: (taskId: string) => fetchFromSheet('deleteTask', 'POST', { taskId }),
  },

  projects: {
    list: () => fetchFromSheet('getProjects'),
    add: (project: Project) => fetchFromSheet('addProject', 'POST', { project }),
    update: (project: Project) => fetchFromSheet('updateProject', 'POST', { project }),
    delete: (projectId: string) => fetchFromSheet('deleteProject', 'POST', { projectId }),
  },

  finance: {
    list: () => fetchFromSheet('getFinance'),
    add: (transaction: Transaction) => fetchFromSheet('addTransaction', 'POST', { transaction }),
  },

  workout: {
    list: () => fetchFromSheet('getWorkouts'),
    log: (workout: Workout) => fetchFromSheet('logWorkout', 'POST', { workout }),
  },

  study: {
    list: () => fetchFromSheet('getStudySessions'),
    log: (session: StudySession) => fetchFromSheet('logStudySession', 'POST', { session }),
  },

  contacts: {
    list: () => fetchFromSheet('getContacts'),
    add: (contact: Contact) => fetchFromSheet('addContact', 'POST', { contact }),
    update: (contact: Contact) => fetchFromSheet('updateContact', 'POST', { contact }),
    delete: (contactId: string) => fetchFromSheet('deleteContact', 'POST', { contactId }),
  },
  
  getCalendarEvents: async (start: string, end: string) => {
    return fetchFromSheet('getEvents', 'GET', { start, end });
  }
};
