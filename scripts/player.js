import * as THREE from "https://unpkg.com/three@0.136.0/build/three.module.js";

export function createPlayer(scene) {
  const carGroup = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.5, 3),
    new THREE.MeshStandardMaterial({ color: 0xff0000 })
  );
  body.position.y = 0.5;
  carGroup.add(body);

  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.3, 1.5),
    new THREE.MeshStandardMaterial({ color: 0x880000 })
  );
  roof.position.set(0, 0.8, 0);
  carGroup.add(roof);

  const wheels = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.3, 0.2, 12),
    new THREE.MeshStandardMaterial({ color: 0x000000 })
  );
  wheels.rotation.z = Math.PI / 2;

  [
    [-0.7, 0.2, 1.2],
    [0.7, 0.2, 1.2],
    [-0.7, 0.2, -1.2],
    [0.7, 0.2, -1.2],
  ].forEach(([x, y, z]) => {
    const w = wheels.clone();
    w.position.set(x, y, z);
    carGroup.add(w);
  });

  carGroup.position.set(0, 0.5, 0);
  scene.add(carGroup);
  return carGroup;
}
