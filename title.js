let buttons = [];
let bgImage;
let titleImg ;
let mode = -1;
let car;
var imgCar;
var cars = [];

const Mode = {
  title: -1,
  play: 1,
  garage: 2,
  settings: 3,
  exit: 4,
};

function preload() {
  bgImage = loadImage("https://i.imgur.com/hnKdHwZ.jpeg");
  imgTitle = new Image();
  imgTitle.src = "graphics/title.png";

  imgCar = new Image();
  imgCar.src = "graphics/redStripe.png";
  cars[0] = imgCar;
  imgCar = new Image();
  imgCar.src = "graphics/orangeStripe.png";
  cars[1] = imgCar;
  imgCar = new Image();
  imgCar.src = "graphics/yellowStripe.png";
  cars[2] = imgCar;
  //can continue to add options for preload if car images
}
function windowResized() {
  //stops the infinite drawing of buttons on window resize
  buttons = []; //prob memory leak

  noLoop();
  drawTitle();
  loop();
  redraw();
}

function setup() {
    /////////////////////////

    drawTitle();
    generateDevMap(windowWidth/gridSize,windowHeight/gridSize);

    /////////////////////////
  
    //generateRandomMap(96,54);    //to generate a "random" map
    
}

function draw() {
    // ESC key exit to main menu available at all times
    if (keyIsDown(27)) {
      mode = Mode.title;
    } 
    // In the case of return to title, despawn car and reset newCanvas to false
    if (mode == Mode.title) {
      car = null;
      newCanvas = false;
    }

  switch (mode) {
    case -1:  // title
      drawTitle();
      break;
    case 1:   // play game
      drawPlay();
      break;
    case 2:
      drawGarage();
      break;
    case 3:
      drawSettings();
      break;
    case 4:
      remove();
      break;
    default:
      break;
  }
}

function drawTitle() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);

  if (bgImage) {
    background(bgImage);
  } else {
    background(30, 30, 30);
  }
  // title
  if (imgTitle){
    drawingContext.drawImage(imgTitle, windowWidth/10, windowHeight/12, windowWidth/1.2, windowHeight/2.6);
  }

  buttons.push(
    new Button("Play Game", width / 2, height -height* 0.45, () => startGame())
  );
  buttons.push(
    new Button("Garage", width / 2, height -height* 0.38, () => showGarage())
  );
  buttons.push(
    new Button("Leaderboard", width / 2, height -height* 0.31, () =>
      showLeaderboard()
    )
  );
  buttons.push(
    new Button("Settings", width / 2, height -height* 0.24 , () => showSettings())
  );
  buttons.push(
    new Button("Exit", width / 2, height -height* 0.17, () => exitGame())
  );
  buttons.push(
    new Button("login", width /1.1, height -height* 0.95, () => login())
  );
  buttons.push(
    new Button("Sign Up", width /1.1, height -height* 0.88, () => signUp()) // Below the Login button
  );


  // how to interact with buttons
  for (let button of buttons) {
    button.display();
  }

  
}

function drawGarage() {
  return;
}

function drawSettings() {
  return;
}

function startGame() {
  console.log("Play Game clicked");
  mode = Mode.play;
  console.log("mode is ", mode);
}

function showGarage() {
  console.log("Garage clicked");
  reset();
}

function showSettings() {
  console.log("Settings clicked");
}

function showLeaderboard() {
  console.log("Leaderboard clicked");
}

function exitGame() {
  console.log("Exit clicked");
}
