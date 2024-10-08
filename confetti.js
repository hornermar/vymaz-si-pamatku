const confettiCount = 100;
const confettiColors = ["#f5df4d", "#d2c800", "#c0c4c8", "#939597", "black"];
let confettiElements = [];

export function initializeConfetti() {
  for (let i = 0; i < confettiCount; i++) {
    let confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.style.backgroundColor =
      confettiColors[Math.floor(Math.random() * confettiColors.length)];
    confetti.style.left = Math.random() * window.innerWidth + "px";
    confetti.style.animationDuration = "4s"; // Random duration between 5s and 10s
    confetti.style.animationDelay = Math.random() * 5 + "s"; // Random delay up to 5s

    document.body.appendChild(confetti);
    confettiElements.push(confetti);
  }
}

export function createConfetti() {
  confettiElements.forEach((confetti, index) => {
    confetti.style.animationPlayState = "running"; // Start animation
  });
}

export const removeConfetti = () => {
  const confetti = document.querySelectorAll(".confetti");
  confetti.forEach((c) => {
    document.body.removeChild(c);
  });
};
