/* scripts/play.js */
function PlaySketch(p) {
  let car;
  let physicsEngine; // Will manage dynamic objects (like the car) only.
  let debug = true;
  let zoomFactor = 2.5;

  p.preload = function() {
    p.carImg = p.loadImage("assets/car.png");
    p.buildingImg = p.loadImage("assets/building.png");
    // Other assets (e.g. bgMusic) assumed loaded globally.
  };

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    physicsEngine = new PhysicsEngine();
    // Generate the full map.
    generateGenMap(p, mapSize, mapSize);
    // (Note: We no longer add all Building objects to the physics engine.)
    window.LoadingScreen.hide();
    if (!window.bgMusic.isPlaying()){
      window.bgMusic.loop();
    }
  };

  p.draw = function () {
    p.background(255);
    // Create the car at the center initially.
    if (!car) {
      const stats = loadPersistentData().stats;
      let startX = p.width / 2;
      let startY = p.height / 2;
      car = new Car(p, startX, startY, stats);
      physicsEngine.add(car);
      console.log("PlaySketch: Created Car.");
    }
    // Apply camera transforms so the car remains centered.
    p.push();
    p.translate(p.width / 2, p.height / 2);
    p.scale(zoomFactor);
    p.translate(-car.position.x, -car.position.y);
    // Draw only the visible portion of the map.
    drawMap(p, car.position, zoomFactor);
    car.display();
    if (debug) {
      for (let obj of physicsEngine.objects) {
        if (obj.collider && typeof obj.collider.drawOutline === "function") {
          obj.collider.drawOutline();
        }
      }
    }
    p.pop();
    // Update only dynamic objects.
    physicsEngine.update();
    car.update();
    // Perform manual collision check with nearby Building tiles.
    checkBuildingCollisions(car);
  };

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    console.log("PlaySketch: Window resized.");
  };

  p.keyPressed = function() {
    if (p.keyCode === p.ESCAPE) {
      console.log("play music stop");
      window.bgMusic.stop();
      switchSketch(Mode.TITLE);
    }
  };
}

function checkBuildingCollisions(car) {
  // Determine which grid cells to check (e.g., a 3x3 neighborhood)
  const tileX = Math.floor(car.position.x / gridSize);
  const tileY = Math.floor(car.position.y / gridSize);

  for (let j = tileY - 1; j <= tileY + 1; j++) {
    for (let i = tileX - 1; i <= tileX + 1; i++) {
      if (map[j] && map[j][i] instanceof Building) {
        let building = map[j][i];
        // Use the collider's intersection test
        if (car.collider.intersects(building.collider)) {
          // Handle collision response:
          car.speed = -Math.abs(car.speed);
          if (!car.controlDisabled) {
            car.controlDisabled = true;
            setTimeout(() => {
              car.controlDisabled = false;
            }, 250);
          }
          // Optionally, you might break after detecting a collision.
          return;
        }
      }
    }
  }
}
