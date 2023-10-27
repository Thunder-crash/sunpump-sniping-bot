document.addEventListener('DOMContentLoaded', (event) => {
    // Your JavaScript code here...
  });
  
const styleSwitchButton = document.getElementById('style-switch-button');
console.log(styleSwitchButton); // should log the button element

let currentStyle = 1;

styleSwitchButton.addEventListener('click', () => {
  currentStyle++;
  if (currentStyle > 21) {
    currentStyle = 21;
  }

  const styleSheet = document.getElementById('style-sheet');
  console.log(styleSheet); // should log the link element

  if (styleSheet) {
    styleSheet.setAttribute('href', `CSS/styles${currentStyle}.css`);
    console.log(`Switched to style-${currentStyle}.css`);
  }
});
