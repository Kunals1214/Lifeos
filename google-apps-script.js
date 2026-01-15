// LifeOS Google Apps Script - Complete Backend
// Deploy this as a Web App with "Execute as: Me" and "Who has access: Anyone"

// OPTION 1: Set to empty string "" to disable auth, or set password
const APP_PASSWORD = ""; // Set to "" to disable password check

function checkAuth(e) {
  // If no password required, skip check
  if (!APP_PASSWORD) return;
  
  // Check header or parameter
  const token = e.parameter.auth || (e.postData && JSON.parse(e.postData.contents).auth);
  if (token !== APP_PASSWORD) {
    throw new Error('Unauthorized');
  }
}

function doGet(e) {
  try {
    checkAuth(e);
    const action = e.parameter.action;
    
    switch(action) {
      case 'getHabits': return success(getHabits());
      case 'getEvents': return success(getEvents(e.parameter.start, e.parameter.end));
      case 'getTasks': return success(getTasks());
      case 'getProjects': return success(getProjects());
      case 'getContacts': return success(getContacts());
      case 'getWorkouts': return success(getWorkouts());
      case 'getStudySessions': return success(getStudySessions());
      case 'getFinance': return success(getFinance());
      case 'syncAll': return syncAllData();
      default: return error('Invalid action');
    }
  } catch (err) {
    return error(err.toString());
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    checkAuth({ parameter: {}, postData: e.postData }); // Re-use check
    
    const action = data.action;
    
    switch(action) {
      // Habits
      case 'addHabit': return success(addHabit(data.habit));
      case 'logCompletion': return success(logCompletion(data.habitId, data.date));
      case 'removeCompletion': return success(removeCompletion(data.habitId, data.date));
      case 'deleteHabit': return success(deleteHabit(data.habitId));
      
      // Tasks
      case 'addTask': return success(addTask(data.task));
      case 'updateTask': return success(updateTask(data.task));
      case 'deleteTask': return success(deleteTask(data.taskId));
      
      // Projects
      case 'addProject': return success(addProject(data.project));
      case 'updateProject': return success(updateProject(data.project));
      case 'deleteProject': return success(deleteProject(data.projectId));
      
      // Contacts
      case 'addContact': return success(addContact(data.contact));
      case 'updateContact': return success(updateContact(data.contact));
      case 'deleteContact': return success(deleteContact(data.contactId));
      
      // Workouts
      case 'logWorkout': return success(logWorkout(data.workout));
      
      // Study
      case 'logStudySession': return success(logStudySession(data.session));
      
      // Finance
      case 'addTransaction': return success(addTransaction(data.transaction));
      
      // Bulk sync
      case 'syncData': return syncData(data);
      
      default: return error('Invalid action');
    }
  } catch (err) {
    return error(err.toString());
  }
}

function error(msg) {
  return ContentService.createTextOutput(JSON.stringify({ error: msg, success: false })).setMimeType(ContentService.MimeType.JSON);
}

function success(data) {
  return ContentService.createTextOutput(JSON.stringify(data || { success: true })).setMimeType(ContentService.MimeType.JSON);
}

// ===== SETUP =====
function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Create all required sheets with headers
  const sheets = {
    'Habits': ['id', 'name', 'description', 'frequency', 'target', 'color', 'category', 'time', 'createdAt'],
    'HabitLogs': ['habitId', 'date', 'timestamp'],
    'Tasks': ['id', 'title', 'description', 'status', 'priority', 'dueDate', 'dueTime', 'category', 'tags', 'subtasks', 'createdAt', 'completedAt'],
    'Projects': ['id', 'name', 'description', 'status', 'progress', 'category', 'deadline', 'team', 'tasks', 'createdAt'],
    'Contacts': ['id', 'name', 'email', 'phone', 'company', 'position', 'tags', 'notes', 'linkedin', 'github', 'isFavorite', 'lastContact', 'createdAt'],
    'Workouts': ['id', 'date', 'type', 'duration', 'calories', 'exercises', 'notes'],
    'StudySessions': ['id', 'date', 'subject', 'topic', 'duration', 'type', 'notes'],
    'Finance': ['id', 'date', 'type', 'category', 'amount', 'description', 'isRecurring']
  };
  
  Object.entries(sheets).forEach(([name, headers]) => {
    let sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    }
  });
  
  // Rename old Logs sheet if exists
  const oldLogs = ss.getSheetByName('Logs');
  if (oldLogs) {
    const data = oldLogs.getDataRange().getValues();
    const newLogs = ss.getSheetByName('HabitLogs');
    if (data.length > 1) {
      data.slice(1).forEach(row => {
        newLogs.appendRow([row[0], row[1], new Date().toISOString()]);
      });
    }
    ss.deleteSheet(oldLogs);
  }
  
  return success({ message: 'Sheets setup complete' });
}

