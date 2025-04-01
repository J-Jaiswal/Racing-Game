let moveLeft = false;
let moveRight = false;
let playerRef;

export function setupControls(player) {
  playerRef = player;
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") moveLeft = true;
    if (e.key === "ArrowRight") moveRight = true;
  });

  window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") moveLeft = false;
    if (e.key === "ArrowRight") moveRight = false;
  });

  document
    .getElementById("left-button")
    .addEventListener("touchstart", () => (moveLeft = true));
  document
    .getElementById("left-button")
    .addEventListener("touchend", () => (moveLeft = false));
  document
    .getElementById("right-button")
    .addEventListener("touchstart", () => (moveRight = true));
  document
    .getElementById("right-button")
    .addEventListener("touchend", () => (moveRight = false));
}

export function movePlayer() {
  if (!playerRef) return;
  if (moveLeft && playerRef.position.x > -4) playerRef.position.x -= 0.15;
  if (moveRight && playerRef.position.x < 4) playerRef.position.x += 0.15;
}
