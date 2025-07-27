let score = 0;
    let gameOver = false;
    const lanes = [-2, 0, 2];
    let laneIndex = 1;
    let velocityZ = 0.2;
    let jumpVelocity = 0;
    let isJumping = false;
    let selectedColor = 'rgba(0, 0, 255, 1)';

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(innerWidth, innerHeight);
    document.body.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 50, 50);
    scene.add(light, new THREE.AmbientLight(0x888888));

    let player;

const loader = new THREE.GLTFLoader();
loader.load('Motorcycle.glb', (gltf) => {
  player = gltf.scene;
  
  player.scale.set(0.015, 0.015, 0.015);  // Adjust as needed
  player.position.set(lanes[laneIndex], 1, 0);
  player.rotation.y = Math.PI; // Face the camera
  player.traverse(obj => {
    if (obj.isMesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
    }
  });
  scene.add(player);
  player.rotation.y=2*Math.PI;
});


    const obstacles = [], coins = [];

    function spawnObstacle() {
      const mesh = new THREE.Mesh(
        
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshToonMaterial({ color:0x000000 })
      );
      mesh.position.set(lanes[Math.floor(Math.random() * 3)], 0.5, -30);
      scene.add(mesh);
      obstacles.push(mesh);
    }

    function spawnCoin() {
      const mesh = new THREE.Mesh(
        new THREE.TorusGeometry(0.3, 0.5, 2),
        new THREE.MeshStandardMaterial({ color: 0xffff00 })
      );
      mesh.position.set(lanes[Math.floor(Math.random() * 3)], 1.5, -400);
      scene.add(mesh);
      coins.push(mesh);
    }

    setInterval(() => {
      if (!gameOver) {
        spawnObstacle();
        if (Math.random() > 0.001) spawnCoin();
      }
    }, 1000);

    document.getElementById('skinSelect').addEventListener('change', (e) => {
      player.material.color.set(e.target.value);
    });

    function moveLeft() { if (laneIndex > 0) laneIndex--; }
    function moveRight() { if (laneIndex < 2) laneIndex++; }
    function jump() {
      if (!isJumping) {
        isJumping = true;
        jumpVelocity = 0.25;

      }
    }

    document.getElementById('leftBtn').onclick = moveLeft;
    document.getElementById('rightBtn').onclick = moveRight;
    document.getElementById('jumpBtn').onclick = jump;
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') moveLeft();
      if (e.key === 'ArrowRight') moveRight();
      if (e.key === 'ArrowUp') jump();
    });

    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const dt = clock.getDelta();
if(player){
      if (!gameOver) {
        player.position.x += (lanes[laneIndex] - player.position.x) * 10 * dt;
        if (isJumping) {
          jumpVelocity -= 0.98 * dt;
          player.position.y += jumpVelocity;
          if (player.position.y <= 1) {
            player.position.y = 1;
            isJumping = false;
          }
        }

        for (let i = obstacles.length - 1; i >= 0; i--) {
          obstacles[i].position.z += velocityZ;
          if (obstacles[i].position.z > 10) {
            scene.remove(obstacles[i]);
            obstacles.splice(i, 1);
          } else if (!isJumping && obstacles[i].position.distanceTo(player.position) < 0.8) {
            document.getElementById('info').innerText = 'Game Over! Final Score: ' + score;
            document.querySelector('.restart').style = 'visibility:visible;width:100vw;height:100vh;z-index:5;background:#000';
            gameOver = true;
          }
        }

        for (let i = coins.length - 1; i >= 0; i--) {
          coins[i].position.z += velocityZ;
          if (coins[i].position.z > 10) {
            scene.remove(coins[i]);
            coins.splice(i, 1);
          } else if (coins[i].position.distanceTo(player.position) < 0.8) {
            scene.remove(coins[i]);
            coins.splice(i, 1);
            score++;
            document.getElementById('info').innerText = 'Score: ' + score;
            document.getElementById('coinSound').play();          }
        }

        velocityZ += dt * 0.005;
      }

      camera.position.set(0, 5, 10);
      camera.lookAt(player.position.x, player.position.y, player.position.z);
      renderer.render(scene, camera);
    }}

    animate();
    window.addEventListener('resize', () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    });