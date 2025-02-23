/* scripts/play.js */
function PlaySketch(p) {
  let car;
  let physicsEngine;
  let debug = true;
  let zoomFactor = 2.5;

  p.preload = function() {
    p.carImg = p.loadImage("assets/car.png");
    p.buildingImg = p.loadImage("assets/building.png");
    
  };

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    physicsEngine = new PhysicsEngine();
    
    generateGenMap(p, mapSize, mapSize);
    
    window.LoadingScreen.hide();
    if (!window.bgMusic.isPlaying()){
      window.bgMusic.loop();
    }
  };

  p.draw = function () {
    p.background(255);
    
    if (!car) {
      const stats = loadPersistentData().stats;
      let startX = p.width / 2;
      let startY = p.height / 2;
      car = new Car(p, startX, startY, stats);
      physicsEngine.add(car);
      console.log("PlaySketch: Created Car.");
    }
    
    p.push();
    p.translate(p.width / 2, p.height / 2);
    p.scale(zoomFactor);
    p.translate(-car.position.x, -car.position.y);
    
    drawMap(p, car.position, zoomFactor);
    car.display();
    
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
    // only updates objects that move
    physicsEngine.update();
    car.update();
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

// checks nearby collision instead of all collisions every draw phase
function checkBuildingCollisions(car) {
  const tileX = Math.floor(car.position.x / gridSize);
  const tileY = Math.floor(car.position.y / gridSize);
  for (let j = tileY - 1; j <= tileY + 1; j++) {
    for (let i = tileX - 1; i <= tileX + 1; i++) {
      if (map[j] && map[j][i] instanceof Building) {
        let building = map[j][i];
        // collided with building logic
        if (car.collider.intersects(building.collider)) {
          car.speed = (-.5)*Math.abs(car.speed);
          if (!car.controlDisabled) {
            car.controlDisabled = true;
            setTimeout(() => {
              car.controlDisabled = false;
            }, 250);
          }
          return;
        }
        // car colliding with enemy for later
        // if (car.collider.insersects(enemy.collider)){
        //   // take damage, adjust movement
        // }
      }
    }
  }
}
