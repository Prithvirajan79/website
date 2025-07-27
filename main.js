// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10);
scene.add(light);
scene.add(new THREE.AmbientLight(0xaaaaaa));

// Controls
const controls = new THREE.PointerLockControls(camera, document.body);
scene.add(controls.getObject());

// Lock pointer when user clicks
const instructions = document.getElementById('instructions');
instructions.addEventListener('click', () => controls.lock());

controls.addEventListener('lock', () => {
  instructions.style.display = 'none';
});
controls.addEventListener('unlock', () => {
  instructions.style.display = '';
});

// Create flat terrain
const blockSize = 1;
const blockGeometry = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
const blockMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });
const blocks = [];

for (let x = -10; x <= 10; x++) {
  for (let z = -10; z <= 10; z++) {
    const block = new THREE.Mesh(blockGeometry, blockMaterial.clone());
    block.position.set(x, 0, z);
    scene.add(block);
    blocks.push(block);
  }
}

// Movement system
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

document.addEventListener('keydown', (event) => {
  switch (event.code) {
    case 'KeyW': moveForward = true; break;
    case 'KeyS': moveBackward = true; break;
    case 'KeyA': moveLeft = true; break;
    case 'KeyD': moveRight = true; break;
    case 'Space':
      if (canJump) {
        velocity.y += 5;
        canJump = false;
      }
      break;
  }
});

document.addEventListener('keyup', (event) => {
  switch (event.code) {
    case 'KeyW': moveForward = false; break;
    case 'KeyS': moveBackward = false; break;
    case 'KeyA': moveLeft = false; break;
    case 'KeyD': moveRight = false; break;
  }
});

// Animate loop
function animate() {
  requestAnimationFrame(animate);

  const delta = 0.05;

  velocity.x -= velocity.x * 10.0 * delta;
  velocity.z -= velocity.z * 10.0 * delta;
  velocity.y -= 9.8 * 5.0 * delta; // gravity

  direction.z = Number(moveForward) - Number(moveBackward);
  direction.x = Number(moveRight) - Number(moveLeft);
  direction.normalize();

  if (moveForward || moveBackward) velocity.z -= direction.z * 20.0 * delta;
  if (moveLeft || moveRight) velocity.x -= direction.x * 20.0 * delta;

  controls.moveRight(-velocity.x * delta);
  controls.moveForward(-velocity.z * delta);
  controls.getObject().position.y += velocity.y * delta;

  // Prevent falling through floor
  if (controls.getObject().position.y < 2) {
    velocity.y = 0;
    controls.getObject().position.y = 2;
    canJump = true;
  }

  renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
