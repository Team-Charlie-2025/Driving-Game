let buttons = [];
let bgImage;

function preload() {
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

    isMouseOver() {
        return (
            mouseX > this.x - this.width / 2 &&
            mouseX < this.x + this.width / 2 &&
            mouseY > this.y - this.height / 2 &&
            mouseY < this.y + this.height / 2
        );
    }

    handleClick() {
        if (this.isMouseOver()) {
            this.action();
        }
    }
}

function mousePressed() {
    for (let button of buttons) {
        button.handleClick();
    }
}

function startGame() {
    console.log("Play Game clicked");
}

function showGarage() {
    console.log("Garage clicked");
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