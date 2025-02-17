// scripts/play.js
function PlaySketch(p) {
  let car;
  let ui;
  let canvas;

  p.setup = function () {
    canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    generateDevMap(p, Math.floor(p.windowWidth / gridSize), Math.floor(p.windowHeight / gridSize));
    
    const stats = loadPersistentData().stats;
    car = new Car(p, p.width/2, p.height/2, stats);
    ui = new UIManager(p, car);
  };

  p.draw = function () {
    p.background(255);
    drawMap(p);
    
    ui.update();
    car.update();
    car.display();
    
    ui.display();
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  p.keyPressed = function () {
    if (p.keyCode === p.ESCAPE) {
      ui.healthPlus.remove();
      ui.healthMinus.remove();
      switchSketch(Mode.TITLE);
    }
  };
}