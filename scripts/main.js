// origional main script which is only executing-->

import * as THREE from "https://unpkg.com/three@0.136.0/build/three.module.js";

const carMovingSound = new Audio("../sounds/Background.mp3");
const collisionSound = new Audio("../sounds/Gameover.mp3");
const button = new Audio("../sounds/button.mp3");

carMovingSound.loop = true;

// Global Variables
let scene, camera, renderer;
let player, floor;
let obstacles = [];
let score = 0;
let obstacleSpeed = 0.2;
let isGameRunning = false;
let gamePaused = false;
let obstacleInterval;
let speedIncreaseInterval;
let moveLeft = false;
let moveRight = false;

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

  createPlayer();
  createFloor();
  addMobileControls();
  animate();
}

function createPlayer() {
  const carGroup = new THREE.Group();
  const bodyGeometry = new THREE.BoxGeometry(1.5, 0.5, 3);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const carBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
  carBody.position.y = 0.5;
  carGroup.add(carBody);

  const roofGeometry = new THREE.BoxGeometry(1, 0.3, 1.5);
  const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x880000 });
  const carRoof = new THREE.Mesh(roofGeometry, roofMaterial);
  carRoof.position.set(0, 0.8, 0);
  carGroup.add(carRoof);

  const windowGeometry = new THREE.BoxGeometry(0.9, 0.2, 1.4);
  const windowMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.5,
  });
  const carWindows = new THREE.Mesh(windowGeometry, windowMaterial);
  carWindows.position.set(0, 0.85, 0);
  carGroup.add(carWindows);

  const lightGeometry = new THREE.BoxGeometry(0.2, 0.1, 0.1);
  const lightMaterial = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    emissive: 0xffff00,
  });
  const headlight1 = new THREE.Mesh(lightGeometry, lightMaterial);
  const headlight2 = new THREE.Mesh(lightGeometry, lightMaterial);
  headlight1.position.set(0.6, 0.5, 1.5);
  headlight2.position.set(-0.6, 0.5, 1.5);
  carGroup.add(headlight1, headlight2);

  const mirrorGeometry = new THREE.BoxGeometry(0.2, 0.1, 0.1);
  const mirrorMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
  const mirror1 = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
  const mirror2 = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
  mirror1.position.set(0.85, 0.75, 0.6);
  mirror2.position.set(-0.85, 0.75, 0.6);
  carGroup.add(mirror1, mirror2);

  const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 12);
  const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
  const wheelPositions = [
    [-0.7, 0.2, 1.2],
    [0.7, 0.2, 1.2],
    [-0.7, 0.2, -1.2],
    [0.7, 0.2, -1.2],
  ];
  wheelPositions.forEach(([x, y, z]) => {
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x, y, z);
    carGroup.add(wheel);
  });

  player = carGroup;
  player.position.set(0, 0.5, 0);
  scene.add(player);

  camera.position.set(0, 5, 10);
  camera.lookAt(player.position);
}

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

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    button.play();
    moveLeft = true;
  }
  if (event.key === "ArrowRight") {
    button.play();
    moveRight = true;
  }
});

window.addEventListener("keyup", (event) => {
  if (event.key === "ArrowLeft") moveLeft = false;
  if (event.key === "ArrowRight") moveRight = false;
});

function addMobileControls() {
  const leftButton = document.getElementById("left-button");
  const rightButton = document.getElementById("right-button");

  leftButton.addEventListener("touchstart", () => {
    button.play();
    moveLeft = true;
  });
  leftButton.addEventListener("touchend", () => (moveLeft = false));

  rightButton.addEventListener("touchstart", () => {
    button.play();
    moveRight = true;
  });
  rightButton.addEventListener("touchend", () => (moveRight = false));
}

function movePlayer() {
  if (moveLeft && player.position.x > -4) player.position.x -= 0.15;
  if (moveRight && player.position.x < 4) player.position.x += 0.15;
}

function createObstacle() {
  const obstacleGroup = new THREE.Group();

  const baseGeometry = new THREE.BoxGeometry(2, 0.5, 0.5);
  const baseMaterial = new THREE.MeshStandardMaterial({ color: 0xffa500 });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.y = 0.5;
  obstacleGroup.add(base);

  const stripeGeometry = new THREE.BoxGeometry(2, 0.1, 0.5);
  const stripeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
  const stripe1 = new THREE.Mesh(stripeGeometry, stripeMaterial);
  stripe1.position.set(0, 0.6, 0);
  obstacleGroup.add(stripe1);

  const lightGeometry = new THREE.SphereGeometry(0.2, 8, 8);
  const lightMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    emissive: 0xff0000,
  });
  const warningLight1 = new THREE.Mesh(lightGeometry, lightMaterial);
  const warningLight2 = new THREE.Mesh(lightGeometry, lightMaterial);
  warningLight1.position.set(-0.8, 0.8, 0);
  warningLight2.position.set(0.8, 0.8, 0);
  obstacleGroup.add(warningLight1, warningLight2);

  obstacleGroup.position.x = (Math.random() - 0.5) * 8;
  obstacleGroup.position.z = -20;
  scene.add(obstacleGroup);
  obstacles.push(obstacleGroup);
}

