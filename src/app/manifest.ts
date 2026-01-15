import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Habit Dragon - Track Your Life',
    short_name: 'Habit Dragon',
    description: 'Track your habits, finances, and daily goals with gamification',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f0f23',
    theme_color: '#6366f1',
    orientation: 'portrait',
    categories: ['productivity', 'lifestyle', 'health'],
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
    screenshots: [],
    shortcuts: [
      {
        name: 'Add Habit',
        short_name: 'Add',
        description: 'Quickly add a new habit',
        url: '/?action=add',
      },
      {
        name: 'Finance Tracker',
        short_name: 'Finance',
        description: 'Track your expenses',
        url: '/finance',
      },
    ],
  };
}
