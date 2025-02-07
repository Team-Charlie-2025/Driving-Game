let buttons = [];
let bgImage;
let titleImg ;
let mode = -1;
let car;

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
  imgTitle = new Image();
  imgTitle.src = "graphics/title.png";
}

function setup() {
  createCanvas(1920, 1080);
  textAlign(CENTER, CENTER);
  textFont("Comic Sans MS");
  //generateRandomMap(96,54);    //to generate a "random" map
  generateMap(1920/gridSize,1080/gridSize);  // Generates the 
  car = new Car(width / 2, height / 2, 50, 30);
  // creates buttons from button class /defined
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
}

function draw() {
    if (keyIsDown(27)) mode = Mode.title;
  switch (mode) {
    case -1:
      drawTitle();
      break;
    case 1:
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
  if (bgImage) {
    background(bgImage);
  } else {
    background(30, 30, 30);
  }
  // title
  if (imgTitle){
    drawingContext.drawImage(imgTitle, 280, 50, 1400, 350);
  }

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
