export function createConfetti() {
  const confettiCount = 200;
  const confettiColors = ["#f5df4d", "#d2c800", "#c0c4c8", "#939597", "black"];

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

  const updatePosition = () => {
    confetti.style.top = confetti.offsetTop + 8 + "px";
    confetti.style.transform = `translate(${initialX}px, ${initialY}px) rotate(${rotation}deg)`;

    if (confetti.offsetTop > window.innerHeight) {
      confetti.style.top = 0;
    }
    if (confetti.offsetLeft > window.innerWidth) {
      confetti.style.left = 0;
    }

    requestAnimationFrame(updatePosition);
  };

  requestAnimationFrame(updatePosition);
};

export const removeConfetti = () => {
  const confetti = document.querySelectorAll(".confetti");
  confetti.forEach((c) => {
    document.body.removeChild(c);
  });
};
