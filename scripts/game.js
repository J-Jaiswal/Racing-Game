import * as THREE from "https://unpkg.com/three@0.136.0/build/three.module.js";
import { createPlayer } from "./player.js";
import {
  createObstacle,
  moveObstacles,
  resetObstacles,
  updateCollision,
} from "./obstacle.js";
import { setupControls, movePlayer } from "./utils/controls.js";
import { carMovingSound, collisionSound } from "./utils/sound.js";

let scene, camera, renderer;
let player;
let score = 0;
let obstacleSpeed = 0.2;
let isGameRunning = false;
let gamePaused = false;
let obstacleInterval;
let speedIncreaseInterval;

function init() {
  const container = document.getElementById("game-container");

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

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  player = createPlayer(scene);
  setupControls(player);

  createFloor();
  animate();
}

function createFloor() {
  const geometry = new THREE.PlaneGeometry(20, 100);
  const material = new THREE.MeshBasicMaterial({
    color: 0x444444,
    side: THREE.DoubleSide,
  });
  const floor = new THREE.Mesh(geometry, material);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  scene.add(floor);
}

function animate() {
  requestAnimationFrame(animate);

  if (isGameRunning && !gamePaused) {
    movePlayer();
    moveObstacles(scene);
    updateCollision(player, scene, endGame);
    score++;
    document.getElementById("score").textContent = `Score: ${score}`;
  }

  renderer.render(scene, camera);
}

function startGame() {
  document.getElementById("home-screen").style.display = "none";
  document.getElementById("game-container").style.display = "block";
  score = 0;
  isGameRunning = true;
  gamePaused = false;
  obstacleSpeed = 0.2;

  resetObstacles(scene);
  obstacleInterval = setInterval(() => {
    if (isGameRunning && !gamePaused) createObstacle(scene);
  }, 1000);

  speedIncreaseInterval = setInterval(() => {
    if (isGameRunning && !gamePaused) obstacleSpeed += 0.04;
  }, 5000);
}

function pauseGame() {
  gamePaused = true;
  clearInterval(obstacleInterval);
  clearInterval(speedIncreaseInterval);
  document.getElementById("pause-game").style.display = "none";
  document.getElementById("resume-game").style.display = "block";
}

function resumeGame() {
  gamePaused = false;
  document.getElementById("resume-game").style.display = "none";
  document.getElementById("pause-game").style.display = "block";
  startGame();
}

function endGame() {
  isGameRunning = false;
  clearInterval(obstacleInterval);
  clearInterval(speedIncreaseInterval);
  document.getElementById("final-score").textContent = score;
  document.getElementById("game-over-screen").style.display = "block";
  document.getElementById("game-container").style.display = "none";
}

function restartGame() {
  document.getElementById("game-over-screen").style.display = "none";
  startGame();
}

function quitGame() {
  isGameRunning = false;
  clearInterval(obstacleInterval);
  clearInterval(speedIncreaseInterval);
  resetObstacles(scene);
  document.getElementById("game-container").style.display = "none";
  document.getElementById("home-screen").style.display = "block";
}

document.getElementById("start-button").addEventListener("click", startGame);
document.getElementById("pause-game").addEventListener("click", pauseGame);
document.getElementById("resume-game").addEventListener("click", resumeGame);
document
  .getElementById("restart-button")
  .addEventListener("click", restartGame);
document.getElementById("quit-button").addEventListener("click", quitGame);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

init();