// ===== HABITS =====
function getHabits() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const habitsSheet = ss.getSheetByName('Habits');
  const logsSheet = ss.getSheetByName('HabitLogs') || ss.getSheetByName('Logs');
  
  if (!habitsSheet) return success([]);
  
  const habitsData = habitsSheet.getDataRange().getValues();
  const logsData = logsSheet ? logsSheet.getDataRange().getValues() : [];
  
  const habits = habitsData.slice(1).filter(row => row[0]).map(row => ({
    id: row[0],
    name: row[1],
    description: row[2],
    frequency: row[3],
    target: row[4],
    color: row[5],
    category: row[6] || 'anytime',
    time: row[7] || '',
    completedDates: []
  }));
  
  logsData.slice(1).forEach(row => {
    const habit = habits.find(h => h.id === row[0]);
    if (habit && row[1]) habit.completedDates.push(row[1]);
  });
  
  return success(habits);
}

function addHabit(habit) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Habits');
  sheet.appendRow([
    habit.id, habit.name, habit.description, habit.frequency, 
    habit.target, habit.color, habit.category || 'anytime', 
    habit.time || '', new Date().toISOString()
  ]);
  return success();
}

function logCompletion(habitId, date) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('HabitLogs') || ss.getSheetByName('Logs');
  sheet.appendRow([habitId, date, new Date().toISOString()]);
  return success();
}

function removeCompletion(habitId, date) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('HabitLogs') || ss.getSheetByName('Logs');
  const data = sheet.getDataRange().getValues();
  
  for (let i = data.length - 1; i >= 1; i--) {
    if (data[i][0] === habitId && data[i][1] === date) {
      sheet.deleteRow(i + 1);
      break;
    }
  }
  return success();
}

function deleteHabit(habitId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Delete from Habits
  const habitsSheet = ss.getSheetByName('Habits');
  const habitsData = habitsSheet.getDataRange().getValues();
  for (let i = 1; i < habitsData.length; i++) {
    if (habitsData[i][0] === habitId) {
      habitsSheet.deleteRow(i + 1);
      break;
    }
  }
  
  // Delete from Logs
  const logsSheet = ss.getSheetByName('HabitLogs') || ss.getSheetByName('Logs');
  const logsData = logsSheet.getDataRange().getValues();
  for (let i = logsData.length - 1; i >= 1; i--) {
    if (logsData[i][0] === habitId) {
      logsSheet.deleteRow(i + 1);
    }
  }
  
  return success();
}

// ===== TASKS =====
function getTasks() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Tasks');
  if (!sheet) return success([]);
  
  const data = sheet.getDataRange().getValues();
  return success(data.slice(1).filter(row => row[0]).map(row => ({
    id: row[0],
    title: row[1],
    description: row[2],
    status: row[3],
    priority: row[4],
    dueDate: row[5],
    dueTime: row[6],
    category: row[7],
    tags: JSON.parse(row[8] || '[]'),
    subtasks: JSON.parse(row[9] || '[]'),
    createdAt: row[10],
    completedAt: row[11]
  })));
}

function addTask(task) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Tasks');
  sheet.appendRow([
    task.id, task.title, task.description || '', task.status,
    task.priority, task.dueDate || '', task.dueTime || '', 
    task.category || '', JSON.stringify(task.tags || []),
    JSON.stringify(task.subtasks || []), new Date().toISOString(), ''
  ]);
  return success();
}

function updateTask(task) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Tasks');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === task.id) {
      sheet.getRange(i + 1, 1, 1, 12).setValues([[
        task.id, task.title, task.description || '', task.status,
        task.priority, task.dueDate || '', task.dueTime || '',
        task.category || '', JSON.stringify(task.tags || []),
        JSON.stringify(task.subtasks || []), data[i][10],
        task.status === 'completed' ? new Date().toISOString() : ''
      ]]);
      break;
    }
  }
  return success();
}

function deleteTask(taskId) {
  return deleteRowById('Tasks', taskId);
}

// ===== PROJECTS =====
function getProjects() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Projects');
  if (!sheet) return success([]);
  
  const data = sheet.getDataRange().getValues();
  return success(data.slice(1).filter(row => row[0]).map(row => ({
    id: row[0],
    name: row[1],
    description: row[2],
    status: row[3],
    progress: row[4],
    category: row[5],
    deadline: row[6],
    team: JSON.parse(row[7] || '[]'),
    tasks: JSON.parse(row[8] || '[]'),
    createdAt: row[9]
  })));
}

function addProject(project) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Projects');
  sheet.appendRow([
    project.id, project.name, project.description || '', project.status,
    project.progress || 0, project.category || '', project.deadline || '',
    JSON.stringify(project.team || []), JSON.stringify(project.tasks || []),
    new Date().toISOString()
  ]);
  return success();
}

function updateProject(project) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Projects');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === project.id) {
      sheet.getRange(i + 1, 1, 1, 10).setValues([[
        project.id, project.name, project.description || '', project.status,
        project.progress || 0, project.category || '', project.deadline || '',
        JSON.stringify(project.team || []), JSON.stringify(project.tasks || []),
        data[i][9]
      ]]);
      break;
    }
  }
  return success();
}

function deleteProject(projectId) {
  return deleteRowById('Projects', projectId);
}

