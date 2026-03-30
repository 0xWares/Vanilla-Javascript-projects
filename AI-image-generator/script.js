const themeToggle = document.querySelector('.theme-toggle');
const modelSelect = document.getElementById('model-select');
const numberSelect = document.getElementById('number-select');
const aspectRatioSelect = document.getElementById('aspect-ratio-select');
const form = document.getElementById('generate-form');
const promptInput = document.querySelector('.prompt-input'); // renamed: 'prompt' conflicts with window.prompt
const gallery = document.querySelector('.gallery-grid');

const API_KEY = "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";

// ── Theme: apply saved or system preference on load ──
(() => {
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
  document.body.classList.toggle('dark-theme', isDark);
  themeToggle.innerHTML = isDark
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';
})();

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-theme');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeToggle.innerHTML = isDark
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';
}

// ── Get width/height from aspect ratio string e.g. "16/9" ──
function getImageDimensions(aspectRatio, baseSize = 512) {
  const [w, h] = aspectRatio.split('/').map(Number); // FIX: was .spit()
  const scaleFactor = baseSize / Math.sqrt(w * h);

  let calcWidth  = Math.floor(Math.round(w * scaleFactor) / 16) * 16;
  let calcHeight = Math.floor(Math.round(h * scaleFactor) / 16) * 16;

  return { width: calcWidth, height: calcHeight };
}

// ── Fetch a single image and return an object URL ──
async function fetchSingleImage(model, width, height, promptText) {
  const MODEL_URL = `https://api-interface.huggingface.co/models/${model}`;

  const response = await fetch(MODEL_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: promptText,
      parameters: { width, height },
      options: { wait_for_model: true, use_cache: false }, // FIX: was user_cache
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error || `HTTP ${response.status}`);
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob); // FIX: was never returned
}

// ── Generate all images and update cards as each resolves ──
async function generateImages(model, number, aspectRatio, promptText) {
  const { width, height } = getImageDimensions(aspectRatio);
  const imgCards = gallery.querySelectorAll('.img-card');

  const imagePromises = Array.from({ length: number }, (_, i) =>
    fetchSingleImage(model, width, height, promptText)
      .then(url => {
        // Update card as soon as this image is ready
        const img = imgCards[i].querySelector('img');
        img.src = url;
        img.alt = promptText;
        imgCards[i].classList.remove('loading');

        // Wire up download button
        const downloadBtn = imgCards[i].querySelector('.img-download-btn');
        downloadBtn.addEventListener('click', () => downloadImage(url, i + 1));
      })
      .catch(err => {
        console.error(`Image ${i + 1} failed:`, err);
        imgCards[i].classList.remove('loading');
        imgCards[i].classList.add('error');
      })
  );

  await Promise.allSettled(imagePromises);
}

// ── Download helper ──
function downloadImage(url, index) {
  const a = document.createElement('a');
  a.href = url;
  a.download = `generated-image-${index}.jpg`;
  a.click();
}

// ── Build skeleton cards then kick off generation ──
function createImageCards(model, number, aspectRatio, promptText) {
  gallery.innerHTML = '';

  for (let i = 0; i < number; i++) {
    // FIX: was using innerHTML +=, which re-parses the whole DOM on every iteration
    const card = document.createElement('div');
    card.className = 'img-card loading';
    card.innerHTML = `
      <img src="./images/img.png" alt="Generating…">
      <div class="img-overlay">
        <button class="img-download-btn" title="Download">
          <i class="fa-solid fa-download"></i>
        </button>
      </div>`;
    gallery.appendChild(card);
  }

  generateImages(model, number, aspectRatio, promptText);
}

// ── Form submission ──
function handleForm(e) {
  e.preventDefault();

  const model       = modelSelect.value;
  const number      = parseInt(numberSelect.value);        // FIX: was a string
  const aspectRatio = aspectRatioSelect.value || '1/1';
  const promptText  = promptInput.value.trim();

  if (!model)       return alert('Please select a model.');
  if (!number)      return alert('Please select number of images.');
  if (!promptText)  return alert('Please enter a prompt.');

  createImageCards(model, number, aspectRatio, promptText);
}

themeToggle.addEventListener('click', toggleTheme);
form.addEventListener('submit', handleForm);