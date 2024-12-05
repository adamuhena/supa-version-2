import { SkipBack, SkipForward } from 'lucide-react';
import React, { useState } from 'react';

export default function Calendar() {
  // Get the current date, month, and year
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // State for current month
  const [currentYear, setCurrentYear] = useState(today.getFullYear()); // State for current year
  const currentDate = today.getDate();

  // Generate the first day of the month and the number of days in the month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  // Generate an array of days in the month
  const days = [...Array(daysInMonth)].map((_, i) => i + 1);

  // Determine which day of the week the month starts on
  const startDay = firstDayOfMonth.getDay();

  // Handlers for navigating to the previous or next month
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11); // December
      setCurrentYear(currentYear - 1); // Decrease year
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0); // January
      setCurrentYear(currentYear + 1); // Increase year
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
     //bg-gray-300 rounded-lg hover:bg-gray-400
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="text-center">
        <div className="flex justify-between items-center mb-4">
        <SkipBack color="#10b981" onClick={goToPreviousMonth}
            />
          <p className="text-md font-medium text-emerald-500">
            {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}
          </p>
        <SkipForward color="#10b981" onClick={goToNextMonth}
          />
        </div>
        <div className="grid grid-cols-7 gap-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-xs font-small text-gray-500">{day}</div>
          ))}
          {/* Empty cells for the previous month's remaining days */}
          {[...Array(startDay)].map((_, i) => (
            <div key={i} className="text-sm"></div>
          ))}
          {/* Display the days of the current month */}
          {days.map(day => (
            <div
              key={day}
              className={`text-sm text-center p-1 rounded-lg ${
                day === currentDate ? 'bg-emerald-200' : 'text-gray-700'
              }`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
