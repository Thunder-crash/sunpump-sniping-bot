import * as fs from 'fs';

// Function to append code to pythonExecutor.js
function appendCodeToPythonExecutor() {
  // Path to the pythonExecutor.js file
  const pythonExecutorFilePath = './pythonExecutor.js';

  if (!fs.existsSync(pythonExecutorFilePath)) {
    console.error('The pythonExecutor.js file does not exist.');
    return;
  }
  

  // Sample code snippet to append
  const codeToAppend = `
    // This is a sample dynamically generated code
    console.log('Hello from the generated code!');
  `;

  // Append the generated code to pythonExecutor.js
  fs.appendFile(pythonExecutorFilePath, codeToAppend, (err) => {
    if (err) {
      console.error('Error appending code to pythonExecutor.js:', err);
      return;
    }
    console.log('Code appended to pythonExecutor.js successfully.');
  });
}

// Call the function to append code to pythonExecutor.js
appendCodeToPythonExecutor();
