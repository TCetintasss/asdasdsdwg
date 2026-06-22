# Pixel-Perfect Tech Pack Sketch Generator

This browser app uses the Jasmine master tech-pack template as the default locked background and fills it without changing the template layout.

## What it does

- Keeps the master template fixed by default, including the Jasmine logo.
- Accepts normal garment photos for jacket, pants, vest, or detail views.
- Converts those photos into black-and-white flat-sketch style line art in the browser.
- Places the generated sketches into the fixed template boxes only.
- Clips and scales inserted content so no template box, border, title, or spacing is moved.
- Accepts size-chart data pasted directly from Excel and draws it as a grid inside the existing size-chart area.
- Accepts construction notes one line at a time.

## One-file download

If you want the easiest option, download `tech-pack-generator.html` and double-click it. It contains the HTML, CSS, and JavaScript in one file, so no install or local server is required.

## Local installation / testing

1. Install Node.js if it is not already installed.
2. Open a terminal in this project folder.
3. Run `npm start`.
4. Open `http://localhost:4173` in your browser.

You can also double-click `index.html`, but `npm start` is usually easier for local testing.

## Usage

1. Upload normal garment photos into the matching source-photo fields.
2. Paste copied Excel cells into the size-chart field.
3. Add notes if needed.
4. Download the completed PNG.

The optional master-template override is hidden in an advanced section. Use it only if the fixed template itself changes in the future.
