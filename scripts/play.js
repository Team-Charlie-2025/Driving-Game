// scripts/play.js
function PlaySketch(p) {
  let newCanvas = false;
  let car;
  let bgMusic;

  p.preload = function() {
    if (!bgMusic) {
      bgMusic = p.loadSound('sound/themeOption.mp3' );
      bgMusic.setVolume(0.05); // Set volume to level (change to loacal storage var to adjust by user)
      console.log("Music loaded");
    }
  };

  p.setup = function () {
    bgMusic.loop();
    p.createCanvas(p.windowWidth, p.windowHeight);
    generateDevMap(p, Math.floor(p.windowWidth / gridSize), Math.floor(p.windowHeight / gridSize));
  };

  p.draw = function () {
    if (!newCanvas) {
      p.createCanvas(p.windowWidth, p.windowHeight);
      newCanvas = true;
    }
    p.background(255);
    drawMap(p);
    if (!car) {
      // Load the stats from persistent storage before creating the car.
      const stats = loadPersistentData().stats;
      car = new Car(p, p.width / 2, p.height / 2, stats);
    }
    car.update();
    car.display();
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  p.keyPressed = function () {
    if (p.keyCode === p.ESCAPE) {
      switchSketch(Mode.TITLE);
    }
  };
}
