document.getElementById("summarizeBtn").addEventListener("click", () => {
  const selectedTone = document.getElementById("toneSelector").value;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['content.js']
      }, () => {
          chrome.scripting.executeScript({
              target: { tabId: tabId },
              function: (tone) => {
                  if (typeof summarizeAndRewriteArticle === "function") {
                      summarizeAndRewriteArticle(tone);
                  } else {
                      console.error("Function summarizeAndRewriteArticle is not defined");
                  }
              },
              args: [selectedTone]
          });
      });
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "SHOW_LOADER") {
      showLoader(request.loaderName);
  } else if (request.type === "DISPLAY_SUMMARY") {
      hideLoader("summary-block-loader");
      document.getElementById("summaryOutput").textContent = request.data;
  } else if (request.type === "DISPLAY_REWRITTEN") {
      hideLoader("rewrite-block-loader");
      document.getElementById("rewrittenOutput").textContent = request.data;
  }else {
      console.error("Unknown message received", request);
  }
});

function showLoader(loaderName) {
  document.getElementById(loaderName).style.display = 'block';
}

function hideLoader(loaderName) {
  document.getElementById(loaderName).style.display = 'none';
}

document.getElementById('summary-block-copyBtn').addEventListener('click', function() {
  var textToCopy = document.getElementById('summaryOutput').textContent;
  navigator.clipboard.writeText(textToCopy).then(function() {
      console.log('Text copied to clipboard');
  }).catch(function(err) {
      console.error('Could not copy text: ', err);
  });
});

document.getElementById('rewrite-block-copyBtn').addEventListener('click', function() {
  var textToCopy = document.getElementById('rewrittenOutput').textContent;
  navigator.clipboard.writeText(textToCopy).then(function() {
      console.log('Text copied to clipboard');
  }).catch(function(err) {
      console.error('Could not copy text: ', err);
  });
});