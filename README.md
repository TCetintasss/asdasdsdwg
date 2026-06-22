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

## Usage

1. Open `index.html` in a browser.
2. Upload normal garment photos into the matching source-photo fields.
3. Paste copied Excel cells into the size-chart field.
4. Add notes if needed.
5. Download the completed PNG.

The optional master-template override is hidden in an advanced section. Use it only if the fixed template itself changes in the future.
