function PlaySketch(p) {
  let newCanvas = false;
  let car;
  let physicsEngine;
  let mapRows, mapCols;
  let debug = true;
  let zoomFactor = 2.5;

  p.preload = function() {
    loadSound(p);
    p.carImg = p.loadImage("assets/car.png");
    p.buildingImg = p.loadImage("assets/building.png");
  };

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    physicsEngine = new PhysicsEngine();
    mapRows = Math.floor(p.windowHeight / gridSize);
    mapCols = Math.floor(p.windowWidth / gridSize);
    
    generateDevMap(p, mapRows, mapCols, p.buildingImg);
    
    // physics from building class
    for (let row of map) {
      for (let cell of row) {
        if (cell instanceof Building) {
          physicsEngine.add(cell);
        }
      }
    }
  };

  p.draw = function() {
    if (!bgMusic.isPlaying()) {
      bgMusic.loop();
    }
    if (!newCanvas) {
      p.createCanvas(p.windowWidth, p.windowHeight);
      newCanvas = true;
    }

    p.background(200); 

    if (!car) {
      const stats = loadPersistentData().stats;
      let startX = p.width - 500;
      let startY = p.height - 500;
      car = new Car(p, startX, startY, stats, p.carImg);
      physicsEngine.add(car);
      console.log("PlaySketch: Created Car.");
    }
    car.update();
    physicsEngine.update();
    p.push();
    p.translate(p.width / 2, p.height / 2);
    // zoom in
    p.scale(zoomFactor);
    p.translate(-car.position.x, -car.position.y);
    drawMap(p);
    car.display();
    if (debug) {
      for (let obj of physicsEngine.objects) {
        if (obj.collider && typeof obj.collider.drawOutline === "function") {
          obj.collider.drawOutline();
        }
      }
    }
    p.pop();
  };

  p.windowResized = function() {
    p.scale(p.windowWidth, p.windowHeight);
    console.log("PlaySketch: Window resized.");
  };

  p.keyPressed = function() {
    if (p.keyCode === p.ESCAPE) {
      window.bgMusic.stop();
      window.bgMusic.playMode("restart");
      switchSketch(Mode.TITLE);
    }
  };
}