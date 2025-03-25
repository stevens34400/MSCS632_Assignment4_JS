import React, { useState, useEffect } from 'react';
import EmployeeInput from './EmployeeInput';
import ScheduleOutput from './ScheduleOutput';
import { generateSchedule, saveEmployees, loadEmployees, loadSchedule } from '../scheduleLogic';
import './Scheduler.css';

function Scheduler() {
  const [employees, setEmployees] = useState([]);
  const [schedule, setSchedule] = useState(null);

  // Load saved data on component mount
  useEffect(() => {
    const savedEmployees = loadEmployees();
    const savedSchedule = loadSchedule();
    
    if (savedEmployees) {
      setEmployees(savedEmployees);
    }
    if (savedSchedule) {
      setSchedule(savedSchedule);
    }
  }, []);

  const handleAddEmployee = (employee) => {
    const updatedEmployees = [...employees, employee];
    setEmployees(updatedEmployees);
    saveEmployees(updatedEmployees);
  };

  const handleGenerateSchedule = () => {
    if (employees.length === 0) {
      alert('Please add at least one employee before generating the schedule.');
      return;
    }
    const generatedSchedule = generateSchedule(employees);
    setSchedule(generatedSchedule);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This will remove all employees and the schedule.')) {
      setEmployees([]);
      setSchedule(null);
      saveEmployees([]);
      localStorage.removeItem('employeeSchedule');
    }
  };

  return (
    <div className="scheduler">
      <div className="scheduler-header">
        <h1>Employee Scheduler</h1>
        <p>Add employees and their shift preferences, then generate the weekly schedule.</p>
      </div>

      <div className="scheduler-content">
        <div className="employee-section">
          <div className="employee-list">
            <h3>Current Employees ({employees.length})</h3>
            {employees.length > 0 ? (
              <ul>
                {employees.map((emp, index) => (
                  <li key={index}>{emp.name}</li>
                ))}
              </ul>
            ) : (
              <p className="no-employees">No employees added yet</p>
            )}
          </div>
          
          <EmployeeInput onAddEmployee={handleAddEmployee} />
        </div>

        <div className="schedule-section">
          <div className="schedule-actions">
            <button 
              className="generate-button"
              onClick={handleGenerateSchedule}
              disabled={employees.length === 0}
            >
              Generate Schedule
            </button>
            <button 
              className="clear-button"
              onClick={handleClearData}
              disabled={employees.length === 0 && !schedule}
            >
              Clear All Data
            </button>
          </div>

          {schedule && <ScheduleOutput schedule={schedule} />}
        </div>
      </div>
    </div>
  );
}

export default Scheduler;
