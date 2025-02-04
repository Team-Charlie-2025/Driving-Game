<<<<<<< Updated upstream
function setup(){
=======
function setup()
 {
  createCanvas(windowWidth, windowHeight);
>>>>>>> Stashed changes
  car = new Car(width / 2, height / 2, 50, 30);
}

function displayTimer(timer) 
{
  fill(0);
  textSize(32);
  text('Boost Timer: ' + timer, 10, 30);
}

class Car {
<<<<<<< Updated upstream
    constructor(x, y, w, h) {
      this.x = x;
      this.y = y;
      this.width = w;
      this.height = h;
      this.speed = 0;
      this.angle = 0;
      this.acceleration = 0.1;
      this.maxSpeed = 8;
      this.friction = 0.05; // how fast car decel
    }
  
    update() {
      // W
      if (keyIsDown(87)) {
        // W w
        if (keyIsDown(70)) {
          // F key for boost
          this.speed = constrain(
            this.speed + this.acceleration * 2,
            -this.maxSpeed * 2,
            this.maxSpeed * 2
          );
        } else {
          this.speed = constrain(
            this.speed + this.acceleration,
            -this.maxSpeed,
            this.maxSpeed
          );
        }
=======
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.speed = 0;
    this.angle = 0;
    this.acceleration = 0.1;
    this.maxSpeed = 8;
    this.friction = 0.05;
    this.reverseSpeed = -4;
    this.defaultColor = color(100, 100, 255); // Normal color (Blue)
    this.boostColor = color(255, 50, 50); // Boosting color (Red)
    this.currentColor = this.defaultColor;
    this.boostTimer=0;
  }

  update() {
    if (keyIsDown(87)) {
      if (keyIsDown(70)) {
        this.speed = constrain(
          this.speed + this.acceleration * 2,
          this.reverseSpeed * 2,
          this.maxSpeed * 2
        );
        this.currentColor = this.boostColor; // Change to boost color
        this.boostTimer++;
      } else {
        this.speed = constrain(
          this.speed + this.acceleration,
          this.reverseSpeed,
          this.maxSpeed
        );
        this.currentColor = this.defaultColor; // Reset color when not boosting
        this.boostTimer = 0
>>>>>>> Stashed changes
      }
      let turnSpeed = 0.05;
      if (keyIsDown(65)) {
        if (keyIsDown(16)) this.angle -= turnSpeed * 2;
        else this.angle -= turnSpeed;
      }
      if (keyIsDown(68)) {
        if (keyIsDown(16)) this.angle += turnSpeed * 2;
        else this.angle += turnSpeed;
      }
  
      // S
      if (!keyIsDown(87) && !keyIsDown(83)) {
        this.speed *= 1 - this.friction;
        if (Math.abs(this.speed) < 0.01) this.speed = 0;
      }
      this.x += this.speed * cos(this.angle);
      this.y += this.speed * sin(this.angle);if (this.x < 0) {
      this.x = width;
  } else if (this.x > width) {
      this.x = 0;
  }
  
  if (this.y < 0) {
      this.y = height;
  } else if (this.y > height) {
      this.y = 0;
  }
<<<<<<< Updated upstream
    }
  
    display() {
      push();
      translate(this.x, this.y); //moves car
      rotate(this.angle);
      rectMode(CENTER); // ensures rotation is from center of rect
      rect(0, 0, this.width, this.height);
      pop();
    }
  }
=======
}

/*function draw() {
  background(220);
  car.update();
  car.display();
  displayTimer(car.boostTimer);
}*/



>>>>>>> Stashed changes
