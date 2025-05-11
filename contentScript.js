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
    const sel = window.getSelection();
    sel.removeAllRanges();
    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
    sel.addRange(range);
    
    // 3) insert text via execCommand
    const template = window.__PROMPT_TEMPLATE || '';
    const textToInsert = template + (window.__SELECTED_TEXT || '');

    document.execCommand('insertText', false, textToInsert);
    console.log('[ChatGPT Extension] execCommand inserted text:', textToInsert);

    // 4) notify the editor of the change
    editor.dispatchEvent(new InputEvent('input', { bubbles: true }));
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
  