import React from 'react';
import { DAYS_OF_WEEK, SHIFTS } from '../scheduleLogic';
import './ScheduleOutput.css';

function ScheduleOutput({ schedule }) {
  if (!schedule) return null;

  return (
    <div className="schedule-output">
      <h2>Weekly Schedule</h2>
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
              <div key={`${day}-${shift}`} className="schedule-cell">
                {schedule[day][shift].map((employee, index) => (
                  <div key={`${day}-${shift}-${employee}`} className="employee-name">
                    {employee}
                    {index < schedule[day][shift].length - 1 ? ',' : ''}
                  </div>
                ))}
                {schedule[day][shift].length === 0 && (
                  <div className="no-employee">No assignment</div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ScheduleOutput;
