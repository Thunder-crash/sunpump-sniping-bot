const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { appendToTerminal } = require('./terminalMonitor.js');
const { runPythonScript } = require('./pythonExecutor.js');
const masterLog = require('./masterLog.js');
const { ipcRenderer } = require('electron');

// Path to the file where script paths will be stored
const scriptPathsFilePath = path.join(__dirname, 'scriptPaths.txt');

// Function to load saved script paths from the file and populate the dropdown
function loadSavedScripts() {
  fs.readFile(scriptPathsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading script paths from file:', err);
      return;
    }

    const scriptPaths = data.split('\n');
    const dropdown = document.getElementById('script-dropdown');

    scriptPaths.forEach((scriptPath) => {
      if (scriptPath.trim() === '') return;

      const option = document.createElement('option');
      option.text = scriptPath;
      option.value = scriptPath;
      dropdown.add(option);
    });
  });
}

loadSavedScripts();

// Display success messages
function displaySuccessMessage(message) {
  const messageBox = document.getElementById('message-box');
  messageBox.textContent = message;

  setTimeout(() => {
    messageBox.textContent = '';
  }, 3000); // 3000 milliseconds (3 seconds)
}

document.getElementById('open-monaco-button').addEventListener('click', function () {
  window.open('monaco.html', '_blank');
});

// Inside your event listener
document.getElementById('add-script-button').addEventListener('click', () => {
  const scriptPathInput = document.getElementById('script-path');
  const scriptPath = scriptPathInput.value;

  // Check if a script path was entered
  if (scriptPath.trim() === '') {
    alert('Please enter a valid script path.');
    return;
  }

  // Check if the script file exists at the given path
  if (!fs.existsSync(scriptPath)) {
    alert('The script file does not exist at the given path.');
    return;
  }

  // Append the script path to the file
  fs.appendFile(scriptPathsFilePath, scriptPath + '\n', (err) => {
    if (err) {
      console.error('Error appending script path to file:', err);
      return;
    }
    console.log('Script path appended to file successfully.');

    // Add the script path to the dropdown list
    const dropdown = document.getElementById('script-dropdown');
    const option = document.createElement('option');
    option.text = scriptPath;
    option.value = scriptPath;
    dropdown.add(option);

    masterLog.logEvent('Script Added', 'ScriptPath: ' + scriptPath);

    // Display a success message
    displaySuccessMessage('Script Added Successfully');
  });

  // Clear the input field after processing
  scriptPathInput.value = '';
});

// Inside your event listener for the "Delete Script" button
document.getElementById('delete-button').addEventListener('click', () => {
  const dropdown = document.getElementById('script-dropdown');

  // Get the selected script path
  const selectedScriptPath = dropdown.options[dropdown.selectedIndex].value;

  // Get all script paths from the file
  fs.readFile(scriptPathsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading script paths from file:', err);
      return;
    }

    // Remove the selected script path
    const scriptPaths = data.split('\n').filter((path) => path !== selectedScriptPath);

    // Write the remaining script paths back to the file
    fs.writeFile(scriptPathsFilePath, scriptPaths.join('\n'), (err) => {
      if (err) {
        console.error('Error writing script paths to file:', err);
        return;
      }
      console.log('Script path removed from file successfully.');

      // Remove the selected script path from the dropdown list
      dropdown.remove(dropdown.selectedIndex);

      masterLog.logEvent('Script Deleted', 'ScriptPath: ' + selectedScriptPath);

      // Display a success message
      displaySuccessMessage('Script Deleted Successfully');
    });
  });
})


// Add a click event listener to the button
document.getElementById('openFileButton').addEventListener('click', () => {
  // Open the native file explorer
  exec('explorer.exe');
});

