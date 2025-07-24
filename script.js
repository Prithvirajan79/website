let scene, camera, renderer, controls;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let photoMeshes = [];

init();
animate();

function init() {
  // Scene & Camera
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222222);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // soft global light
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 0.8);
spotLight.position.set(0, 10, 0);
spotLight.angle = Math.PI / 4;
spotLight.penumbra = 0.2;
spotLight.castShadow = true;
scene.add(spotLight);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // PointerLock Controls
  controls = new THREE.PointerLockControls(camera, document.body);

  const instructions = document.getElementById('instructions');
  instructions.addEventListener('click', () => controls.lock());

  controls.addEventListener('lock', () => instructions.style.display = 'none');
  controls.addEventListener('unlock', () => instructions.style.display = '');

  scene.add(controls.getObject());

  // Floor
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshBasicMaterial({ color: 0x333333 })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // Load images
 const loader = new THREE.TextureLoader();
const photoMeshes = [];

// 💡 Add lighting
const ambientLightt = new THREE.AmbientLight(0xffffff, 0.4); // soft overall light
scene.add(ambientLightt);

const spotLightt = new THREE.SpotLight(0xffffff, 0.8);
spotLightt.position.set(0, 10, 0);
spotLightt.angle = Math.PI / 4;
spotLightt.penumbra = 0.2;
scene.add(spotLightt);

// 📸 Wall photo data
const wallPhotos = [
  {
    side: 'front',
    z: -5, rotY: 0,
    images: [
      { url: 'https://plus.unsplash.com/premium_photo-1676496046182-356a6a0ed002?q=80&w=876&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', caption: 'Mountain' },
      { url: 'https://plus.unsplash.com/premium_photo-1676496046182-356a6a0ed002?q=80&w=876&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', caption: 'River' },
      { url: 'https://plus.unsplash.com/premium_photo-1676496046182-356a6a0ed002?q=80&w=876&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', caption: 'Forest' }
    ]
  },
  {
    side: 'back',
    z: 5, rotY: Math.PI,
    images: [
      { url: 'https://plus.unsplash.com/premium_photo-1676496046182-356a6a0ed002?q=80&w=876&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', caption: 'City Night' },
      { url: 'https://plus.unsplash.com/premium_photo-1676496046182-356a6a0ed002?q=80&w=876&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', caption: 'Bridge' },
      { url: 'https://plus.unsplash.com/premium_photo-1676496046182-356a6a0ed002?q=80&w=876&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', caption: 'Skyline' }
    ]
  },
  {
    side: 'left',
    x: -5, rotY: Math.PI / 2,
    images: [
      { url: 'https://plus.unsplash.com/premium_photo-1676496046182-356a6a0ed002?q=80&w=876&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', caption: 'Desert' },
      { url: 'https://plus.unsplash.com/premium_photo-1676496046182-356a6a0ed002?q=80&w=876&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', caption: 'Hills' },
      { url: 'https://plus.unsplash.com/premium_photo-1676496046182-356a6a0ed002?q=80&w=876&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', caption: 'Canyon' }
    ]
  },
  {
    side: 'right',
    x: 5, rotY: -Math.PI / 2,
    images: [
      { url: 'https://plus.unsplash.com/premium_photo-1676496046182-356a6a0ed002?q=80&w=876&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', caption: 'Beach' },
      { url: 'https://plus.unsplash.com/premium_photo-1676496046182-356a6a0ed002?q=80&w=876&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', caption: 'Waves' },
      { url: 'https://plus.unsplash.com/premium_photo-1676496046182-356a6a0ed002?q=80&w=876&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', caption: 'Sunset' }
    ]
  }
];

