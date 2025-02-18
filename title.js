let buttons = [];
let bgImage;
let mode = -1;
let newCanvas = false;
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

function windowResized() {
  // needs work 
  noLoop();
  drawTitle();
  loop();
  redraw();
}

function setup() {

  /////////////////////////

  drawTitle();

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
    case 5:
      drawLogin();
      break;
    default:
    case 6:
      drawSignUp();
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
  fill(255);
  textSize(48);
  textFont("Comic Sans MS");
  text("Swiggle", width / 2, 150);

  buttons.push(
    new Button("Play Game", width / 2, height / 2 + 200, () => startGame())
  );
  buttons.push(
    new Button("Garage", width / 2, height / 2 + 270, () => showGarage())
  );
  buttons.push(
    new Button("Leaderboard", width / 2, height / 2 + 410, () =>
      showLeaderboard()
    )
  );
  buttons.push(
    new Button("Settings", width / 2, height / 2 + 340, () => showSettings())
  );
  buttons.push(
    new Button("Exit", width / 2, height / 2 + 480, () => exitGame())
  );
  buttons.push(
    new Button("login", width - 150, 50, () => login())
  );
  buttons.push(
    new Button("Sign Up", width - 150, 120, () => signUp()) // Below the Login button
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
function login() {
  console.log("Login clicked");
  mode = Mode.login;
  console.log("mode is ", mode);
}
function signUp() {
  mode = Mode.signUp;
  console.log("Sign Up clicked");
}
