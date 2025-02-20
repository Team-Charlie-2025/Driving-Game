// scripts/play.js
function PlaySketch(p) {
  let newCanvas = false;
  let car;
  let physicsEngine;
  let mapRows, mapCols;

  p.preload = function() {
    loadSound(p);
    p.carImg = p.loadImage("assets/car.png");
    p.buildingImg = p.loadImage("assets/building.png");
    console.log("PlaySketch: Loaded assets (carImg and buildingImg).");
  };

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    physicsEngine = new PhysicsEngine();
    mapRows = Math.floor(p.windowHeight / gridSize);
    mapCols = Math.floor(p.windowWidth / gridSize);
    
    generateDevMap(p, mapRows, mapCols, p.buildingImg);
    console.log(`PlaySketch: Generated map (${mapRows} rows x ${mapCols} cols).`);
    
    for (let row of map) {
      for (let cell of row) {
        if (cell instanceof Building) {
          physicsEngine.add(cell);
        }
      }
    }
    console.log("PlaySketch: Added all Building objects to PhysicsEngine.");
  };

  p.draw = function() {
    if (!bgMusic.isPlaying()) {
      window.bgMusic.loop();
    }
    if (!newCanvas) {
      p.createCanvas(p.windowWidth, p.windowHeight);
      newCanvas = true;
    }

    drawMap(p);
    if (!car) {
      const stats = loadPersistentData().stats;

      let startX = p.width - 500;
      let startY = p.height - 500;
      car = new Car(p, startX, startY, stats, p.carImg);
      physicsEngine.add(car);
      console.log("PlaySketch: Created Car.");
    }
    car.update();
    car.display();
    physicsEngine.update();
    
  };

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
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