// ===== CONTACTS =====
function getContacts() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Contacts');
  if (!sheet) return success([]);
  
  const data = sheet.getDataRange().getValues();
  return success(data.slice(1).filter(row => row[0]).map(row => ({
    id: row[0],
    name: row[1],
    email: row[2],
    phone: row[3],
    company: row[4],
    position: row[5],
    tags: JSON.parse(row[6] || '[]'),
    notes: row[7],
    linkedin: row[8],
    github: row[9],
    isFavorite: row[10] === true || row[10] === 'true',
    lastContact: row[11],
    createdAt: row[12]
  })));
}

function addContact(contact) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Contacts');
  sheet.appendRow([
    contact.id, contact.name, contact.email || '', contact.phone || '',
    contact.company || '', contact.position || '', JSON.stringify(contact.tags || []),
    contact.notes || '', contact.linkedin || '', contact.github || '',
    contact.isFavorite || false, '', new Date().toISOString()
  ]);
  return success();
}

function updateContact(contact) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Contacts');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === contact.id) {
      sheet.getRange(i + 1, 1, 1, 13).setValues([[
        contact.id, contact.name, contact.email || '', contact.phone || '',
        contact.company || '', contact.position || '', JSON.stringify(contact.tags || []),
        contact.notes || '', contact.linkedin || '', contact.github || '',
        contact.isFavorite || false, contact.lastContact || '', data[i][12]
      ]]);
      break;
    }
  }
  return success();
}

function deleteContact(contactId) {
  return deleteRowById('Contacts', contactId);
}

// ===== WORKOUTS =====
function getWorkouts() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Workouts');
  if (!sheet) return success([]);
  
  const data = sheet.getDataRange().getValues();
  return success(data.slice(1).filter(row => row[0]).map(row => ({
    id: row[0],
    date: row[1],
    type: row[2],
    duration: row[3],
    calories: row[4],
    exercises: JSON.parse(row[5] || '[]'),
    notes: row[6]
  })));
}

function logWorkout(workout) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Workouts');
  sheet.appendRow([
    workout.id || Date.now().toString(), workout.date, workout.type,
    workout.duration, workout.calories || 0, JSON.stringify(workout.exercises || []),
    workout.notes || ''
  ]);
  return success();
}

// ===== STUDY SESSIONS =====
function getStudySessions() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('StudySessions');
  if (!sheet) return success([]);
  
  const data = sheet.getDataRange().getValues();
  return success(data.slice(1).filter(row => row[0]).map(row => ({
    id: row[0],
    date: row[1],
    subject: row[2],
    topic: row[3],
    duration: row[4],
    type: row[5],
    notes: row[6]
  })));
}

function logStudySession(session) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('StudySessions');
  sheet.appendRow([
    session.id || Date.now().toString(), session.date, session.subject,
    session.topic || '', session.duration, session.type || 'pomodoro',
    session.notes || ''
  ]);
  return success();
}

// ===== FINANCE =====
function getFinance() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Finance');
  if (!sheet) return success([]);
  
  const data = sheet.getDataRange().getValues();
  return success(data.slice(1).filter(row => row[0]).map(row => ({
    id: row[0],
    date: row[1],
    type: row[2],
    category: row[3],
    amount: row[4],
    description: row[5],
    isRecurring: row[6] === true || row[6] === 'true'
  })));
}

function addTransaction(transaction) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Finance');
  sheet.appendRow([
    transaction.id || Date.now().toString(), transaction.date, transaction.type,
    transaction.category, transaction.amount, transaction.description || '',
    transaction.isRecurring || false
  ]);
  return success();
}

// ===== CALENDAR =====
function getEvents(start, end) {
  try {
    const calendarId = 'primary';
    const events = CalendarApp.getCalendarById(calendarId).getEvents(new Date(start), new Date(end));
    
    return success(events.map(event => ({
      id: event.getId(),
      summary: event.getTitle(),
      start: { dateTime: event.getStartTime().toISOString() },
      end: { dateTime: event.getEndTime().toISOString() }
    })));
  } catch (e) {
    return success([]);
  }
}

// ===== BULK SYNC =====
function syncAllData() {
  return success({
    habits: JSON.parse(getHabits().getContent()),
    tasks: JSON.parse(getTasks().getContent()),
    projects: JSON.parse(getProjects().getContent()),
    contacts: JSON.parse(getContacts().getContent()),
    workouts: JSON.parse(getWorkouts().getContent()),
    studySessions: JSON.parse(getStudySessions().getContent()),
    finance: JSON.parse(getFinance().getContent())
  });
}

function syncData(data) {
  // Import data from client
  if (data.habits) {
    data.habits.forEach(h => addHabit(h));
  }
  if (data.tasks) {
    data.tasks.forEach(t => addTask(t));
  }
  if (data.projects) {
    data.projects.forEach(p => addProject(p));
  }
  if (data.contacts) {
    data.contacts.forEach(c => addContact(c));
  }
  return success({ message: 'Data synced successfully' });
}

// ===== HELPERS =====
function deleteRowById(sheetName, id) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return success();
  
  const data = sheet.getDataRange().getValues();
  for (let i = data.length - 1; i >= 1; i--) {
    if (data[i][0] === id) {
      sheet.deleteRow(i + 1);
      break;
    }
  }
  return success();
}
