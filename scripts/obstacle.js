import * as THREE from "https://unpkg.com/three@0.136.0/build/three.module.js";

let obstacles = [];

export function createObstacle(scene) {
  const obstacle = new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.5, 0.5),
    new THREE.MeshStandardMaterial({ color: 0xffa500 })
  );
  obstacle.position.set((Math.random() - 0.5) * 8, 0.25, -20);
  scene.add(obstacle);
  obstacles.push(obstacle);
}

export function moveObstacles(scene) {
  obstacles.forEach((ob, index) => {
    ob.position.z += 0.2;
    if (ob.position.z > 10) {
      scene.remove(ob);
      obstacles.splice(index, 1);
    }
  });
}

export function updateCollision(player, scene, onCollision) {
  const playerBox = new THREE.Box3().setFromObject(player);

  for (let ob of obstacles) {
    const obBox = new THREE.Box3().setFromObject(ob);
    if (playerBox.intersectsBox(obBox)) {
      onCollision();
      break;
    }
  }
}

export function resetObstacles(scene) {
  obstacles.forEach((ob) => scene.remove(ob));
  obstacles = [];
}
