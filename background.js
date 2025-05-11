// background.js

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "sendToChatGPT",
      title: "ChatGPT: \"%s\"",
      contexts: ["selection"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === "sendToChatGPT" && info.selectionText) {
      // 1) Open new tab
      chrome.tabs.create({ url: "https://chat.openai.com/chat" }, (newTab) => {
        const promptText = info.selectionText;
  
        // 2) Wait until the tab is fully loaded
        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
          if (tabId === newTab.id && changeInfo.status === 'complete') {
            chrome.tabs.onUpdated.removeListener(listener);
  
            // 3) Inject contentScript.js
            chrome.scripting.executeScript({
                target: { tabId: newTab.id },
                func: text => { window.__SELECTED_TEXT = text; },
                args: [promptText],
            }).then(() => {
                // 3b) Now inject the main content script
                return chrome.scripting.executeScript({
                target: { tabId: newTab.id },
                files: ["contentScript.js"]
                });
            });
  
          }
        });
      });
    }
  });
  