function setup(){
  car = new Car(width / 2, height / 2, 50, 30);
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