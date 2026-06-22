const CANVAS_WIDTH = 1536;
const CANVAS_HEIGHT = 1016;

const canvas = document.querySelector('#techPackCanvas');
const ctx = canvas.getContext('2d');
const templateInput = document.querySelector('#templateInput');
const sizeChartInput = document.querySelector('#sizeChartInput');
const notesInput = document.querySelector('#notesInput');
const downloadButton = document.querySelector('#downloadButton');
const clearButton = document.querySelector('#clearButton');

const images = new Map();
let templateImage = null;

const slots = Object.freeze({
  front: { x: 12, y: 42, width: 548, height: 378 },
  back: { x: 572, y: 42, width: 420, height: 378 },
  fabric: { x: 1012, y: 48, width: 247, height: 206, cover: true },
  collar: { x: 12, y: 476, width: 235, height: 188 },
  chestPocket: { x: 248, y: 476, width: 226, height: 188 },
  lowerPocket: { x: 477, y: 476, width: 221, height: 188 },
  frontClosure: { x: 701, y: 476, width: 221, height: 188 },
  sleeve: { x: 925, y: 476, width: 197, height: 188 },
  sideVent: { x: 1126, y: 476, width: 197, height: 188 },
  insideView: { x: 1328, y: 476, width: 193, height: 188 },
});

const sizeChartBox = Object.freeze({ x: 11, y: 695, width: 852, height: 253 });
const notesBox = Object.freeze({ x: 876, y: 695, width: 648, height: 253 });

function drawDefaultTemplate() {
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.strokeStyle = '#111';
  ctx.lineWidth = 1;
  ctx.font = '14px Arial';
  ctx.fillStyle = '#000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  rect(10, 8, 550, 414); title('FLAT SKETCH - FRONT', 285, 30, 18);
  rect(570, 8, 422, 414); title('FLAT SKETCH - BACK', 781, 30, 18);
  rect(1000, 8, 268, 414); title('FABRIC SWATCH', 1134, 30, 16);
  dashedRect(1012, 48, 247, 206);
  infoLine('FABRIC:', 1012, 292, 1065, 296, 1218);
  infoLine('COMPOSITION:', 1012, 328, 1100, 332, 1222);
  infoLine('WEIGHT:', 1012, 364, 1066, 368, 1222);
  infoLine('PATTERN / FINISH:', 1012, 400, 1120, 404, 1222);

  drawJasmineLogo();
  rect(1276, 144, 248, 278); title('GARMENT INFORMATION', 1400, 166, 14);
  ['STYLE NAME:', 'STYLE NO.:', 'SEASON:', 'COLOR:', 'SIZE RANGE:', 'FIT:'].forEach((label, index) => {
    const y = 200 + index * 36;
    ctx.textAlign = 'left'; ctx.font = '12px Arial'; ctx.fillText(label, 1288, y);
    line(1375, y + 4, 1512, y + 4);
  });

  rect(10, 432, 1514, 22); title('TECHNICAL DETAILS', 767, 443, 13);
  const columns = [10, 248, 477, 701, 925, 1126, 1328, 1524];
  for (let i = 0; i < columns.length - 1; i += 1) {
    rect(columns[i], 454, columns[i + 1] - columns[i], 213);
  }
  ['1. COLLAR DETAIL', '2. CHEST POCKET DETAIL', '3. LOWER POCKET DETAIL', '4. FRONT CLOSURE DETAIL', '5. SLEEVE DETAIL', '6. SIDE VENT DETAIL', '7. INSIDE VIEW']
    .forEach((label, index) => title(label, (columns[index] + columns[index + 1]) / 2, 470, 12));

  rect(10, 677, 853, 274); title('SIZE CHART (cm)', 437, 693, 14);
  rect(875, 677, 649, 274); title('CONSTRUCTION NOTES', 1200, 693, 14);
  for (let i = 0; i < 10; i += 1) ctx.fillText('•', 895, 718 + i * 23);

  const footerY = 960;
  rect(10, footerY, 238, 50); rect(248, footerY, 228, 50); rect(476, footerY, 222, 50); rect(698, footerY, 242, 50); rect(940, footerY, 584, 50);
  footer('LINING:', 30, footerY + 28, 90, 228);
  footer('TOPSTITCH:', 273, footerY + 28, 357, 456);
  footer('THREAD:', 500, footerY + 28, 572, 680);
  footer('DATE:', 722, footerY + 28, 775, 920);
  footer('REMARKS:', 965, footerY + 28, 1050, 1505);
}

