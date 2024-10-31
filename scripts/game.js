import * as THREE from "https://unpkg.com/three@0.136.0/build/three.module.js";

// Global Variables
let scene, camera, renderer;
let player, floor;
let obstacles = [];
let score = 0;
let obstacleSpeed = 0.1;
let isGameRunning = false;
let gamePaused = false;
let obstacleInterval;

// Initialize Three.js Setup
function init() {
  const container = document.getElementById("game-container");

  // Basic scene setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Create elements in the scene
  createPlayer();
  createFloor();
  animate(); // Start the animation loop
}

// Create the Player Car
function createPlayer() {
  const geometry = new THREE.BoxGeometry(1, 1, 2);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  player = new THREE.Mesh(geometry, material);
  player.position.set(0, 1, 0);
  scene.add(player);

  // Adjust camera position and orientation
  camera.position.set(0, 5, 10);
  camera.lookAt(player.position);
}

// Create the Floor (Racing Track)
function createFloor() {
  const geometry = new THREE.PlaneGeometry(20, 100);
  const material = new THREE.MeshBasicMaterial({
    color: 0x444444,
    side: THREE.DoubleSide,
  });
  floor = new THREE.Mesh(geometry, material);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  scene.add(floor);
}

// Handle Player Movement
let moveLeft = false;
let moveRight = false;

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") moveLeft = true;
  if (event.key === "ArrowRight") moveRight = true;
});

window.addEventListener("keyup", (event) => {
  if (event.key === "ArrowLeft") moveLeft = false;
  if (event.key === "ArrowRight") moveRight = false;
});

function movePlayer() {
  if (moveLeft && player.position.x > -4) player.position.x -= 0.1;
  if (moveRight && player.position.x < 4) player.position.x += 0.1;
}

// Create Obstacles
function createObstacle() {
  const geometry = new THREE.SphereGeometry(0.5, 16, 16);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const obstacle = new THREE.Mesh(geometry, material);
  obstacle.position.y = 0.5;
  obstacle.position.x = (Math.random() - 0.5) * 8;
  obstacle.position.z = -20;
  scene.add(obstacle);
  obstacles.push(obstacle);
}

// Move Obstacles and Check for Collision
function moveObstacles() {
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const obstacle = obstacles[i];
    obstacle.position.z += obstacleSpeed;

    // Check for collision with player
    if (obstacle.position.distanceTo(player.position) < 1) {
      endGame();
      return; // Stop processing after a collision
    }

    // Remove off-screen obstacles
    if (obstacle.position.z > 10) {
      scene.remove(obstacle);
      obstacles.splice(i, 1);
    }
  }
}

// End Game Function
function endGame() {
  isGameRunning = false;
  gamePaused = false;
  clearInterval(obstacleInterval);
  showGameOverScreen();
}

// Display Game Over Screen
function showGameOverScreen() {
  document.getElementById("final-score").textContent = score;
  document.getElementById("game-over-screen").style.display = "block";
  document.getElementById("game-container").style.display = "none";
}

// Hide Game Over Screen
function hideGameOverScreen() {
  document.getElementById("game-over-screen").style.display = "none";
}

// Restart Game
function restartGame() {
  hideGameOverScreen();
  resetGame();
  startGame();
}

// Quit Game to Main Menu
function quitGame() {
  hideGameOverScreen();
  resetGame();
}

// Reset Game State
function resetGame() {
  obstacles.forEach((obstacle) => scene.remove(obstacle));
  obstacles = [];
  player.position.set(0, 1, 0);
  score = 0;
  document.getElementById("score").textContent = `Score: ${score}`;
  document.getElementById("game-container").style.display = "none";
  document.getElementById("home-screen").style.display = "block";
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  if (isGameRunning && !gamePaused) {
    movePlayer();
    moveObstacles();
    score++;
    document.getElementById("score").textContent = `Score: ${score}`;
  }

  renderer.render(scene, camera);
}

// Start Game Function
function startGame() {
  document.getElementById("home-screen").style.display = "none";
  document.getElementById("game-container").style.display = "block";
  score = 0;
  document.getElementById("score").textContent = `Score: ${score}`;
  isGameRunning = true;
  gamePaused = false;

  clearInterval(obstacleInterval);
  obstacleInterval = setInterval(() => {
    if (isGameRunning && !gamePaused) {
      createObstacle();
    }
  }, 1000);
}

// Pause and Resume Functionality
function pauseGame() {
  gamePaused = true;
  document.getElementById("pause-game").style.display = "none";
  document.getElementById("resume-game").style.display = "block";
}

function resumeGame() {
  gamePaused = false;
  document.getElementById("resume-game").style.display = "none";
  document.getElementById("pause-game").style.display = "block";
}

// Update obstacle speed based on input
document.getElementById("obstacle-speed").addEventListener("input", (event) => {
  obstacleSpeed = parseFloat(event.target.value);
});

// Event listeners for game controls
document.getElementById("start-button").addEventListener("click", startGame);
document
  .getElementById("restart-button")
  .addEventListener("click", restartGame);
document.getElementById("quit-button").addEventListener("click", quitGame);
document.getElementById("pause-game").addEventListener("click", pauseGame);
document.getElementById("resume-game").addEventListener("click", resumeGame);

// Initialize the game
init();
