const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { appendToTerminal } = require('./terminalMonitor.js');


// Function to run a Python script
function runPythonScript(callback) {
  // You may want to customize the Python command based on your environment
  const pythonCommand = 'python';

  // Get the selected script from the dropdown
  const dropdown = document.getElementById('script-dropdown');
  const selectedScript = dropdown.options[dropdown.selectedIndex].value;

  // Check if a script is selected
  if (!selectedScript) {
    callback('No script selected', null);
    return;
  }

  // Execute the Python script
  exec(`${pythonCommand} "${selectedScript}"`, (error, stdout, stderr) => {
    if (error) {
      callback(error, null);
      return;
    }
    callback(null, stdout);
  });
}

// Event listener to run Python script on button click
document.getElementById('run-python').addEventListener('click', () => {
  runPythonScript((error, output) => {
    if (error) {
      appendToTerminal(`Error: ${error}`);
      return;
    }
    appendToTerminal(output);
  });
});

// Function to load saved script paths into the dropdown
function loadSavedScripts() {
  const scriptPathsFilePath = path.join(__dirname, 'scriptPaths.txt');

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

