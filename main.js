let buttons = [];
let buttonsTempBool = false;
let bgImage;
let mode = -1;
let canvas = false;
let car = null;

const Mode = {
  title: -1,
  play: 1,
  garage: 2,
  settings: 3,
  exit: 4,
  login: 5,
  signUp: 6,
};

function preload() {
  bgImage = loadImage("https://i.imgur.com/hnKdHwZ.jpeg");
}

/** 
function windowResized() {
  // needs work 
  // function automatically reacts to browser resizing
  
  resizeCanvas(windowWidth, windowHeight);
  
  
}
**/


function setup() {

  /////////////////////////

  createCanvas(windowWidth, windowHeight);
  drawTitle();

  /////////////////////////

  //generateRandomMap(96,54);    //to generate a "random" map
  
}

 
function draw() {
    // ESC key exit to main menu available at all times
    if (keyIsDown(27)) {
      mode = Mode.title;
      car = null;
      canvas = false;
    } 
    // In the case of return to title, despawn car and reset newCanvas to false
    if (mode == Mode.title) {
      
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
    case 5:
      drawLogin();
      break;
    default:
    case 6:
      drawSignUp();
      break;
  }
}

function exitGame() {
  console.log("Exit clicked");
}

