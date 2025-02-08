/*var imgCar;
var cars = [];

function preload() {
  imgCar = new Image();
  imgCar.src = "graphics/redStripe.png";
  cars[0] = imgCar;
  
}*/

function setup() {
  createCanvas(windowWidth, windowHeight);
  cars = new Car(width / 2, height / 2, 50, 30);
}

class Car {
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
    this.currentImage = cars[1];
    //this.defaultColor = color(100, 100, 255); // Normal color (Blue)
   //this.boostColor = color(255, 50, 50); // Boosting color (Red)
    //this.currentColor = this.defaultColor;
  }

  update() {
    if (keyIsDown(87)) {
      if (keyIsDown(70)) {
        this.speed = constrain(
          this.speed + this.acceleration * 2,
          this.reverseSpeed * 2,
          this.maxSpeed * 2
        );
        //this.currentColor = this.boostColor; // Change to boost color
      } else {
        this.speed = constrain(
          this.speed + this.acceleration,
          this.reverseSpeed,
          this.maxSpeed
        );
        //this.currentColor = this.defaultColor; // Reset color when not boosting
      }
    }

    if (keyIsDown(83)) {
      this.speed = constrain(this.speed - this.acceleration, this.reverseSpeed, this.maxSpeed);
      //this.currentColor = this.defaultColor; // Reset color if reversing
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

    if (!keyIsDown(87) && !keyIsDown(83)) {
      this.speed *= 1 - this.friction;
      if (Math.abs(this.speed) < 0.01) this.speed = 0;
      //this.currentColor = this.defaultColor; // Reset color if not moving
    }

    this.x += this.speed * cos(this.angle);
    this.y += this.speed * sin(this.angle);

    if (this.x < 0) this.x = width;
    else if (this.x > width) this.x = 0;

    if (this.y < 0) this.y = height;
    else if (this.y > height) this.y = 0;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    if (this.currentImage) {
      drawingContext.drawImage(this.currentImage, 0, 0, this.width*2, this.height*2.5);
      //image(this.currentImage, 0, 0, this.width, this.height);
    } else {
      fill(0, 0, 0);
      rect(0, 0, this.width, this.height); // Fallback in case image fails
    }
    

    pop();
  }
}

function draw() {
  
  background(220);
  car.update();
  car.display();
}
