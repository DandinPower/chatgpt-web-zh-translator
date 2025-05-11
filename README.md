# ChatGPT Web ZH Translator 🌐➜🇹🇼

## Introduction 

A minimal Chrome Extension that lets you right-click any English word or phrase on the web and instantly open ChatGPT with a pre-formatted prompt to translate it into Traditional Chinese, complete with synonyms, antonyms, and example sentences in both languages.


## Repository Layout
```
├── manifest.json        # Chrome Extension manifest (MV3)
├── background.js        # Registers the context-menu & handles tab creation / script injection
├── contentScript.js     # Finds the ChatGPT editor, inserts the prompt, clicks “Send”
└── icons/               # 16-, 48-, 128-pixel PNG icons

````

## Installation (Developer Mode)

1. **Clone** or download this repo  
   ```bash
   git clone https://github.com/<you>/chatgpt-web-zh-translator.git
2. Open **chrome://extensions** in your browser.
3. Enable **Developer mode** (toggle in the top-right).
4. Click **“Load unpacked”** and select the repo folder.
   The “ChatGPT Web ZH Translator” tile should now appear.

## Usage

1. **Highlight** an English word or phrase on any page.
2. **Right-click** and choose **“ChatGPT: ‘…’”** from the context menu.
3. A new tab opens at ChatGPT, the prepared prompt is injected, and **Send** is clicked automatically.
4. Read the neatly formatted bilingual output from ChatGPT.

> **Tip:** You can modify the translation prompt in `contentScript.js` to suit your style—e.g., add parts of speech, pronunciation, or HSK level.

## Permissions Explained

| Permission           | Why it’s needed                                                                                |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| `contextMenus`       | Add the right-click menu entry.                                                                |
| `scripting`          | Inject `contentScript.js` into the ChatGPT page.                                               |
| `tabs`               | Open a new tab and monitor when it finishes loading.                                           |
| **Host permissions** | Restrict script injection strictly to `https://chat.openai.com/*` and `https://chatgpt.com/*`. |

The extension **never** accesses other domains, stores data, or tracks you.

## How It Works (Under the Hood)

1. **background.js**

   * On install, registers a context-menu item.
   * When clicked, opens a new ChatGPT tab and waits for it to finish loading.
   * Injects a tiny pre-script that saves the user-selected text to `window.__SELECTED_TEXT`, then injects `contentScript.js`.

2. **contentScript.js**

   * Polls until the ChatGPT editor (`textarea#prompt-textarea` or `.ProseMirror`) is found.
   * Focuses the editor, places the caret at the end, and inserts a multi-line **translation prompt** plus the selected text.
   * Dispatches an `input` event so ChatGPT notices the change.
   * Observes the DOM until the **Send** button appears, then clicks it.

All logic lives in plain JavaScript—no frameworks, no bundlers.