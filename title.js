let buttons = [];
let bgImage;
let mode = -1;
let car;

const Mode = {
  title: -1,
  play: 1,
  garage: 2,
  settings: 3,
  exit: 4,
};

function preload() {
  bgImage = loadImage("https://i.imgur.com/hnKdHwZ.jpeg");
}

function setup() {
  createCanvas(1920, 1080);
  textAlign(CENTER, CENTER);
  textFont("Comic Sans MS");
  //generateRandomMap(96,54);    //to generate a "random" map
  generateMap(96,54);  // Generates the 
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
    default:
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
  fill(255);
  textSize(48);
  textFont("Comic Sans MS");
  text("Drive to Survive", width / 2, 150);

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
