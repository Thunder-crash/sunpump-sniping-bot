function appendToTerminal(outputString) {
  const terminalElement = document.getElementById('terminal-output');
  const isScrolledToBottom = terminalElement.scrollHeight - terminalElement.clientHeight <= terminalElement.scrollTop + 1;
  
  // Escape HTML special characters in the output string
  const escapedOutputString = outputString.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
  
  // Append the escaped output string
  terminalElement.innerHTML += escapedOutputString + '\n';
  
  // Log the output for debugging
  console.log(`Appended to terminal: ${outputString}`);

  // Auto-scroll if the user is already at the bottom
  if (isScrolledToBottom) {
    terminalElement.scrollTop = terminalElement.scrollHeight - terminalElement.clientHeight;
    console.log("Auto-scrolling to the bottom of the terminal.");
  }
}

module.exports = { appendToTerminal };
