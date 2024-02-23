let isPress = false;
let isWon = false;
let isConfetti = false;
let intervalId;
let wasPressed = false;

const isMobile = window.matchMedia(
    "only screen and (max-width: 760px)"
).matches;

const src = "./chemapol.png";
const img = new Image();
img.src = src;

const scratchWin = document.getElementById("delete-memorial");
const excavator = document.getElementById("excavator");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// const counter = document.getElementById("counter");

const clearRectSize = isMobile ? 20 : 40;

function createConfetti() {
    const confettiCount = 200;
    const confettiColors = [
        "#f5df4d",
        "#d2c800",
        "#c0c4c8",
        "#939597",
        "black",
    ];

    for (let i = 0; i < confettiCount; i++) {
        let confetti = document.createElement("div");
        confetti.classList.add("confetti");
        confetti.style.backgroundColor =
            confettiColors[Math.floor(Math.random() * confettiColors.length)];
        confetti.style.position = "fixed";
        confetti.style.height = "10px";
        confetti.style.width = "10px";
        confetti.style.top = Math.random() * window.innerHeight + "px";
        confetti.style.left = Math.random() * window.innerWidth + "px";
        confetti.style.zIndex = 9999;
        document.body.appendChild(confetti);

        animateConfetti(confetti);
    }
}

const animateConfetti = (confetti) => {
    let initialX = Math.random() * 10 - 5;
    let initialY = Math.random() * 10 - 5;
    let rotation = Math.random() * 360;

    let transform = `translate(${initialX}px, ${initialY}px) rotate(${rotation}deg)`;
    confetti.style.transform = transform;

    setInterval(() => {
        confetti.style.top = confetti.offsetTop + 8 + "px";
        confetti.style.transform = `translate(${initialX}px, ${initialY}px) rotate(${rotation}deg)`;

        if (confetti.offsetTop > window.innerHeight) {
            confetti.style.top = 0;
        }
        if (confetti.offsetLeft > window.innerWidth) {
            confetti.style.left = 0;
        }
    }, 1000 / 60);
};

const removeConfetti = () => {
    const confetti = document.querySelectorAll(".confetti");
    confetti.forEach((c) => {
        document.body.removeChild(c);
    });
};

// calculate the size of the canvas depending of the size of the window
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const calculatedSize = Math.min(windowWidth, windowHeight) * 0.6;
const size = calculatedSize < 500 ? calculatedSize : 500;

canvas.width = size;
canvas.height = size;

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

    // counter.innerHTML = result * 100 + " %";
    return result;
};

// const displayNotDestroyed = () => {
//     const imageData = ctx.getImageData(0, 0, size, size).data;
//     // assuming imageData is an array of pixel data
//     for (let i = 0; i < imageData.length; i += 4) {
//         // if the color of a pixel is not transparent or white, set it to the red color
//         if (
//             !(
//                 (
//                     (imageData[i] === 255 &&
//                         imageData[i + 1] === 255 &&
//                         imageData[i + 2] === 255) || // white
//                     imageData[i + 3] === 0
//                 ) // transparent
//             )
//         ) {
//             imageData[i] = 255; // Red
//             imageData[i + 1] = 0; // Green
//             imageData[i + 2] = 0; // Blue
//             imageData[i + 3] = 255; // Alpha
//         }
//     }
//     // Put the modified image data back into the canvas
//     ctx.putImageData(
//         new ImageData(
//             new Uint8ClampedArray(imageData),
//             canvas.width,
//             canvas.height
//         ),
//         0,
//         0
//     );
// };

// const notDestroyedBtn = document.getElementById("not-destroyed");
// notDestroyedBtn.addEventListener("click", displayNotDestroyed);

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

        // Clear
        ctx.clearRect(
            canvasX - clearRectSize / 2,
            canvasY - clearRectSize / 2,
            clearRectSize,
            clearRectSize
        );

        if (isWon) return;

        // Check if canvas is empty

        if (getEmptyPixelsRatio() >= 0.996) {
            isWon = true;
            isConfetti = true;
            createConfetti();
        }
    }
};

const pressCanvas = () => {
    isPress = true;

    if (!wasPressed) {
        wasPressed = true;

        const pressDescriptionElement =
            document.getElementById("press-descriotion");
        pressDescriptionElement.style.display = "none";
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
