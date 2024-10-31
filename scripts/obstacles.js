// scratch component
import { scene } from "./game.js"; // Import shared scene from game.js

let obstacles = [];

export function createObstacle() {
  const geometry = new THREE.BoxGeometry(1, 1, 2);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const obstacle = new THREE.Mesh(geometry, material);
  obstacle.position.y = 1;
  obstacle.position.x = (Math.random() - 0.5) * 8; // Random X position
  obstacle.position.z = -20; // Start behind the camera
  scene.add(obstacle);
  obstacles.push(obstacle);
}

export function moveObstacles(speed) {
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const obstacle = obstacles[i];
    obstacle.position.z += speed;

    // Remove obstacle if it's out of view
    if (obstacle.position.z > 10) {
      scene.remove(obstacle);
      obstacles.splice(i, 1);
    }
  }
}
