'use client';

import { useState, useEffect } from 'react';
import { Quote as QuoteType, Weather } from '@/lib/types';
import { CloudSun, Quote as QuoteIcon, MapPin, Zap, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const QUOTES: QuoteType[] = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It's not about being the best. It's about being better than you were yesterday.", author: "Unknown" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { text: "We are what we repeatedly do. Excellence is not an act, but a habit.", author: "Aristotle" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The difference between ordinary and extraordinary is that little extra.", author: "Jimmy Johnson" },
  { text: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" },
];

export default function DailyInsights() {
  const [quote, setQuote] = useState<QuoteType>(QUOTES[0]);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Get random quote based on date
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    setQuote(QUOTES[dayOfYear % QUOTES.length]);

    // Set greeting based on time
    const hour = today.getHours();
    if (hour < 12) setGreeting('Good morning, Operator');
    else if (hour < 17) setGreeting('Good afternoon, Operator');
    else setGreeting('Good evening, Operator');

    // Fetch weather (using free API)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
          );
          const data = await res.json();
          if (data.current_weather) {
            const temp = Math.round(data.current_weather.temperature);
            const code = data.current_weather.weathercode;
            let condition = 'Clear';
            let icon = '☀️';
            
            if (code >= 0 && code <= 3) { condition = 'Clear Sky'; icon = '☀️'; }
            else if (code >= 45 && code <= 48) { condition = 'Fog Overlay'; icon = '🌫️'; }
            else if (code >= 51 && code <= 67) { condition = 'Rain Detected'; icon = '🌧️'; }
            else if (code >= 71 && code <= 77) { condition = 'Snow Alert'; icon = '❄️'; }
            else if (code >= 80 && code <= 82) { condition = 'Showers'; icon = '🌦️'; }
            else if (code >= 95) { condition = 'Storm Front'; icon = '⛈️'; }

            setWeather({ temp, condition, icon });
          }
        } catch (error) {
          console.error('Weather fetch failed:', error);
        }
      });
    }
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-zinc-900/50 border border-zinc-800 backdrop-blur-md rounded-2xl p-6 mb-8 relative overflow-hidden group"
    >
      {/* Decorative pulse line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-white tracking-tight">{greeting}</h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-mono uppercase tracking-widest">
              Online
            </span>
          </div>
          <p className="text-sm text-zinc-400 font-mono uppercase tracking-widest flex items-center gap-2">
            <Zap size={12} className="text-yellow-500" />
            System Status: Nominal
          </p>
        </div>

        <div className="flex items-center gap-4">
          {weather && (
            <div className="flex items-center gap-3 bg-zinc-950/50 px-4 py-2 rounded-xl border border-zinc-800">
              <span className="text-2xl">{weather.icon}</span>
              <div className="text-right">
                <div className="font-bold text-white font-mono">{weather.temp}°</div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest">{weather.condition}</div>
              </div>
            </div>
          )}
          
          <div className="bg-zinc-950/50 rounded-xl px-4 py-2 border border-zinc-800 flex flex-col justify-center min-w-[120px]">
             <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 flex items-center justify-between">
                Date <RefreshCw size={10} className="hover:rotate-180 transition-transform cursor-pointer" />
             </div>
             <div className="text-sm font-bold text-zinc-200">
               {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}
             </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-gradient-to-r from-zinc-800/50 to-transparent rounded-xl p-4 border-l-2 border-emerald-500">
        <div className="flex items-start gap-4">
          <QuoteIcon size={20} className="text-zinc-600 flex-shrink-0 mt-1" />
          <div>
            <p className="text-zinc-300 italic mb-2 tracking-wide font-light">"{quote.text}"</p>
            <p className="text-xs text-emerald-500 font-bold uppercase tracking-widest">— {quote.author}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
