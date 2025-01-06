import {
  createConfetti,
  removeConfetti,
  initializeConfetti,
} from "./confetti.js";

// State variables
let isPress = false;
let isWon = false;
let isConfetti = false;
let intervalId;
let wasPressed = false;
let initialEmptyPixelRatio = 0;
let memorial = null;

// Utility functions
function getRandomIndex(array) {
  // Pragerovy kostky temporarily default
  return 2;
  // return Math.floor(Math.random() * array.length);
}

function getEmptyPixelsRatio() {
  const imageData = ctx.getImageData(0, 0, width, height).data;
  let alphaValues = [];
  for (let i = 0; i < imageData.length; i += 4) {
    if (
      (imageData[i] === 255 &&
        imageData[i + 1] === 255 &&
        imageData[i + 2] === 255) || // white
      imageData[i + 3] === 0 // transparent
    ) {
      alphaValues.push(i);
    }
  }
  return alphaValues.length / maxPixels;
}

function updateProgressBar(percentage) {
  let newPercentage = percentage;
  if (percentage !== 0 && percentage !== 100) {
    const initialEmptyPercentage = initialEmptyPixelRatio * 100;
    const effectiveRange = 100 - initialEmptyPercentage;
    const adjustedPercentage = percentage - initialEmptyPercentage;
    newPercentage = (adjustedPercentage / effectiveRange) * 100;
  }
  progressBar.style.width = newPercentage + "%";
}

// Event handlers
function changeMemorial(e) {
  // Remove 'selected' class from all buttons
  changeMemorialButtons.forEach((btn) => {
    btn.classList.remove("selected");
  });
  // Add 'selected' class to the clicked button
  e.target.classList.add("selected");

  endDescriptionEl.style.display = "none";
  endLinkEl.style.display = "none";
  memorial = memorials.find((m) => m.value === e.target.value);

  const src = memorial.src;
  img.src = src;
  img.onload();
  isWon = false;
  updateProgressBar(0);

  getEndLink();
}

function move(mouse) {
  if (!isPress) return;
  const clientX = mouse.clientX ? mouse.clientX : mouse.touches[0].clientX;
  const clientY = mouse.clientY ? mouse.clientY : mouse.touches[0].clientY;
  const canvasPosition = canvas.getBoundingClientRect();
  const canvasX = clientX - canvasPosition.left;
  const canvasY = clientY - canvasPosition.top;

  if (canvasX > 0 && canvasX < width && canvasY > 0 && canvasY < height) {
    bulldozer.style = `--top: ${clientY}px; --left: ${clientX}px;`;
    ctx.clearRect(
      canvasX - clearRectSize / 2,
      canvasY - clearRectSize / 2,
      clearRectSize,
      clearRectSize
    );

    const emptyPixelRation = getEmptyPixelsRatio();
    progressBarPercentage.textContent = `${(emptyPixelRation * 100).toFixed(
      2
    )}%`;

    if (isWon) return;
    updateProgressBar(emptyPixelRation * 100);

    if (
      (isIOS && emptyPixelRation >= 0.9923) ||
      (!isIOS && emptyPixelRation >= 0.995)
    ) {
      isWon = true;
      isConfetti = true;
      createConfetti();
      updateProgressBar(100);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      endDescriptionEl.style.display = "block";
      endLinkEl.style.display = memorial.link ? "block" : "none";
    }
  }
}

function moveBulldozer(event) {
  const clientX = event.clientX ? event.clientX : event.touches[0].clientX;
  const clientY = event.clientY ? event.clientY : event.touches[0].clientY;
  bulldozer.style = `--top: ${clientY}px; --left: ${clientX}px;`;
}

function pressCanvas(event) {
  isPress = true;
  moveBulldozer(event);
  if (!wasPressed) {
    wasPressed = true;
    pressDescriptionEl.style.display = "none";
  }
}

function releaseCanvas() {
  isPress = false;
}

function press() {
  if (isConfetti) {
    isConfetti = false;
    clearInterval(intervalId);
    removeConfetti();
    initializeConfetti();
  }
}

function handlePressDescriptionClick(event) {
  pressDescriptionEl.style.display = "none";
  moveBulldozer(event);
}

function pressProgressBar() {
  progressBarPercentage.style.color = "black";
}

// Initialization
const memorials = [
  {
    src: "zeleznicni-most.webp",
    value: "zeleznicniMost",
    link: "https://nebourat.cz/",
  },
  { src: "chemapol.webp", value: "chemapol" },
  {
    src: "pragerovy-kostky.webp",
    value: "pragerovyKostky",
    link: "https://www.petice.com/opravte_pragerovy_kostky_petice_za_zachovani_a_rekonstrukci_budovy_kostek_u_emauz#a?fbclid=PAZXh0bgNhZW0CMTEAAaYV-suLU8RZjQ5mLdq6JA9-HyplNdvJS13xfpj-6_ErgtxF3j3Oal6yAxE_aem_cCXDvLHHBWg_dSk__4Gi_A",
  },
];

const getEndLink = () => {
  const link = memorial?.link;
  endLinkEl.href = link;
};

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const isMobile = window.matchMedia(
  "only screen and (max-width: 760px)"
).matches;
const randomIndex = getRandomIndex(memorials);
memorial = memorials[randomIndex];
let src = memorial.src;
const img = new Image();
img.src = src;

const pressDescriptionEl = document.getElementById("press-description");
const endDescriptionEl = document.getElementById("end-description");
const endLinkEl = document.getElementById("end-link");
const changeMemorialButtons = document.querySelectorAll("#change-btn");
const progressBar = document.getElementById("progress-bar");
const progressBarPercentage = document.getElementById(
  "progress-bar__percentage"
);
const bulldozer = document.getElementById("bulldozer");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

const clearRectSize = isMobile ? 20 : 40;
const windowWidth = window.innerWidth;
const windowHeight = isMobile
  ? (window.innerHeight / 100) * 50
  : window.innerHeight;
const calculatedSize = Math.min(windowWidth, windowHeight) * 0.9;
const size = calculatedSize < 500 ? calculatedSize : 500;
const width = size;
const height = (3 / 4) * size;

canvas.width = width;
canvas.height = height;
const maxPixels = width * height;

initializeConfetti();
getEndLink(randomIndex);

img.onload = function () {
  ctx.drawImage(img, 0, 0, width, height);
  const canvasPosition = canvas.getBoundingClientRect();
  const canvasX = canvasPosition.left + width - 40;
  const canvasY = canvasPosition.top + height - 20;
  bulldozer.style = `--top: ${canvasY}px; --left: ${canvasX}px;`;
  initialEmptyPixelRatio = getEmptyPixelsRatio();
};

const selectedButton = Array.from(changeMemorialButtons).find(
  (btn) => btn.value === memorial.value
);
if (selectedButton) {
  selectedButton.classList.add("selected");
}

// Event listeners
changeMemorialButtons.forEach((btn) => {
  btn.addEventListener("click", changeMemorial);
});

canvas.addEventListener("mousedown", pressCanvas);
canvas.addEventListener("mouseup", releaseCanvas);
canvas.addEventListener("touchstart", pressCanvas, { passive: true });
canvas.addEventListener("touchend", releaseCanvas);

window.addEventListener("mousemove", move, { passive: true });
window.addEventListener("touchmove", move, { passive: true });

window.addEventListener("mousedown", press);
window.addEventListener("touchstart", press, { passive: true });

pressDescriptionEl.addEventListener("click", handlePressDescriptionClick);
progressBar.addEventListener("click", pressProgressBar);
