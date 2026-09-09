# Hanzi Cards — iPhone Chinese flashcards

This is a small installable web app (PWA) designed for iPhone/iPad.

## What it does
- Front of card: Chinese character, English meaning, finger/Apple Pencil writing canvas, stroke count and stroke-order hint
- Back of card: character, tone-marked Hanyu Pinyin, meaning, example phrase
- Again / Hard / Good / Easy grading
- Saves attempts and streak locally
- Works offline after first load

## Run it locally on a computer
Browsers do not allow service workers from a plain `file://` URL, so serve the folder:

    python3 -m http.server 8000

Then visit:
    http://localhost:8000

## Put it on an iPhone
The easiest route is to host this folder on any HTTPS static host (GitHub Pages, Netlify, Cloudflare Pages, etc.).
Open the HTTPS page in Safari on the iPhone and choose:
    Share → Add to Home Screen

It then opens like an app and can work offline.

## Important limitation
This starter version lets the learner *practice* stroke order and shows a textual stroke-order hint. It does not yet automatically judge whether each handwritten stroke exactly matches the canonical path.

For true stroke-by-stroke validation, the next upgrade should load a stroke-vector dataset (for example, Make Me a Hanzi / Hanzi Writer compatible data) and compare the user's path against the expected stroke sequence.

## Add your own cards
Edit the `cards` array near the top of `app.js`.

Each item looks like:

    {
      char: "你",
      pinyin: "nǐ",
      meaning: "you",
      strokes: 7,
      hint: "撇 → 竖 → 撇 → 横钩 → 竖钩 → 撇 → 点",
      example: "你好 — nǐ hǎo — hello"
    }

## Native iOS later
If you want this as a true SwiftUI/Xcode app in TestFlight or the App Store, the same data model and UX can be ported to SwiftUI. Distribution to a physical iPhone requires Apple signing (a personal/free provisioning setup for development, or an Apple Developer account for TestFlight/App Store distribution).