function updateCollision() {
  if (!player || obstacles.length === 0) return;
  player.boundingBox.setFromObject(player);

  for (let i = 0; i < obstacles.length; i++) {
    let obstacle = obstacles[i];
    if (!obstacle.boundingBox) {
      obstacle.boundingBox = new THREE.Box3().setFromObject(obstacle);
    } else {
      obstacle.boundingBox.setFromObject(obstacle);
    }

    if (player.boundingBox.intersectsBox(obstacle.boundingBox)) {
      console.log("Collision Detected!");
      collisionSound.currentTime = 0;
      collisionSound.play();
      endGame();
      return;
    }
  }
}

function moveObstacles() {
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const obstacle = obstacles[i];
    if (!obstacle) continue;
    obstacle.position.z += obstacleSpeed;
    if (!obstacle.boundingBox) {
      obstacle.boundingBox = new THREE.Box3().setFromObject(obstacle);
    } else {
      obstacle.boundingBox.setFromObject(obstacle);
    }

    if (obstacle.position.z > 10) {
      scene.remove(obstacle);
      obstacles.splice(i, 1);
    }
  }
}

function increaseObstacleSpeed() {
  if (isGameRunning) {
    obstacleSpeed += 0.04;
    console.log("Obstacle Speed Increased:", obstacleSpeed);
  }
}

function endGame() {
  isGameRunning = false;
  gamePaused = false;
  clearInterval(obstacleInterval);
  clearInterval(speedIncreaseInterval);
  carMovingSound.pause();
  showGameOverScreen();
}

function showGameOverScreen() {
  document.getElementById("final-score").textContent = score;
  document.getElementById("game-over-screen").style.display = "block";
  document.getElementById("game-container").style.display = "none";
}

function restartGame() {
  hideGameOverScreen();
  resetGame();
  startGame();
}

function hideGameOverScreen() {
  document.getElementById("game-over-screen").style.display = "none";
  document.getElementById("game-container").style.display = "block";
}

function resetGame() {
  obstacles.forEach((obstacle) => scene.remove(obstacle));
  obstacles = [];
  player.position.set(0, 0.5, 0);
  player.boundingBox = new THREE.Box3().setFromObject(player);
  score = 0;
  obstacleSpeed = 0.1;
  document.getElementById("score").textContent = `Score: ${score}`;
}

function pauseGame() {
  if (isGameRunning) {
    gamePaused = true;
    clearInterval(obstacleInterval);
    clearInterval(speedIncreaseInterval);
    carMovingSound.pause();
    document.getElementById("pause-game").style.display = "none";
    document.getElementById("resume-game").style.display = "block";
  }
}

function resumeGame() {
  if (isGameRunning) {
    gamePaused = false;
    carMovingSound.play();
    document.getElementById("resume-game").style.display = "none";
    document.getElementById("pause-game").style.display = "block";

    obstacleInterval = setInterval(() => {
      if (isGameRunning && !gamePaused) createObstacle();
    }, 1000);

    speedIncreaseInterval = setInterval(() => {
      if (isGameRunning && !gamePaused) increaseObstacleSpeed();
    }, 5000);
  }
}

function animate() {
  requestAnimationFrame(animate);

  if (isGameRunning && !gamePaused) {
    movePlayer();
    moveObstacles();
    updateCollision();
    score++;
    document.getElementById("score").textContent = `Score: ${score}`;
  }

  renderer.render(scene, camera);
}

function quitGame() {
  isGameRunning = false;
  gamePaused = false;
  clearInterval(obstacleInterval);
  clearInterval(speedIncreaseInterval);
  carMovingSound.pause();

  document.getElementById("game-over-screen").style.display = "none";
  document.getElementById("game-container").style.display = "none";

  resetGame();
  document.getElementById("home-screen").style.display = "block";
}

function startGame() {
  document.getElementById("home-screen").style.display = "none";
  document.getElementById("game-container").style.display = "block";

  score = 0;
  document.getElementById("score").textContent = `Score: ${score}`;

  isGameRunning = true;
  gamePaused = false;
  obstacleSpeed = 0.1;

  clearInterval(obstacleInterval);
  clearInterval(speedIncreaseInterval);

  player.boundingBox = new THREE.Box3().setFromObject(player);

  obstacles.forEach((obstacle) => {
    if (obstacle.boundingBox) {
      obstacle.boundingBox.setFromObject(obstacle);
    }
  });

  carMovingSound.currentTime = 0;
  carMovingSound.play();

  obstacleInterval = setInterval(() => {
    if (isGameRunning && !gamePaused) {
      createObstacle();
    }
  }, 1000);

  speedIncreaseInterval = setInterval(() => {
    increaseObstacleSpeed();
  }, 5000);
}

document.getElementById("pause-game").addEventListener("click", pauseGame);
document.getElementById("resume-game").addEventListener("click", resumeGame);
document.getElementById("start-button").addEventListener("click", startGame);
document
  .getElementById("restart-button")
  .addEventListener("click", restartGame);
document.getElementById("quit-button").addEventListener("click", quitGame);

init();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