function rect(x, y, width, height) { ctx.strokeRect(x, y, width, height); }
function line(x1, y1, x2, y2) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
function title(text, x, y, size) { ctx.textAlign = 'center'; ctx.font = `bold ${size}px Arial`; ctx.fillText(text, x, y); }
function infoLine(label, lx, ly, x1, y1, x2) { ctx.textAlign = 'left'; ctx.font = '12px Arial'; ctx.fillText(label, lx, ly); line(x1, y1, x2, y1); }
function footer(label, lx, ly, x1, x2) { ctx.textAlign = 'left'; ctx.font = '12px Arial'; ctx.fillText(label, lx, ly); line(x1, ly + 1, x2, ly + 1); }
function dashedRect(x, y, width, height) { ctx.save(); ctx.setLineDash([5, 3]); rect(x, y, width, height); ctx.restore(); }

function drawJasmineLogo() {
  ctx.textAlign = 'center';
  ctx.font = '38px Georgia, serif';
  ctx.fillText('JASMINE', 1400, 64);
  ctx.font = '13px Georgia, serif';
  ctx.fillText('T E K S T İ L', 1400, 96);
  line(1320, 88, 1480, 88);
  ctx.font = '22px Georgia, serif';
  ctx.fillText('❧', 1345, 30);
  ctx.fillText('❦', 1400, 26);
  ctx.fillText('☙', 1455, 30);
  ctx.fillText('❧', 1350, 115);
  ctx.fillText('❦', 1400, 119);
  ctx.fillText('☙', 1450, 115);
}

function convertPhotoToSketch(image) {
  const offscreen = document.createElement('canvas');
  const maxSide = 900;
  const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
  offscreen.width = Math.max(1, Math.round(image.width * scale));
  offscreen.height = Math.max(1, Math.round(image.height * scale));
  const offCtx = offscreen.getContext('2d');
  offCtx.drawImage(image, 0, 0, offscreen.width, offscreen.height);
  const { width, height } = offscreen;
  const imageData = offCtx.getImageData(0, 0, width, height);
  const source = imageData.data;
  const gray = new Uint8ClampedArray(width * height);

  for (let i = 0, p = 0; i < source.length; i += 4, p += 1) gray[p] = source[i] * 0.299 + source[i + 1] * 0.587 + source[i + 2] * 0.114;

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const p = y * width + x;
      const gx = -gray[p - width - 1] - 2 * gray[p - 1] - gray[p + width - 1] + gray[p - width + 1] + 2 * gray[p + 1] + gray[p + width + 1];
      const gy = -gray[p - width - 1] - 2 * gray[p - width] - gray[p - width + 1] + gray[p + width - 1] + 2 * gray[p + width] + gray[p + width + 1];
      const edge = Math.sqrt(gx * gx + gy * gy);
      const ink = edge > 42 ? 25 : 255;
      const offset = p * 4;
      source[offset] = ink;
      source[offset + 1] = ink;
      source[offset + 2] = ink;
      source[offset + 3] = 255;
    }
  }
  offCtx.putImageData(imageData, 0, 0);
  return offscreen;
}

function drawImageInSlot(image, slot) {
  const scale = slot.cover ? Math.max(slot.width / image.width, slot.height / image.height) : Math.min(slot.width / image.width, slot.height / image.height);
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  const drawX = slot.x + (slot.width - drawWidth) / 2;
  const drawY = slot.y + (slot.height - drawHeight) / 2;
  ctx.save(); ctx.beginPath(); ctx.rect(slot.x, slot.y, slot.width, slot.height); ctx.clip(); ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight); ctx.restore();
}

