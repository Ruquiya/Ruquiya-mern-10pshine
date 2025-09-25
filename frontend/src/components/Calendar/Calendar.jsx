// Calendar.jsx
import React from 'react';

const Calendar = ({ compact = false, darkMode = true, events = [] }) => {
  const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const currentDate = new Date(2021, 9);
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const paddingDays = (firstDay + 6) % 7;

  const getEventsForDay = (day) => {
    return events.filter(event => event.date === day);
  };

  return (
    <div className={`bg-gradient-to-br rounded-2xl shadow-xl border backdrop-blur-sm theme-transition ${compact ? 'p-12' : 'p-24'} ${
      darkMode 
        ? 'from-gray-800/90 to-indigo-800/90 border-white/10' 
        : 'from-white to-blue-50 border-gray-200'
    }`}>
      <h2 className={`text-center font-bold mb-4 text-lg theme-transition ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>October 2021</h2>
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {days.map(day => (
          <div key={day} className={`font-semibold py-2 text-xs uppercase tracking-wider theme-transition ${
            darkMode ? 'text-gray-300' : 'text-gray-500'
          }`}>{day}</div>
        ))}
        {Array.from({ length: paddingDays }).map((_, i) => <div key={`pad-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayEvents = getEventsForDay(i + 1);
          return (
            <div key={i} className="relative">
              <div
                className={`p-2 rounded-lg transition-all duration-300 min-h-[40px] flex flex-col items-center justify-center ${
                  i + 1 === 15
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg scale-105'
                    : darkMode
                      ? 'text-gray-200 hover:bg-gray-700/50 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                {i + 1}
                {dayEvents.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {dayEvents.slice(0, 2).map((event, idx) => (
                      <div
                        key={idx}
                        className={`w-1.5 h-1.5 rounded-full ${
                          event.type === 'important' ? 'bg-red-400' : 
                          event.type === 'note' ? 'bg-blue-400' : 'bg-green-400'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {!compact && events.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <h3 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Today's Events
          </h3>
          <div className="space-y-2">
            {events.slice(0, 3).map((event, index) => (
              <div key={index} className={`flex items-center gap-2 p-2 rounded-lg ${
                darkMode ? 'bg-gray-700/30' : 'bg-gray-100'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  event.type === 'important' ? 'bg-red-400' : 
                  event.type === 'note' ? 'bg-blue-400' : 'bg-green-400'
                }`} />
                <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {event.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;