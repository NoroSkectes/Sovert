// content.js (updated)
const contentBox = document.createElement('div');
contentBox.id = 'gemini-response-box';
contentBox.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    width: 300px;
    max-height: 400px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px;
    border-radius: 5px;
    font-family: Arial, sans-serif;
    font-size: 14px;
    overflow-y: auto;
    z-index: 9999;
    display: none; /* Initially hidden */
`;
contentBox.innerHTML = '<p>Loading...</p>';
document.body.appendChild(contentBox);

let activatedTools = { sokratesAi: false }; // Cache for sync access

// Load activatedTools on page load
chrome.storage.local.get('activatedTools', (result) => {
    if (result.activatedTools) activatedTools = result.activatedTools;
});

// Track cursor position and show/hide box
document.addEventListener('mousemove', (event) => {
    const screenWidth = window.innerWidth;
    const cursorX = event.clientX;
    const left85Percent = screenWidth * 0.85; // 85% from the left (right 15%)

    if (cursorX > left85Percent) {
        if (activatedTools.sokratesAi) {
            contentBox.style.display = 'block';
        } else {
            contentBox.style.display = 'none';
        }
    } else {
        contentBox.style.display = 'none';
    }
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'displayResponse') {
        contentBox.innerHTML = `<p>${message.response}</p>`;
    }
});
