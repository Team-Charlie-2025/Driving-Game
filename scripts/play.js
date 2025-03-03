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
    loadSound(p);
    p.carImg = p.loadImage("assets/car.png");
    p.buildingImg = p.loadImage("assets/building.png");
    p.enemyImg = p.loadImage("assets/police+car.png"); // Add enemy image
  };

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    physicsEngine = new PhysicsEngine();
    generateGenMap(p, mapSize, mapSize);
    window.isGameOver = false;

    window.LoadingScreen.hide();
    if (!window.bgMusic.isPlaying()) {
      window.bgMusic.loop();
    }

    // Start enemy spawner
    window.enemySpawnInterval = setInterval(() => spawnEnemy(p), ENEMY_SPAWN_RATE);
    

    p.showGameOverScreen = function () {
        p.push();
        p.fill(150, 0, 0, 180); // Semi-transparent red overlay
        p.rect(0, 0, p.width, p.height);
        
        p.fill(255);
        p.textSize(50);
        p.textAlign(p.CENTER, p.CENTER);
        p.text("GAME OVER", p.width / 2, p.height / 3);

        p.textSize(30);
        p.fill(255);
        p.text("Press R to Restart", p.width / 2, p.height / 2);
        p.text("Press M for Main Menu", p.width / 2, p.height / 1.5);
        p.pop();
    };
  };

  // Add spawn function
  function spawnEnemy(p) {
    if (!car || window.isGameOver) return;

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

    p.background(255);

    if (window.isGameOver) {
      p.push();
      p.translate(p.width / 2, p.height / 2);
      p.scale(zoomFactor);
      p.translate(-car.position.x, -car.position.y);
      drawMap(p, car.position, zoomFactor);
      car.display();
      enemies.forEach(enemy => enemy.display());
      p.pop();
      p.fill(150, 0, 0, 180); // Semi-transparent red tint overlay
      p.rect(0, 0, p.width, p.height);
      p.pop();
      p.showGameOverScreen();
      return;
    }

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
      checkBuildingCollisions(enemy);
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
    checkCarCollisions(car, enemies);
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
    if (window.isGameOver) {
      if (p.keyIsDown(82)) { // 'R' key
        window.isGameOver = false;

        // Delete car
        if (car) {
          physicsEngine.remove(car);
          car = null;
        }

        // Delete enemies
        enemies = [];

        // Reset physics engine
        physicsEngine = new PhysicsEngine();

        // Create a new car
        const stats = loadPersistentData().stats;
        car = new Car(p, p.width / 2, p.height / 2, stats);
        physicsEngine.add(car);
      }
      if (p.keyIsDown(77)) { // 'M' key
        window.bgMusic.stop();
        clearInterval(window.enemySpawnInterval);
        switchSketch(Mode.TITLE); // Go back to main menu
      }
    }
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
            if (obj.velocity) {  //reverse velocity (enemy & player)
              obj.velocity.mult(-1);
          }
          if (obj.speed !== undefined) {  //reverse speed if it exists (player)
              obj.speed = (-1) * obj.speed;
          }
          //apply small knockback to prevent enemies getting stuck
          let knockbackForce = 5;  
          let knockbackVector = p5.Vector.sub(obj.position, building.position);
          knockbackVector.setMag(knockbackForce);
          obj.position.add(knockbackVector);

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

  //enemy collision check
  function checkCarCollisions(car, enemies) {
    for (let enemy of enemies) {
      if (car.collider.intersects(enemy.collider)) {
        car.healthBar = Math.max(0, car.healthBar - enemy.attackDamage);

        //use relative velocity to scale knockback
        let relativeVelocity = p5.Vector.sub(car.velocity, enemy.velocity).mag();
        let knockbackForce = p.map(relativeVelocity, 0, 10, 5, 20); //adjust scaling
  
        //apply knockback in opposite directions
        let knockbackVector = p5.Vector.sub(car.position, enemy.position);
        knockbackVector.setMag(knockbackForce);
  
        car.position.add(knockbackVector);
        enemy.position.sub(knockbackVector); //push enemy slightly

        //temp disable enemy movement to prevent rapid collisions
        if (!enemy.controlDisabled) {
          enemy.controlDisabled = true;
          setTimeout(() => {
              enemy.controlDisabled = false;
          }, 750);
        }
      }
    }
  }
} 