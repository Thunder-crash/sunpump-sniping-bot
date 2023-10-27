const fs = require('fs');
const path = require('path');

function logEvent(eventType, message) {
  const logFilePath = path.join(__dirname, 'masterLog.txt');

  // Get the current date and time for the log entry
  const timestamp = new Date().toISOString();

  // Create the log message
  const logMessage = `[${timestamp}] ${eventType}: ${message}\n`;

  // Append the log message to the log file
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('Error appending to master log:', err);
    }
  });
}

module.exports = {
  logEvent,
};
