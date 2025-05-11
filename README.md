# ChatGPT Web ZH Translator 🌐➜🇹🇼

## Introduction

A minimal Chrome Extension that lets you right‑click any **word**, **phrase** or **paragraph** on the web and instantly open ChatGPT with a pre‑formatted prompt that:

* **Vocabulary mode** – translates the selected word into Traditional Chinese and returns synonyms, antonyms, and example sentences.
* **Paragraph mode** – produces a fluent Traditional‑Chinese rendition of the whole selection, picking context‑appropriate terms.

No login, no data storage, and no external API calls — everything runs entirely within the ChatGPT tab opened by the extension.

## Repository Layout

```
├── manifest.json        # Chrome Extension manifest (MV3)
├── background.js        # Registers the context menus & handles tab creation / script injection
├── contentScript.js     # Finds the ChatGPT editor, injects the prompt, clicks “Send”
└── icons/               # 16-, 48-, 128‑pixel PNG icons
```

## Installation (Developer Mode)

1. **Clone** or download this repo

   ```bash
   git clone https://github.com/DandinPower/chatgpt-web-zh-translator.git
   ```
2. Open **chrome://extensions** in your browser.
3. Enable **Developer mode** (toggle in the top‑right).
4. Click **Load unpacked** and select the repo folder.
   The “ChatGPT Web ZH Translator” tile should now appear.

## Usage

1. **Highlight** an English word, phrase **or a whole paragraph**.
2. **Right‑click** and choose either

   * **“Vocab Explanation (ZH‑TW): ‘…’”** – for single words/phrases, or
   * **“Paragraph Explanation (ZH‑TW): ‘…’”** – for longer selections.
3. A new tab opens at ChatGPT, the prepared prompt is injected, and **Send** is clicked automatically.
4. Read the neatly formatted output from ChatGPT.

> **Tip:** To tweak the wording of the prompt, edit the `PROMPTS` object in `background.js`.

## Permissions Explained

| Permission           | Why it’s needed                                                                                |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| `contextMenus`       | Add the two right‑click menu entries.                                                          |
| `scripting`          | Inject `contentScript.js` into the ChatGPT page.                                               |
| `tabs`               | Open a new tab and monitor when it finishes loading.                                           |
| **Host permissions** | Restrict script injection strictly to `https://chat.openai.com/*` and `https://chatgpt.com/*`. |

The extension **never** accesses other domains, stores data, or tracks you.

## How It Works (Under the Hood)

1. **background.js**

   * On install, registers **two** context‑menu items (`Vocab Explanation…` and `Paragraph Explanation…`).
   * When one is clicked, opens a new ChatGPT tab and waits for it to finish loading.
   * Injects a tiny pre‑script that saves the user‑selected text and the appropriate prompt template to `window`, then injects `contentScript.js`.

2. **contentScript.js**

   * Polls until the ChatGPT editor (`textarea#prompt-textarea` or `.ProseMirror`) is found.
   * Focuses the editor, places the caret at the end, and inserts the assembled prompt with the selected text.
   * Dispatches an `input` event so ChatGPT notices the change.
   * Observes the DOM until the **Send** button appears, then clicks it.

All logic lives in plain JavaScript—no frameworks, no bundlers, no analytics.
