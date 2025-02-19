// scripts/play.js
function PlaySketch(p) {
  let newCanvas = false;
  let car;
  p.preload = function () {
    loadSound(p);
  }


  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    generateGenMap(p, 500, 500);
  };

  p.draw = function () {
    if(!bgMusic.isPlaying()){
      console.log
      window.bgMusic.loop();
    }
    if (!newCanvas) {
      p.createCanvas(p.windowWidth, p.windowHeight);
      newCanvas = true;
    }
    p.background(255);
    if (!car) {
      // Load the stats from persistent storage before creating the car.
      const stats = loadPersistentData().stats;
      car = new Car(p, p.width / 2, p.height / 2, stats);
    }
    drawMap(p,car);
    car.update();
    car.display();
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  p.keyPressed = function () {
    if (p.keyCode === p.ESCAPE) {
      window.bgMusic.stop();
      window.bgMusic.playMode('restart');
      switchSketch(Mode.TITLE);
    }
  };
}
