import React, { useState } from 'react';
import { DAYS_OF_WEEK, SHIFTS } from '../scheduleLogic';
import './EmployeeInput.css';

function EmployeeInput({ onAddEmployee }) {
  const [name, setName] = useState('');
  const [preferences, setPreferences] = useState(
    DAYS_OF_WEEK.reduce((acc, day) => ({ ...acc, [day]: [] }), {})
  );

  const handleShiftPriorityChange = (day, shift, checked) => {
    setPreferences(prev => {
      const dayPrefs = [...(prev[day] || [])];
      
      if (checked) {
        // Add shift if not already in preferences
        if (!dayPrefs.includes(shift)) {
          dayPrefs.push(shift);
        }
      } else {
        // Remove shift from preferences
        const index = dayPrefs.indexOf(shift);
        if (index > -1) {
          dayPrefs.splice(index, 1);
        }
      }

      return {
        ...prev,
        [day]: dayPrefs
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter an employee name');
      return;
    }

    // Validate that each day has at least one shift selected
    const invalidDays = DAYS_OF_WEEK.filter(day => preferences[day].length === 0);
    if (invalidDays.length > 0) {
      alert(`Please select at least one shift for: ${invalidDays.join(', ')}`);
      return;
    }

    const employee = { name, preferences };
    onAddEmployee(employee);
    
    // Reset form
    setName('');
    setPreferences(DAYS_OF_WEEK.reduce((acc, day) => ({ ...acc, [day]: [] }), {}));
  };

  return (
    <div className="employee-input">
      <h2>Add New Employee</h2>
      <form onSubmit={handleSubmit}>
        <div className="name-input">
          <label>
            Employee Name:
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)}
              placeholder="Enter employee name"
              required 
            />
          </label>
        </div>

        <div className="schedule-grid">
          <div className="day-headers">
            <div className="corner-cell"></div>
            {DAYS_OF_WEEK.map(day => (
              <div key={day} className="day-header">{day}</div>
            ))}
          </div>

          {SHIFTS.map(shift => (
            <div key={shift} className="shift-row">
              <div className="shift-label">{shift}</div>
              {DAYS_OF_WEEK.map(day => (
                <div key={`${day}-${shift}`} className="shift-cell">
                  <input
                    type="checkbox"
                    checked={preferences[day].includes(shift)}
                    onChange={(e) => handleShiftPriorityChange(day, shift, e.target.checked)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        <button type="submit" className="submit-button">Add Employee</button>
      </form>
    </div>
  );
}

export default EmployeeInput;
