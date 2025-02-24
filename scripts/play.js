/* scripts/play.js */
function PlaySketch(p) {
  let car;
  let physicsEngine;
  let debug = true;
  let zoomFactor = 2.5;
  let enemies = [];
  const ENEMY_SPAWN_RATE = 10000; // 1000 = 1 seconds
  let lastSpawn = 0;

  p.preload = function() {
    p.carImg = p.loadImage("assets/car.png");
    p.buildingImg = p.loadImage("assets/building.png");
    p.enemyImg = p.loadImage("assets/car.png"); // Add enemy image
  };

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    physicsEngine = new PhysicsEngine();
    generateGenMap(p, mapSize, mapSize);

    window.LoadingScreen.hide();
    if (!window.bgMusic.isPlaying()) {
      window.bgMusic.loop();
    }

    // Start enemy spawner
    window.enemySpawnInterval = setInterval(() => spawnEnemy(p), ENEMY_SPAWN_RATE);
  };

  // Add spawn function
  function spawnEnemy(p) {
    if (!car) return;

    const spawnDistance = 1000;
    const angle = p.random(p.TWO_PI);
    const x = car.position.x + spawnDistance * p.cos(angle);
    const y = car.position.y + spawnDistance * p.sin(angle);

    const enemy = new Enemy(p, x, y, car);
    physicsEngine.add(enemy);
    enemies.push(enemy);
  }

  p.draw = function () {
    p.background(255);

    if (!car) {
      const stats = loadPersistentData().stats;
      car = new Car(p, p.width / 2, p.height / 2, stats);
      physicsEngine.add(car);
    }

    // Update enemies
    enemies = enemies.filter(enemy => {
      if (enemy.removeFromWorld || enemy.healthBar <= 0) {
        physicsEngine.remove(enemy);
        return false;
      }
      return true;
    });

    // Main rendering
    p.push();
    p.translate(p.width / 2, p.height / 2);
    p.scale(zoomFactor);
    p.translate(-car.position.x, -car.position.y);

    drawMap(p, car.position, zoomFactor);
    car.display();

    // Draw enemies
    enemies.forEach(enemy => {
      enemy.update(); // Explicitly update enemies
      enemy.display();
    });

    if (debug) {
      for (let obj of physicsEngine.objects) {
        if (obj.collider && typeof obj.collider.drawOutline === "function") {
          obj.collider.drawOutline();
        }
      }

      let halfWidth = p.width / (2 * zoomFactor);
      let halfHeight = p.height / (2 * zoomFactor);
      let center = car.position;
      let startXTile = Math.floor((center.x - halfWidth) / gridSize);
      let startYTile = Math.floor((center.y - halfHeight) / gridSize);
      let endXTile = Math.ceil((center.x + halfWidth) / gridSize);
      let endYTile = Math.ceil((center.y + halfHeight) / gridSize);
      for (let y = startYTile; y < endYTile; y++) {
        for (let x = startXTile; x < endXTile; x++) {
          if (map[y] && map[y][x] instanceof Building) {
            let building = map[y][x];
            if (building.collider && typeof building.collider.drawOutline === "function") {
              building.collider.drawOutline();
            }
          }
        }
      }
    }
    p.pop();

    // Draw UI elements
    p.push();
    p.fill(255);
    p.textSize(16);

    // Health bar background
    p.fill(50); // Dark gray background
    p.rect(20, 20, 200, 25);

    // Health bar foreground
    p.fill(0, 255, 0); // Bright green for health
    p.rect(20, 20, car.healthBar * 2, 25);

    // Boost meter background
    p.fill(50); // Dark gray background
    p.rect(20, 60, 200, 25);

    // Boost meter foreground
    p.fill(255, 165, 0); // Bright orange for boost
    p.rect(20, 60, car.boostMeter * 2, 25);

    // Labels
    p.fill(255); // White text
    p.text("Health", 20, 18);
    p.text("Boost", 20, 58);

    p.pop();

    physicsEngine.update();
    car.update();
    checkBuildingCollisions(car);
  };

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  p.keyPressed = function() {
    if (p.keyCode === p.ESCAPE) {
      window.bgMusic.stop();
      clearInterval(window.enemySpawnInterval);
      switchSketch(Mode.TITLE);
    }
  };

  // Modified collision check
  function checkBuildingCollisions(obj) {
    const tileX = Math.floor(obj.position.x / gridSize);
    const tileY = Math.floor(obj.position.y / gridSize);
    for (let j = tileY - 1; j <= tileY + 1; j++) {
      for (let i = tileX - 1; i <= tileX + 1; i++) {
        if (map[j] && map[j][i] instanceof Building) {
          let building = map[j][i];
          if (obj.collider.intersects(building.collider)) {
            obj.speed = (-1) * (obj.speed);
            if (!obj.controlDisabled) {
              obj.controlDisabled = true;
              setTimeout(() => {
                obj.controlDisabled = false;
              }, 250);
            }
            return;
          }
        }
      }
    }
  }
}