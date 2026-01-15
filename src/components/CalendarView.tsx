'use client';

import { useState, useEffect } from 'react';
import { CalendarEvent } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { Calendar, Clock, MapPin, ChevronRight, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CalendarView() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const start = new Date().toISOString();
      const end = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // Next 7 days
      
      try {
        const res = await fetch(`/api/calendar?start=${start}&end=${end}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setEvents(data);
        }
      } catch (error) {
        console.error('Failed to fetch events', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return (
    <div className="w-full max-w-md mx-auto mt-6 bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-4" />
        <p className="text-zinc-500 text-xs uppercase tracking-widest animate-pulse">Syncing Calendar Data...</p>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto mt-6"
    >
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl flex justify-between items-center">
            <div>
                 <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={16} className="text-emerald-500" />
                    Command Schedule
                </h2>
                <div className="text-[10px] text-zinc-500 font-mono mt-1">
                    NEXT 7 DAYS OPERATION
                </div>
            </div>
            <div className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] text-emerald-400 font-mono">
                {events.length} EVENTS
            </div>
        </div>

        <div className="divide-y divide-zinc-800/50">
          {events.map((event, index) => (
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                key={event.id} 
                className="group p-4 hover:bg-zinc-800/50 transition-colors cursor-pointer flex items-start gap-4"
            >
              {/* Date Box */}
              <div className="flex-shrink-0 w-14 h-14 bg-zinc-950 rounded-xl border border-zinc-800 flex flex-col items-center justify-center group-hover:border-emerald-500/30 transition-colors">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  {event.start.dateTime ? format(parseISO(event.start.dateTime), 'MMM') : 'ALL'}
                </span>
                <span className="text-xl font-bold text-white">
                  {event.start.dateTime ? format(parseISO(event.start.dateTime), 'd') : 'DAY'}
                </span>
              </div>

              {/* Event Details */}
              <div className="flex-grow min-w-0">
                <h3 className="text-zinc-200 font-medium truncate group-hover:text-emerald-400 transition-colors text-sm mb-1">
                    {event.summary}
                </h3>
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                    <div className="flex items-center gap-1.5">
                        <Clock size={12} />
                        {event.start.dateTime 
                        ? `${format(parseISO(event.start.dateTime), 'HH:mm')} - ${format(parseISO(event.end.dateTime), 'HH:mm')}`
                        : 'All Day'}
                    </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                  <ChevronRight size={16} className="text-zinc-600" />
              </div>
            </motion.div>
          ))}
          
          {events.length === 0 && (
            <div className="text-center py-12">
                <Activity className="w-12 h-12 text-zinc-800 mx-auto mb-3" />
                <p className="text-zinc-500 text-sm">No scheduled operations</p>
                <p className="text-zinc-700 text-xs mt-1">Standby mode active</p>
            </div>
          )}
        </div>
        
        <div className="p-3 bg-zinc-950/50 text-center border-t border-zinc-800">
            <button className="text-[10px] text-zinc-500 hover:text-emerald-500 uppercase tracking-widest transition-colors">
                View Full Calendar Grid
            </button>
        </div>
      </div>
    </motion.div>
  );
}
