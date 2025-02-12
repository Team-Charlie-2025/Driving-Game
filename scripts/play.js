// game logic
function drawPlay() {

  if(!newCanvas) {
    createCanvas(windowWidth, windowHeight);
    generateDevMap(windowWidth/gridSize,windowHeight/gridSize);
    newCanvas = true;
  }

  if (!car){
    car = new Car(width / 2, height / 2);
  }
    
  console.log("test_3");
  drawMap();
  car.update();
  car.display();
  
}
