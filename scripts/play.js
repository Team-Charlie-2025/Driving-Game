// scripts/play.js
function PlaySketch(p) {
  let newCanvas = false;
  let car;
  p.preload = function () {
    loadSound(p);
  }


  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);

    generateGenMap(p, mapSize, mapSize);
  };
  // stop loading
  window.LoadingScreen.hide();

    if(!bgMusic.isPlaying()){
      window.bgMusic.loop();
    }
  };

  p.draw = function () {
    
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
      //window.bgMusic.playMode('restart');
      console.log("play music stop");
      window.bgMusic.stop();
      switchSketch(Mode.TITLE);
    }
  };
}
