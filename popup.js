// popup.js (updated)
const sokratesAiCheckboxButton = document.getElementById("sokratesAiCheckboxButton");
const sokratesAiCheckboxConfiguration = document.getElementById("sokratesAiCheckboxConfiguration");
const aiModelButtons = document.querySelectorAll('.aiModelButton'); // Get all model buttons

let activatedTools = { sokratesAi: false };
let selectedModel = 'gemini-2.0-flash'; // Default model

// Load data from chrome.storage.local
chrome.storage.local.get(['activatedTools', 'selectedModel'], (result) => {
    if (result.activatedTools) activatedTools = result.activatedTools;
    if (result.selectedModel) selectedModel = result.selectedModel;

    // Update UI based on loaded data
    sokratesAiCheckboxButton.style.backgroundColor = activatedTools.sokratesAi ? "green" : "white";
    sokratesAiCheckboxConfiguration.style.display = activatedTools.sokratesAi ? 'inline-flex' : 'none';

    // Highlight the selected model button
    aiModelButtons.forEach(button => {
        if (button.textContent.includes(selectedModel.replace('gemini-', ''))) {
            button.style.backgroundColor = 'lightblue'; // Highlight selected
        } else {
            button.style.backgroundColor = ''; // Reset others
        }
    });
});

function saveAllData() {
    chrome.storage.local.set({ activatedTools, selectedModel });
}

// Toggle tool activation
sokratesAiCheckboxButton.addEventListener('click', () => {
    activatedTools.sokratesAi = !activatedTools.sokratesAi;
    sokratesAiCheckboxButton.style.backgroundColor = activatedTools.sokratesAi ? 'green' : 'white';
    sokratesAiCheckboxConfiguration.style.display = activatedTools.sokratesAi ? 'inline-flex' : 'none';
    saveAllData();
});

// Handle model button clicks
aiModelButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Map button text to model name
        const modelMap = {
            'Gemini 2.5-flash': 'gemini-2.5-flash',
            'Gemini 2.0-flash': 'gemini-2.0-flash' // Use  for compatibility
        };
        selectedModel = modelMap[button.textContent] || selectedModel;

        // Update highlights
        aiModelButtons.forEach(btn => {
            btn.style.backgroundColor = btn === button ? 'lightblue' : '';
        });

        saveAllData();
    });
});
