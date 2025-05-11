(function main() {
    
    console.log("[ChatGPT Extension] Script started");
    
    // 1) Find the ProseMirror editor
    const editor = document.getElementById('prompt-textarea')
    || document.querySelector('.ProseMirror');
    if (!editor) {
        console.log("[ChatGPT Extension] Editor not found, retrying...");
        return setTimeout(main, 300);
    }
    console.log("[ChatGPT Extension] Editor found:", editor);
    
    // 2) focus the editor and collapse cursor at end
    editor.focus();
    const sel = window.getSelection();                           // :contentReference[oaicite:2]{index=2}
    sel.removeAllRanges();
    const range = document.createRange();                         // :contentReference[oaicite:3]{index=3}
    range.selectNodeContents(editor);
    range.collapse(false);  // move caret to end
    sel.addRange(range);
    
    // 3) insert text via execCommand
    const prompt = `Help me translate the following vocabulary into Traditional Chinese. 
    Please show the English word, its Chinese translation, its English and Chinese synonyms and antonyms. 
    For each vocabulary word (include the original vocabulary), synonym, and antonym, provide one example sentence. 
    The output should be concise and clean without unnecessary bullet points or sentences like "Here is your …" or "Do you need?" or "Would you like ?". 
    The output should look like:
    **{original vocab}** {translated text} (original) {example sentence}{translated sentence}
    **{synonym}** {translated text} (synonym) {example sentence} {translated sentence}
    **{antonym}** {translated text} (antonym) {example sentence} {translated sentence}
    vocabulary: `;

    const text = prompt + window.__SELECTED_TEXT;

    document.execCommand('insertText', false, text);              // :contentReference[oaicite:4]{index=4}
    console.log('[ChatGPT Extension] execCommand inserted text:', text);

    // 4) notify the editor of the change
    editor.dispatchEvent(new InputEvent('input', { bubbles: true }));  // :contentReference[oaicite:5]{index=5}
    console.log('[ChatGPT Extension] input event dispatched');
  
    // 5) Wait for the existing “Send” button to appear
    const observerTarget = editor.parentElement;
    if (!observerTarget) {
      console.warn("[ChatGPT Extension] Could not find parent element to observe");
      return;
    }
    console.log("[ChatGPT Extension] Setting up MutationObserver on", observerTarget);
  
    const observer = new MutationObserver((mutations, obs) => {
      const sendBtn = document.querySelector('button[data-testid="send-button"]');
      if (sendBtn) {
        console.log("[ChatGPT Extension] Send button detected:", sendBtn);
        sendBtn.click();
        console.log("[ChatGPT Extension] Send button clicked");
        obs.disconnect();
      } else {
        console.log("[ChatGPT Extension] Send button not yet present, still observing...");
      }
    });
  
    observer.observe(observerTarget, { childList: true, subtree: true });
    console.log("[ChatGPT Extension] MutationObserver started");
  })();
  