// background.js

const PROMPTS = {
  vocab_explanation: {
    title: 'Vocab Explaination (ZH-TW🇹🇼): "%s"',
    template: `Help me translate the following vocabulary into Traditional Chinese. 
    Please show the English word, its Chinese translation, its English and Chinese synonyms and antonyms. 
    For each vocabulary word (include the original vocabulary), synonym, and antonym, provide one example sentence. 
    The output should be concise and clean without unnecessary bullet points or sentences like "Here is your …" or "Do you need?" or "Would you like ?". 
    The output should look like:
    **{original vocab}** {translated text} (original) {example sentence}{translated sentence}
    **{synonym}** {translated text} (synonym) {example sentence} {translated sentence}
    **{antonym}** {translated text} (antonym) {example sentence} {translated sentence}
    Vocabulary: `
  },
  paragraph_explanation: {
    title: 'Paragraph Explanation (ZH-TW🇹🇼): "%s"',
    template: `Help me translate the following paragraph into Traditional Chinese, using a style suitable for Taiwanese readers. 
    Please choose the most appropriate Chinese term based on the context and field, or retain the English technical term if necessary. 
    Please ONLY provide the Chinese translation. The output should be concise and clean, without unnecessary bullet points or phrases like "Here is your…" or "Would you like…".
    Paragraph:`
  }
}

chrome.runtime.onInstalled.addListener(() => {
    for (const id in PROMPTS) {
      chrome.contextMenus.create({
        id,
        title: PROMPTS[id].title,
        contexts: ['selection']
      });
    }
  });
  
  chrome.contextMenus.onClicked.addListener((info) => {
    const promptConfig = PROMPTS[info.menuItemId];
    if (!promptConfig || !info.selectionText) return;
  
    chrome.tabs.create({ url: 'https://chat.openai.com/chat' }, (newTab) => {
      chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
        if (tabId === newTab.id && changeInfo.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);

          chrome.scripting.executeScript({
            target: { tabId: newTab.id },
            func: (text, template) => {
              window.__SELECTED_TEXT = text;
              window.__PROMPT_TEMPLATE = template;
            },
            args: [info.selectionText, promptConfig.template]
          }).then(() => {
            return chrome.scripting.executeScript({
              target: { tabId: newTab.id },
              files: ['contentScript.js']
            });
          });
        }
      });
    });
  });
