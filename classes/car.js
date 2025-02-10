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
    this.defaultColor = color(100, 100, 255);
    this.boostColor = color(255, 50, 50);
    this.currentColor = this.defaultColor;

    this.health = new Health(100); // Add health system
    this.boost = new Boost(100); // Add boost system
  }

  takeDamage(amount) {
    this.health.takeDamage(amount);
    if (this.health.isDead()) {
      console.log("Car Destroyed! Game Over.");
      noLoop(); // Stop the game
    }
  }

  update() {
    let boosting = false;

    if (keyIsDown(87)) { // Forward
      if (keyIsDown(70)) { // Boost key (F)
        if (this.boost.useBoost()) {
          this.speed = constrain(
            this.speed + this.acceleration * 2,
            this.reverseSpeed * 2,
            this.maxSpeed * 2
          );
          this.currentColor = this.boostColor;
          boosting = true;
        }
      } else {
        this.speed = constrain(
          this.speed + this.acceleration,
          this.reverseSpeed,
          this.maxSpeed
        );
        this.currentColor = this.defaultColor;
      }
    }

    if (!boosting) {
      this.boost.rechargeBoost();
    }

    if (keyIsDown(83)) { // Reverse
      this.speed = constrain(this.speed - this.acceleration, this.reverseSpeed, this.maxSpeed);
      this.currentColor = this.defaultColor;
    }

    let turnSpeed = 0.05;
    if (keyIsDown(65)) { // Left
      if (keyIsDown(16)) this.angle -= turnSpeed * 2;
      else this.angle -= turnSpeed;
    }
    if (keyIsDown(68)) { // Right
      if (keyIsDown(16)) this.angle += turnSpeed * 2;
      else this.angle += turnSpeed;
    }

    if (!keyIsDown(87) && !keyIsDown(83)) { // No movement
      this.speed *= 1 - this.friction;
      if (Math.abs(this.speed) < 0.01) this.speed = 0;
      this.currentColor = this.defaultColor;
    }

    this.x += this.speed * cos(this.angle);
    this.y += this.speed * sin(this.angle);

    // Example collision detection
    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
      this.takeDamage(10); // Lose health when hitting boundaries
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    fill(this.currentColor);
    stroke(0);
    rectMode(CENTER);
    rect(0, 0, this.width, this.height, 8);

    fill(50);
    let wheelOffsetX = this.width / 2 - 7;
    let wheelOffsetY = this.height / 2 + 3;
    ellipse(-wheelOffsetX, -wheelOffsetY, 12, 7);
    ellipse(wheelOffsetX, -wheelOffsetY, 12, 7);
    ellipse(-wheelOffsetX, wheelOffsetY, 12, 7);
    ellipse(wheelOffsetX, wheelOffsetY, 12, 7);

    if (this.speed > 0) fill(255, 255, 100);
    else fill(200);
    rect(this.width / 2, -this.height / 4, 8, 8);
    rect(this.width / 2, this.height / 4, 8, 8);

    if (this.speed < 0) fill(255, 0, 0);
    else fill(50);
    rect(-this.width / 2, -this.height / 4, 8, 8);
    rect(-this.width / 2, this.height / 4, 8, 8);

    pop();

    // Display health bar
    this.health.display(10, 10, 200, 20);
    // Display boost meter below health bar
    this.boost.display(10, 35, 200, 15);
  }
}
