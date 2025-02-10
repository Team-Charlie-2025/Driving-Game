function setup() {
  createCanvas(windowWidth, windowHeight);
  car = new Car(width / 2, height / 2, 50, 30);
}

class Car {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.xTile = y/gridSize ; // THIS FUNCTION WILL NEED CHANGED WHEN MAP EXPANDS
    this.yTile = x/gridSize ; // Gives the approximate location on the 2d map array
    this.speed = 0;
    this.angle = 0;
    this.acceleration = 0.1;
    this.maxSpeed = 8;
    this.friction = 0.05;
    this.reverseSpeed = -4;
    this.defaultColor = color(100, 100, 255); // Normal color (Blue)
    this.boostColor = color(255, 50, 50); // Boosting color (Red)
    this.currentColor = this.defaultColor;
  }

  update() {
    if (keyIsDown(87)) {
      if (keyIsDown(70)) {
        if(this.speed < 0) {
            this.speed = .01;
        }
        this.speed = constrain(
          this.speed + this.acceleration * 2,
          this.reverseSpeed * 2,
          this.maxSpeed * 2
        );
        this.currentColor = this.boostColor; // Change to boost color
      } else {
        this.speed = constrain(
          this.speed + this.acceleration,
          this.reverseSpeed,
          this.maxSpeed
        );
        this.currentColor = this.defaultColor; // Reset color when not boosting
      }
    }

    if (keyIsDown(83)) {
      this.speed = constrain(this.speed - this.acceleration, this.reverseSpeed, this.maxSpeed);
      this.currentColor = this.defaultColor; // Reset color if reversing
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
      this.currentColor = this.defaultColor; // Reset color if not moving
    }
    
    // Calculates what tile the car will be on 
    this.xTile = Math.floor((this.x + this.speed * cos(this.angle)) / gridSize) ;
    this.yTile = Math.ceil((this.y + this.speed * sin(this.angle)) / gridSize) ;

    if(map[this.yTile][this.xTile] instanceof Building) {
        //this.x -= (this.speed * cos(this.angle));
        //this.y -= (this.speed * sin(this.angle));
        this.healthBar -= 10;
        console.log(this.healthBar);
        this.speed = this.speed / -2 ;
        this.acceleration = 0.01 ;
    }
    else { 
        this.x += this.speed * cos(this.angle);
        this.y += this.speed * sin(this.angle);
    }

    if (this.x < 0) this.x = width;
    else if (this.x > width) this.x = 0;

    if (this.y < 0) this.y = height;
    else if (this.y > height) this.y = 0;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    // Car body
    fill(this.currentColor);
    stroke(0);
    rectMode(CENTER);
    rect(0, 0, this.width, this.height, 8);

    // Wheels
    fill(50);
    let wheelOffsetX = this.width / 2 - 7;
    let wheelOffsetY = this.height / 2 + 3;
    ellipse(-wheelOffsetX, -wheelOffsetY, 12, 7);
    ellipse(wheelOffsetX, -wheelOffsetY, 12, 7);
    ellipse(-wheelOffsetX, wheelOffsetY, 12, 7);
    ellipse(wheelOffsetX, wheelOffsetY, 12, 7);

    // Headlights (yellow when moving forward)
    if (this.speed > 0) fill(255, 255, 100);
    else fill(200);
    rect(this.width / 2, -this.height / 4, 8, 8);
    rect(this.width / 2, this.height / 4, 8, 8);

    // Brake lights (red when reversing)
    if (this.speed < 0) fill(255, 0, 0);
    else fill(50);
    rect(-this.width / 2, -this.height / 4, 8, 8);
    rect(-this.width / 2, this.height / 4, 8, 8);

    pop();
  }
}

function draw() {
  background(220);
  car.update();
  car.display();
}
