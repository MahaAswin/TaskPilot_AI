import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORY_COLORS = {
  exam:      { dot: 'bg-rose-500',    text: 'text-rose-600',    badge: 'bg-rose-50 border-rose-200' },
  class:     { dot: 'bg-indigo-500',  text: 'text-indigo-600',  badge: 'bg-indigo-50 border-indigo-200' },
  deadline:  { dot: 'bg-amber-500',   text: 'text-amber-600',   badge: 'bg-amber-50 border-amber-200' },
  revision:  { dot: 'bg-emerald-500', text: 'text-emerald-600', badge: 'bg-emerald-50 border-emerald-200' },
  study:     { dot: 'bg-purple-500',  text: 'text-purple-600',  badge: 'bg-purple-50 border-purple-200' },
  milestone: { dot: 'bg-fuchsia-500', text: 'text-fuchsia-600', badge: 'bg-fuchsia-50 border-fuchsia-200' },
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export const CalendarUI = ({ events = [] }) => {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState(null);

  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth     = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  // Map events to their dates (day number)
  const eventsByDay = {};
  events.forEach(ev => {
    const d = new Date(ev.start);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!eventsByDay[day]) eventsByDay[day] = [];
      eventsByDay[day].push(ev);
    }
  });

  const selectedEvents = selectedDay ? (eventsByDay[selectedDay] || []) : [];

  const cells = [];
  for (let i = 0; i < firstDayOfMonth; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const isToday = (d) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div className="space-y-4 select-none">
      {/* Header navigation */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-800">{MONTHS[month]} {year}</h3>
        <div className="flex gap-1">
          <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 border border-slate-200 transition-colors cursor-pointer">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))}
            className="px-2.5 py-1 rounded-lg hover:bg-slate-100 text-[9px] font-black text-slate-500 border border-slate-200 transition-colors cursor-pointer">
            Today
          </button>
          <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 border border-slate-200 transition-colors cursor-pointer">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[9px] font-black uppercase tracking-wider text-slate-400 py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} />;
          const hasEvents = eventsByDay[day]?.length > 0;
          const evs = eventsByDay[day] || [];
          return (
            <motion.button
              key={day}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedDay(selectedDay === day ? null : day)}
              className={`relative aspect-square flex flex-col items-center justify-start pt-1.5 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                isToday(day)
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-glow'
                  : selectedDay === day
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  : 'bg-white border-slate-100 text-slate-700 hover:border-indigo-200 hover:bg-slate-50'
              }`}
            >
              <span>{day}</span>
              {hasEvents && (
                <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                  {evs.slice(0, 3).map((ev, i) => {
                    const cat = CATEGORY_COLORS[ev.category] || CATEGORY_COLORS.study;
                    return (
                      <span key={i}
                        className={`w-1 h-1 rounded-full ${cat.dot} ${isToday(day) ? 'opacity-80' : ''}`}
                      />
                    );
                  })}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Selected day events */}
      {selectedDay && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2 pt-2 border-t border-slate-100"
        >
          <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500">
            {MONTHS[month]} {selectedDay} — {selectedEvents.length} event{selectedEvents.length !== 1 ? 's' : ''}
          </span>
          {selectedEvents.length === 0 ? (
            <p className="text-[10px] text-slate-400 font-mono py-2 text-center">No events on this day.</p>
          ) : (
            selectedEvents.map((ev, idx) => {
              const cat = CATEGORY_COLORS[ev.category] || CATEGORY_COLORS.study;
              return (
                <div key={idx} className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[10px] font-bold ${cat.badge}`}>
                  <span className={`w-2 h-2 rounded-full ${cat.dot} shrink-0`} />
                  <span className={cat.text}>{ev.title}</span>
                  <span className="ml-auto text-[8px] font-mono text-slate-400 uppercase">{ev.category}</span>
                </div>
              );
            })
          )}
        </motion.div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
        {Object.entries(CATEGORY_COLORS).map(([cat, cls]) => (
          <div key={cat} className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${cls.dot}`} />
            <span className="text-[8px] font-bold text-slate-400 capitalize">{cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarUI;
