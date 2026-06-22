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

// Coordinates are locked to the supplied 1536 × 1016 master-template geometry.
// Only inserted content is scaled to fit these rectangles; template geometry is never changed.
const slots = Object.freeze({
  front: { x: 34, y: 50, width: 430, height: 365 },
  back: { x: 510, y: 50, width: 385, height: 365 },
  fabric: { x: 945, y: 48, width: 275, height: 217, cover: true },
  logo: { x: 1240, y: 18, width: 280, height: 120 },
  collar: { x: 36, y: 485, width: 205, height: 185 },
  chestPocket: { x: 316, y: 520, width: 120, height: 150 },
  lowerPocket: { x: 545, y: 520, width: 125, height: 150 },
  frontClosure: { x: 785, y: 492, width: 80, height: 178 },
  sleeve: { x: 948, y: 498, width: 120, height: 172 },
  sideVent: { x: 1125, y: 495, width: 145, height: 178 },
  insideView: { x: 1328, y: 492, width: 150, height: 178 },
});

const sizeChartBox = Object.freeze({ x: 16, y: 740, width: 470, height: 178 });
const notesBox = Object.freeze({ x: 1020, y: 735, width: 490, height: 215 });

function drawPlaceholderTemplate() {
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.strokeStyle = '#b5b5ad';
  ctx.lineWidth = 1;
  ctx.strokeRect(10, 10, 1516, 1000);
  ctx.fillStyle = '#1f2933';
  ctx.font = '22px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Upload the fixed MASTER TECH PACK TEMPLATE image', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
}

function drawImageInSlot(image, slot) {
  const scale = slot.cover
    ? Math.max(slot.width / image.width, slot.height / image.height)
    : Math.min(slot.width / image.width, slot.height / image.height);
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  const drawX = slot.x + (slot.width - drawWidth) / 2;
  const drawY = slot.y + (slot.height - drawHeight) / 2;

  ctx.save();
  ctx.beginPath();
  ctx.rect(slot.x, slot.y, slot.width, slot.height);
  ctx.clip();
  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
  ctx.restore();
}

function drawMultilineText(lines, box, options = {}) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(box.x, box.y, box.width, box.height);
  ctx.clip();
  ctx.fillStyle = '#111';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = options.font ?? '12px Arial';

  const lineHeight = options.lineHeight ?? 17;
  lines.forEach((line, index) => {
    const y = box.y + (options.paddingY ?? 6) + index * lineHeight;
    if (y + lineHeight <= box.y + box.height) {
      ctx.fillText(line, box.x + (options.paddingX ?? 12), y, box.width - 24);
    }
  });
  ctx.restore();
}

function drawSizeChart() {
  const rows = sizeChartInput.value
    .split('\n')
    .map((row) => row.trim())
    .filter(Boolean)
    .map((row) => row.split('|').map((cell) => cell.trim()).join('    '));
  drawMultilineText(rows, sizeChartBox, { font: '11px Arial', lineHeight: 15, paddingX: 26, paddingY: 26 });
}

function drawNotes() {
  const rows = notesInput.value
    .split('\n')
    .map((row) => row.trim())
    .filter(Boolean)
    .map((row) => `• ${row}`);
  drawMultilineText(rows, notesBox, { font: '15px Arial', lineHeight: 24, paddingX: 22, paddingY: 36 });
}

function render() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  if (templateImage) {
    ctx.drawImage(templateImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  } else {
    drawPlaceholderTemplate();
  }

  Object.entries(slots).forEach(([name, slot]) => {
    const image = images.get(name);
    if (image) drawImageInSlot(image, slot);
  });
  drawSizeChart();
  drawNotes();
}

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = URL.createObjectURL(file);
  });
}

templateInput.addEventListener('change', async (event) => {
  const [file] = event.target.files;
  if (!file) return;
  templateImage = await loadImageFromFile(file);
  render();
});

document.querySelectorAll('[data-slot]').forEach((input) => {
  input.addEventListener('change', async (event) => {
    const [file] = event.target.files;
    if (!file) return;
    images.set(input.dataset.slot, await loadImageFromFile(file));
    render();
  });
});

sizeChartInput.addEventListener('input', render);
notesInput.addEventListener('input', render);

clearButton.addEventListener('click', () => {
  images.clear();
  sizeChartInput.value = '';
  notesInput.value = '';
  document.querySelectorAll('[data-slot]').forEach((input) => { input.value = ''; });
  render();
});

downloadButton.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'tech-pack-filled.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

render();
