// game logic
function drawPlay() {

  if(!newCanvas) {
    createCanvas(windowWidth, windowHeight);
    generateMap(windowWidth/gridSize,windowHeight/gridSize);
    newCanvas = true;
  }

  if (!car){
    car = new Car(width / 2, height / 2, 50, 30);
  }
    
    console.log(`${car.acceleration}, ${car.maxSpeed}`);
    //background(230);
    drawMap();
    car.update();
    car.display();
  
}
