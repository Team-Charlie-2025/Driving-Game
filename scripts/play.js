/* scripts/play.js */
function PlaySketch(p) {
  let newCanvas = false;
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
    // Add all Building objects to the physics engine for collision.
    for (let row of map) {
      for (let cell of row) {
        if (cell instanceof Building) {
          physicsEngine.add(cell);
        }
      }
    }
    window.LoadingScreen.hide();
    if (!window.bgMusic.isPlaying()){
      window.bgMusic.loop();
    }
  };

  p.draw = function () {
    p.background(255);
    if (!car) {
      const stats = loadPersistentData().stats;
      // Start the car roughly at the center of the world.
      let startX = p.width / 2;
      let startY = p.height / 2;
      car = new Car(p, startX, startY, stats);
      physicsEngine.add(car);
      console.log("PlaySketch: Created Car.");
    }
    // Camera transformation: center on the car.
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
    physicsEngine.update();
    car.update();
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
