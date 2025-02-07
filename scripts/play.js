// start game logic
function startGame() {
  
  console.log("Play Game clicked");

  
  
  mode = Mode.play;

  if(!canvas) {
    console.log("map");
    generateMap(windowWidth/gridSize,windowHeight/gridSize);
    canvas = true;
  }

  if (!car){
    console.log("car");
    car = new Car(width / 2, height / 2, 50, 30);
  }

  console.log("mode is ", mode);

}

// game logic
function drawPlay() { 
  
  
    drawMap();
    car.update();
    car.display();
  
}
