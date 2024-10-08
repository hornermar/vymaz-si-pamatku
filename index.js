import { createConfetti, removeConfetti } from "./confetti.js";

let isPress = false;
let isWon = false;
let isConfetti = false;
let intervalId;
let wasPressed = false;
let initialEmptyPixelRatio = 0;

function getRandomIndex(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return randomIndex;
}

function updateProgressBar(percentage) {
  const progressBar = document.getElementById("progress-bar");
  let newPercentage = percentage;

  if (percentage !== 0 & percentage !== 100) {
    const initialEmptyPercentage = initialEmptyPixelRatio * 100;

    // Calculate the effective range for the progress bar
    const effectiveRange = 100 - initialEmptyPercentage;
    // Adjust the given percentage to account for the initial empty space
    const adjustedPercentage = percentage - initialEmptyPercentage;
    newPercentage = (adjustedPercentage / effectiveRange) * 100;
  }

  // Set the width of the progress bar
  progressBar.style.width = newPercentage + "%";
}

const memorials = [
  { src: "./zeleznicni-most.png", value: "zeleznicniMost" },
  { src: "./chemapol.png", value: "chemapol" },
];

const isMobile = window.matchMedia(
  "only screen and (max-width: 760px)"
).matches;

const randomIndex = getRandomIndex(memorials);
let src = memorials[randomIndex].src;
const img = new Image();
img.src = src;

const endDescriptionEl = document.getElementById("end-description");

const changeMemorialButtons = document.querySelectorAll("#change-btn");
const changeMemorial = (e) => {
  endDescriptionEl.style.display = "none";
  const src = memorials.find((m) => m.value === e.target.value).src;
  img.src = src;
  img.onload();
  isWon = false;
  updateProgressBar(0);
};
changeMemorialButtons.forEach((btn) => {
  btn.addEventListener("click", changeMemorial);
});

const bulldozer = document.getElementById("bulldozer");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

const clearRectSize = isMobile ? 20 : 40;

// calculate the size of the canvas depending of the size of the window
const windowWidth = window.innerWidth;
const windowHeight = isMobile ? (window.innerHeight / 100) * 45 : window.innerHeight;
const calculatedSize = Math.min(windowWidth, windowHeight) * 0.9;
const size = calculatedSize < 500 ? calculatedSize : 500;

const width = size;
const height = (3 / 4) * size;

canvas.width = width;
canvas.height = height;

// Calculate transparency
const maxPixels = width * height;

const getEmptyPixelsRatio = () => {
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

  const result = alphaValues.length / maxPixels;

  return result;
};

img.onload = function () {
  ctx.drawImage(img, 0, 0, width, height);

  // move bulldozer to the center of the canvas
  const canvasPosition = canvas.getBoundingClientRect();
  const canvasX = canvasPosition.left + width - 40;
  const canvasY = canvasPosition.top + height - 20;
  bulldozer.style = `--top: ${canvasY}px; --left: ${canvasX}px;`;

  initialEmptyPixelRatio = getEmptyPixelsRatio();
};

const move = (mouse) => {
  if (!isPress) return;

  const clientX = mouse.clientX ? mouse.clientX : mouse.touches[0].clientX;
  const clientY = mouse.clientY ? mouse.clientY : mouse.touches[0].clientY;

  const canvasPosition = canvas.getBoundingClientRect();
  const canvasX = clientX - canvasPosition.left;
  const canvasY = clientY - canvasPosition.top;

  if (canvasX > 0 && canvasX < width && canvasY > 0 && canvasY < height) {
    // Move bulldozer
    bulldozer.style = `--top: ${clientY}px; --left: ${clientX}px;`;

    // Clear
    ctx.clearRect(
      canvasX - clearRectSize / 2,
      canvasY - clearRectSize / 2,
      clearRectSize,
      clearRectSize
    );

    if (isWon) return;

    const emptyPixelRation = getEmptyPixelsRatio();
    updateProgressBar(emptyPixelRation * 100);

    // Check if canvas is empty
    if (emptyPixelRation >= 0.996) {
      isWon = true;
      isConfetti = true;
      createConfetti();
      endDescriptionEl.style.display = "block";
      updateProgressBar(100);
    }
  }
};

const pressCanvas = () => {
  isPress = true;

  if (!wasPressed) {
    wasPressed = true;

    const pressDescriptionEl = document.getElementById("press-description");
    pressDescriptionEl.style.color = "white";
  }
};

const releaseCanvas = () => {
  isPress = false;
};

const press = () => {
  if (isConfetti) {
    isConfetti = false;
    clearInterval(intervalId);
    removeConfetti();
  }
};

canvas.addEventListener("mousedown", pressCanvas);
canvas.addEventListener("mouseup", releaseCanvas);
canvas.addEventListener("touchstart", pressCanvas);
canvas.addEventListener("touchend", releaseCanvas);

window.addEventListener("mousemove", move);
window.addEventListener("touchmove", move);

window.addEventListener("mousedown", press);
window.addEventListener("touchstart", press);
