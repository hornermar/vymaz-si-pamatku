const src = "./chemapol_final.jpg";
const img = new Image();
img.src = src;

const scratchWin = document.getElementById("delete-memorial");
const excavator = document.getElementById("excavator");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const isMobile = window.matchMedia(
    "only screen and (max-width: 760px)"
).matches;
const clearRectSize = isMobile ? 20 : 40;

// calculate the size of the canvas depending of the size of the window
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const calculatedSize = Math.min(windowWidth, windowHeight) * 0.6;
const size = calculatedSize < 500 ? calculatedSize : 500;

canvas.width = size;
canvas.height = size;

let isPress = false;
let isWon = false;

img.onload = function () {
    ctx.drawImage(img, 0, 0, size, size);

    // move excavator to the center of the canvas
    const canvasPosition = canvas.getBoundingClientRect();
    const canvasX = canvasPosition.left + size - 5;
    const canvasY = canvasPosition.top + size - 20;
    excavator.style = `--top: ${canvasY}px; --left: ${canvasX}px;`;
};

// Calculate transparency
const maxPixels = size * size;
const getEmptyPixelsRatio = () => {
    const imageData = ctx.getImageData(0, 0, size, size).data;

    const alphaValues = imageData.filter(
        (value) => value === 0 || value === 255
    );

    return alphaValues.length / 4 / maxPixels;
};

const move = (mouse) => {
    if (!isPress) return;

    const clientX = mouse.clientX ? mouse.clientX : mouse.touches[0].clientX;
    const clientY = mouse.clientY ? mouse.clientY : mouse.touches[0].clientY;

    const canvasPosition = canvas.getBoundingClientRect();
    const canvasX = clientX - canvasPosition.left;
    const canvasY = clientY - canvasPosition.top;

    if (canvasX > 0 && canvasX < size && canvasY > 0 && canvasY < size) {
        // Move excavator
        excavator.style = `--top: ${clientY}px; --left: ${clientX}px;`;

        if (isWon) return;

        // Clear
        ctx.clearRect(
            canvasX - clearRectSize / 2,
            canvasY - clearRectSize / 2,
            clearRectSize,
            clearRectSize
        );

        // Check if canvas is empty
        if (getEmptyPixelsRatio() === 1) {
            console.log("You have won!");
            isWon = true;

            setTimeout(() => {
                alert("Gratulace!");
            }, 500);
        }
    }
};

const press = (e) => {
    isPress = true;
    pressPosition = { x: e.offsetX, y: e.offsetY };
};

const release = () => {
    isPress = false;
};

canvas.addEventListener("mousedown", press);
canvas.addEventListener("mouseup", release);
canvas.addEventListener("touchstart", press);
canvas.addEventListener("touchend", release);

window.addEventListener("mousemove", move);
window.addEventListener("touchmove", move);
