// scratch component
import { scene, camera } from "./game.js"; // Import shared scene and camera from game.js

let player; // Declare the player variable at the module level

export function createPlayer() {
  const geometry = new THREE.BoxGeometry(1, 1, 2); // Adjust dimensions if necessary
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  player = new THREE.Mesh(geometry, material);
  //   player.position.y = 1; // Set the player's initial position
  scene.add(player); // Add the player to the scene

  return player; // Return the player object
}

// Movement Controls
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

// Move Player Function
export function movePlayer() {
  if (moveLeft && player.position.x > -4) player.position.x -= 0.1;
  if (moveRight && player.position.x < 4) player.position.x += 0.1;
}