// 🧱 Add images to scene
wallPhotos.forEach(({ side, x = 0, z = 0, rotY, images }) => {
  images.forEach((img, i) => {
    loader.load(img.url, (texture) => {
      const geo = new THREE.PlaneGeometry(3, 2);
      const mat = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(geo, mat);

      // position across the wall
      const spacing = 3.5;
      let posX = 0, posZ = 0;
      if (side === 'front' || side === 'back') {
        posX = (i - 1) * spacing;
        posZ = z;
      } else {
        posX = x;
        posZ = (i - 1) * spacing;
      }

      mesh.position.set(posX, 0.5, posZ);
      mesh.rotation.y = rotY;
      mesh.userData = { caption: img.caption, textureURL: img.url };
      scene.add(mesh);
      photoMeshes.push(mesh);
    });
  });
});


  // Touch Look
  let touchX = 0, touchY = 0;
  document.addEventListener('touchstart', e => {
    if (e.touches.length === 1) {
      touchX = e.touches[0].clientX;
      touchY = e.touches[0].clientY;
    }
  });
  document.addEventListener('touchmove', e => {
    if (e.touches.length === 1) {
      const dx = e.touches[0].clientX - touchX;
      const dy = e.touches[0].clientY - touchY;
      camera.rotation.y -= dx * 0.002;
      camera.rotation.x -= dy * 0.002;
      camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
      touchX = e.touches[0].clientX;
      touchY = e.touches[0].clientY;
    }
  });

  // Keyboard movement
  document.addEventListener('keydown', e => {
    if (e.code === 'KeyW') moveForward = true;
    if (e.code === 'KeyS') moveBackward = true;
    if (e.code === 'KeyA') moveLeft = true;
    if (e.code === 'KeyD') moveRight = true;
  });
  document.addEventListener('keyup', e => {
    if (e.code === 'KeyW') moveForward = false;
    if (e.code === 'KeyS') moveBackward = false;
    if (e.code === 'KeyA') moveLeft = false;
    if (e.code === 'KeyD') moveRight = false;
  });

  // Button Controls (mobile)
  setupTouchControls();

  // Click handler
  window.addEventListener('click', onClick);

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function setupTouchControls() {
  const bind = (id, press, release) => {
    const btn = document.getElementById(id);
    btn?.addEventListener('touchstart', e => { e.preventDefault(); press(); });
    btn?.addEventListener('touchend', e => { e.preventDefault(); release(); });
    btn?.addEventListener('mousedown', press);
    btn?.addEventListener('mouseup', release);
    btn?.addEventListener('mouseleave', release);
  };

  bind('up', () => moveForward = true, () => moveForward = false);
  bind('down', () => moveBackward = true, () => moveBackward = false);
  bind('left', () => moveLeft = true, () => moveLeft = false);
  bind('right', () => moveRight = true, () => moveRight = false);
}

function onClick(event) {
  if (!controls.isLocked) return;

  raycaster.setFromCamera({ x: 0, y: 0 }, camera);
  const intersects = raycaster.intersectObjects(photoMeshes);
  if (intersects.length > 0) {
    const clicked = intersects[0].object;
    showPhoto(clicked.userData.textureURL, clicked.userData.caption);
  }
}

function showPhoto(url, caption) {
  let overlay = document.getElementById('photoOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'photoOverlay';
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(0,0,0,0.9)';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '10';
    overlay.innerHTML = `
      <img id="overlayImg" style="max-width:90%; max-height:80%;" />
      <p id="overlayCaption" style="color:white; font-size:1.2em; margin-top:10px;"></p>
    `;
    overlay.addEventListener('click', () => {
      overlay.style.display = 'none';
    });
    document.body.appendChild(overlay);
  }

  document.getElementById('overlayImg').src = url;
  document.getElementById('overlayCaption').textContent = caption;
  overlay.style.display = 'flex';
}

function animate() {
  requestAnimationFrame(animate);

  const delta = 0.1;
  velocity.set(0, 0, 0);

  if (moveForward) velocity.z -= delta;
  if (moveBackward) velocity.z += delta;
  if (moveLeft) velocity.x -= delta;
  if (moveRight) velocity.x += delta;

  controls.moveRight(velocity.x);
  controls.moveForward(velocity.z);

  renderer.render(scene, camera);
}
