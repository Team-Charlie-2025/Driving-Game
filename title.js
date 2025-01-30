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
<<<<<<< Updated upstream
    //Background image will need changed to map of game when complete
    bgImage = loadImage("https://i.imgur.com/hnKdHwZ.jpeg");
}

function setup() {
    createCanvas(1920, 1080);
    textAlign(CENTER, CENTER);
    textFont("Ariel");

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
    if (bgImage) {
        background(bgImage);
    } else {
        background(30, 30, 30);
    }

    // title
    fill(255);
    textSize(150);
    textFont("Impact");
    text("Drive to \nSurvive", width / 2, 250);


    // how to interact with buttons
    for (let button of buttons) {
        button.display();
    }
=======
  bgImage = loadImage("https://i.imgur.com/hnKdHwZ.jpeg");
}

class Button {
    constructor(label, x, y, action) {
        this.label = label;
        this.x = x;
        this.y = y;
        this.width = 200;
        this.height = 50;
        this.action = action;
    }
function setup() {
  createCanvas(1920, 1080);
  textAlign(CENTER, CENTER);
  textFont("Comic Sans MS");
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

    display() {
        if (this.isMouseOver()) {
            fill(100, 200, 255);
        } else {
            fill(200);
        }
        rectMode(CENTER);
        rect(this.x, this.y, this.width, this.height, 10);

        fill(0);
        textSize(24);
        text(this.label, this.x, this.y);
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
>>>>>>> Stashed changes
}

    isMouseOver() {
        return (
            mouseX > this.x - this.width / 2 &&
            mouseX < this.x + this.width / 2 &&
            mouseY > this.y - this.height / 2 &&
            mouseY < this.y + this.height / 2
        );
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

    handleClick() {
        if (this.isMouseOver()) {
            this.action();
        }
    }
function drawGarage() {
  return;
}

function mousePressed() {
    for (let button of buttons) {
        button.handleClick();
    }
function drawSettings() {
  return;
}

function startGame() {
    console.log("Play Game clicked");
  console.log("Play Game clicked");
  mode = Mode.play;
  console.log("mode is ", mode);
}

function showGarage() {
    console.log("Garage clicked");
  console.log("Garage clicked");
  reset();
}

function showSettings() {
    console.log("Settings clicked");
  console.log("Settings clicked");
}

function showLeaderboard() {
    console.log("Leaderboard clicked");
  console.log("Leaderboard clicked");
}

function exitGame() {
    console.log("Exit clicked");
}  console.log("Exit clicked");
}
