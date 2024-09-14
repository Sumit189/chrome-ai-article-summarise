// Background service worker for handling events and messaging

// Log installation and updates
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Extension installed');
  } else if (details.reason === 'update') {
    console.log('Extension updated to version: ' + chrome.runtime.getManifest().version);
  }
});

// Listener for messages from content scripts or popup scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received in background.js:', request); // Log received message
  
  if (request.type === "DISPLAY_SUMMARY") {
    console.log('Received summary from content script:', request.summary);
  }

  // If needed, send a response back to the sender
  if (sendResponse) {
    sendResponse({ received: true });
  }
});
