import React, { useState, useEffect } from 'react';

const Calendar = ({ 
  compact = false, 
  darkMode = true, 
  events = [],
  onDateSelect,
  selectedDate = null 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [today] = useState(new Date());

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const generateCalendarDays = () => {
    const daysArray = [];
    
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      daysArray.push({
        date: new Date(currentYear, currentMonth - 1, daysInPrevMonth - i),
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      daysArray.push({
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString()
      });
    }
    
    const totalCells = 42; 
    const nextMonthDays = totalCells - daysArray.length;
    for (let i = 1; i <= nextMonthDays; i++) {
      daysArray.push({
        date: new Date(currentYear, currentMonth + 1, i),
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    return daysArray;
  };

  const calendarDays = generateCalendarDays();

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  
  const hasEvents = (date) => {
    return getEventsForDate(date).length > 0;
  };

  const isDateSelected = (date) => {
    if (!selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const handleDateClick = (date) => {
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  const getEventColor = (type) => {
    const colors = {
      important: 'bg-red-500',
      reminder: 'bg-blue-500',
      personal: 'bg-green-500',
      work: 'bg-purple-500',
      deadline: 'bg-orange-500',
      note: 'bg-cyan-500',
      default: 'bg-gray-500'
    };
    return colors[type] || colors.default;
  };

  return (
    <div className={`rounded-2xl shadow-xl border backdrop-blur-sm transition-all ${
      compact ? 'p-4' : 'p-6'
    } ${
      darkMode 
        ? 'bg-gray-800/90 border-gray-700 text-white' 
        : 'bg-white border-gray-200 text-gray-900'
    }`}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousMonth}
          className={`p-2 rounded-lg transition-all hover:scale-105 ${
            darkMode 
              ? 'hover:bg-gray-700 text-gray-300' 
              : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="flex items-center gap-4">
          <h2 className={`text-xl font-bold text-center ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <button
            onClick={goToToday}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              darkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Today
          </button>
        </div>
        
        <button
          onClick={goToNextMonth}
          className={`p-2 rounded-lg transition-all hover:scale-105 ${
            darkMode 
              ? 'hover:bg-gray-700 text-gray-300' 
              : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map(day => (
          <div 
            key={day} 
            className={`text-center text-sm font-semibold py-2 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((dayInfo, index) => {
          const dayEvents = getEventsForDate(dayInfo.date);
          const isSelected = isDateSelected(dayInfo.date);
          const hasEventsOnDay = hasEvents(dayInfo.date);
          
          return (
            <button
              key={index}
              onClick={() => handleDateClick(dayInfo.date)}
              className={`
                relative p-2 rounded-lg transition-all duration-200 min-h-[3rem]
                flex flex-col items-center justify-start
                ${isSelected 
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg scale-105' 
                  : dayInfo.isToday
                    ? darkMode 
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                      : 'bg-blue-100 text-blue-600 border border-blue-300'
                    : hasEventsOnDay && dayInfo.isCurrentMonth
                      ? darkMode 
                        ? 'bg-yellow-600/20 text-yellow-300 border border-yellow-500/30' 
                        : 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                    : !dayInfo.isCurrentMonth
                      ? darkMode 
                        ? 'text-gray-600 hover:bg-gray-700/30' 
                        : 'text-gray-400 hover:bg-gray-100'
                      : darkMode 
                        ? 'text-gray-200 hover:bg-gray-700/50 hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }
                ${onDateSelect ? 'cursor-pointer hover:scale-105' : 'cursor-default'}
              `}
            >
              {/* Date number */}
              <span className={`text-sm font-medium ${
                !dayInfo.isCurrentMonth ? 'opacity-40' : ''
              }`}>
                {dayInfo.date.getDate()}
              </span>

              {/* Event indicators */}
              {dayEvents.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-center mt-1">
                  {dayEvents.slice(0, compact ? 2 : 3).map((event, idx) => (
                    <div
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full ${getEventColor(event.type)}`}
                    />
                  ))}
                  {dayEvents.length > (compact ? 2 : 3) && (
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      +{dayEvents.length - (compact ? 2 : 3)}
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Events summary */}
      {!compact && events.length > 0 && (
        <div className={`mt-6 pt-4 border-t ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-3 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Upcoming Reminders
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {events
              .filter(event => new Date(event.date) >= new Date().setHours(0,0,0,0))
              .slice(0, 5)
              .map((event, index) => (
                <div 
                  key={index} 
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all hover:scale-[1.02] ${
                    darkMode ? 'bg-gray-700/30 hover:bg-gray-700/50' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${getEventColor(event.type)}`} />
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium truncate ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {event.title}
                    </div>
                    <div className={`text-xs ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {new Date(event.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                      {event.time && ` • ${event.time}`}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Legend */}
      {!compact && events.length > 0 && (
        <div className={`mt-4 pt-3 border-t ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h4 className={`text-sm font-semibold mb-2 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Legend
          </h4>
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Important</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Reminder</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Has Events</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;