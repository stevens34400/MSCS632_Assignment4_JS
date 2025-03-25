// Constants
export const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
export const SHIFTS = ["Morning", "Afternoon", "Evening"];
export const MAX_SHIFTS_PER_DAY = 1;
export const MIN_EMPLOYEES_PER_SHIFT = 2;
export const MAX_DAYS_PER_EMPLOYEE = 5;

// Save schedule to localStorage
export function saveSchedule(schedule) {
  localStorage.setItem('employeeSchedule', JSON.stringify(schedule));
}

// Load schedule from localStorage
export function loadSchedule() {
  const saved = localStorage.getItem('employeeSchedule');
  return saved ? JSON.parse(saved) : null;
}

// Save employees to localStorage
export function saveEmployees(employees) {
  localStorage.setItem('employees', JSON.stringify(employees));
}

// Load employees from localStorage
export function loadEmployees() {
  const saved = localStorage.getItem('employees');
  return saved ? JSON.parse(saved) : [];
}

export function generateSchedule(employees) {
  // Initialize schedule
  let schedule = {};
  DAYS_OF_WEEK.forEach(day => {
    schedule[day] = {};
    SHIFTS.forEach(shift => {
      schedule[day][shift] = [];
    });
  });

  // Track employee assignments
  let employeeDaysWorked = {};
  let employeeAssignedDays = {};
  employees.forEach(emp => {
    employeeDaysWorked[emp.name] = 0;
    employeeAssignedDays[emp.name] = new Set();
  });

  // First pass: Assign employees based on their primary preferences
  DAYS_OF_WEEK.forEach(day => {
    SHIFTS.forEach(shift => {
      const eligibleEmployees = employees.filter(emp => {
        const dayPrefs = emp.preferences[day];
        return (
          dayPrefs &&
          dayPrefs[0] === shift &&
          employeeDaysWorked[emp.name] < MAX_DAYS_PER_EMPLOYEE &&
          !employeeAssignedDays[emp.name].has(day)
        );
      });

      for (const emp of eligibleEmployees) {
        if (schedule[day][shift].length < MIN_EMPLOYEES_PER_SHIFT) {
          schedule[day][shift].push(emp.name);
          employeeDaysWorked[emp.name]++;
          employeeAssignedDays[emp.name].add(day);
        }
      }
    });
  });

  // Second pass: Fill remaining slots with secondary preferences
  DAYS_OF_WEEK.forEach(day => {
    SHIFTS.forEach(shift => {
      while (schedule[day][shift].length < MIN_EMPLOYEES_PER_SHIFT) {
        const availableEmployees = employees.filter(emp => {
          const dayPrefs = emp.preferences[day];
          return (
            employeeDaysWorked[emp.name] < MAX_DAYS_PER_EMPLOYEE &&
            !employeeAssignedDays[emp.name].has(day) &&
            dayPrefs &&
            dayPrefs.includes(shift)
          );
        });

        if (availableEmployees.length === 0) {
          // If no employees with this shift preference, pick any available employee
          const anyAvailable = employees.filter(emp =>
            employeeDaysWorked[emp.name] < MAX_DAYS_PER_EMPLOYEE &&
            !employeeAssignedDays[emp.name].has(day)
          );

          if (anyAvailable.length === 0) break;

          const randomEmp = anyAvailable[Math.floor(Math.random() * anyAvailable.length)];
          schedule[day][shift].push(randomEmp.name);
          employeeDaysWorked[randomEmp.name]++;
          employeeAssignedDays[randomEmp.name].add(day);
        } else {
          const selectedEmp = availableEmployees[0];
          schedule[day][shift].push(selectedEmp.name);
          employeeDaysWorked[selectedEmp.name]++;
          employeeAssignedDays[selectedEmp.name].add(day);
        }
      }
    });
  });

  // Save the generated schedule
  saveSchedule(schedule);
  return schedule;
}
  