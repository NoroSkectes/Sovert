const GEMINI_API_KEY = 'AIzaSyCvXWr6BkLNBZVi8ld2yPibJxjfqyBkGc8';

chrome.commands.onCommand.addListener((command) => {
    if (command === 'capture-screenshot') {
        console.log('Hotkey pressed: Starting screenshot capture...');
        captureAndSendScreenshot();
    }
});

async function captureAndSendScreenshot() {
    try {
        const { selectedModel } = await chrome.storage.local.get('selectedModel');
        const model = selectedModel || 'gemini-2.0-flash'; 
        const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab) {
            console.error('No active tab found.');
            return;
        }

        const screenshotDataUrl = await chrome.tabs.captureVisibleTab(null, { format: 'png' });

        const base64Image = screenshotDataUrl.split(',')[1];

        const payload = {
            contents: [
                {
                    parts: [
                        { text: "Boleh bantu jawab soal ini? [berikan jawabannya dalam bentuk teks biasa, dengan penjelasan singkatnya - terima kasih]" },
                        {
                            inline_data: {
                                mime_type: "image/png",
                                data: base64Image
                            }
                        }
                    ]
                }
            ]
        };

        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', response.status, errorText);
            throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI.';

        chrome.tabs.sendMessage(tab.id, { action: 'displayResponse', response: aiResponse });
    } catch (error) {
        console.error('Error in captureAndSendScreenshot:', error);
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab) {
            chrome.tabs.sendMessage(tab.id, { action: 'displayResponse', response: `Error: ${error.message}` });
        }
    }
}