function parseTableRows(value) {
  return value.split('\n').map((row) => row.trim()).filter(Boolean).map((row) => {
    if (row.includes('\t')) return row.split('\t');
    if (row.includes('|')) return row.split('|');
    if (row.includes(';')) return row.split(';');
    return row.split(',');
  }).map((cells) => cells.map((cell) => cell.trim()));
}

function drawSizeChart() {
  const rows = parseTableRows(sizeChartInput.value);
  if (!rows.length) return;
  const columnCount = Math.max(...rows.map((row) => row.length), 1);
  const rowHeight = Math.min(24, Math.max(16, sizeChartBox.height / rows.length));
  const colWidth = sizeChartBox.width / columnCount;

  ctx.save();
  ctx.beginPath(); ctx.rect(sizeChartBox.x, sizeChartBox.y, sizeChartBox.width, sizeChartBox.height); ctx.clip();
  ctx.strokeStyle = '#888'; ctx.lineWidth = 0.6; ctx.fillStyle = '#111'; ctx.font = '11px Arial'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  for (let r = 0; r <= rows.length; r += 1) line(sizeChartBox.x, sizeChartBox.y + r * rowHeight, sizeChartBox.x + sizeChartBox.width, sizeChartBox.y + r * rowHeight);
  for (let c = 0; c <= columnCount; c += 1) line(sizeChartBox.x + c * colWidth, sizeChartBox.y, sizeChartBox.x + c * colWidth, sizeChartBox.y + rows.length * rowHeight);
  rows.forEach((row, r) => row.forEach((cell, c) => ctx.fillText(cell, sizeChartBox.x + c * colWidth + 6, sizeChartBox.y + r * rowHeight + rowHeight / 2, colWidth - 12)));
  ctx.restore();
}

function drawNotes() {
  const rows = notesInput.value.split('\n').map((row) => row.trim()).filter(Boolean).map((row) => `• ${row}`);
  ctx.save(); ctx.beginPath(); ctx.rect(notesBox.x, notesBox.y, notesBox.width, notesBox.height); ctx.clip(); ctx.fillStyle = '#111'; ctx.font = '15px Arial'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
  rows.forEach((lineText, index) => ctx.fillText(lineText, notesBox.x + 18, notesBox.y + 18 + index * 24, notesBox.width - 36));
  ctx.restore();
}

function render() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  if (templateImage) ctx.drawImage(templateImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  else drawDefaultTemplate();
  Object.entries(slots).forEach(([name, slot]) => { const image = images.get(name); if (image) drawImageInSlot(image, slot); });
  drawSizeChart(); drawNotes();
}

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = URL.createObjectURL(file); });
}

templateInput.addEventListener('change', async (event) => { const [file] = event.target.files; if (!file) return; templateImage = await loadImageFromFile(file); render(); });

document.querySelectorAll('[data-source-slot]').forEach((input) => {
  input.addEventListener('change', async () => { const [file] = input.files; if (!file) return; images.set(input.dataset.sourceSlot, convertPhotoToSketch(await loadImageFromFile(file))); render(); });
});

document.querySelectorAll('[data-asset-slot]').forEach((input) => {
  input.addEventListener('change', async () => { const [file] = input.files; if (!file) return; images.set(input.dataset.assetSlot, await loadImageFromFile(file)); render(); });
});

sizeChartInput.addEventListener('input', render);
notesInput.addEventListener('input', render);
clearButton.addEventListener('click', () => { images.clear(); sizeChartInput.value = ''; notesInput.value = ''; document.querySelectorAll('[data-source-slot], [data-asset-slot]').forEach((input) => { input.value = ''; }); render(); });
downloadButton.addEventListener('click', () => { const link = document.createElement('a'); link.download = 'tech-pack-filled.png'; link.href = canvas.toDataURL('image/png'); link.click(); });

render();
