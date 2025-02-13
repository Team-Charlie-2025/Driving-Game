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

    this.health = new Health(100); // Ensure you have a Health class defined
    this.boost = new Boost(100);   // Boost system with max boost value of 100
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

    if (keyIsDown(87)) { // Forward (W key)
      if (keyIsDown(70)) { // Boost key (F key)
        // Only apply boosted acceleration if there's boost available.
        if (this.boost.currentBoost > 0 && this.boost.useBoost()) {
          this.speed = constrain(
            this.speed + this.acceleration * 2,
            this.reverseSpeed * 2,
            this.maxSpeed * 2
          );
          this.currentColor = this.boostColor;
          boosting = true;
        } else {
          // If boost is empty, apply normal acceleration.
          this.speed = constrain(
            this.speed + this.acceleration,
            this.reverseSpeed,
            this.maxSpeed
          );
          this.currentColor = this.defaultColor;
        }
      } else {
        // Normal acceleration without boost key pressed.
        this.speed = constrain(
          this.speed + this.acceleration,
          this.reverseSpeed,
          this.maxSpeed
        );
        
      }
    }

    // Recharge boost if not boosting
    if (!boosting) {
      this.boost.rechargeBoost();
    }

    if (keyIsDown(83)) { // Reverse (S key)
      this.speed = constrain(this.speed - this.acceleration, this.reverseSpeed, this.maxSpeed);
      this.currentColor = this.defaultColor;
    }

    // Turning logic (A and D keys, with shift for faster turning)
    let turnSpeed = 0.05;
    if (keyIsDown(65)) { // Left (A key)
      if (keyIsDown(16)) this.angle -= turnSpeed * 2;
      else this.angle -= turnSpeed;
    }
    if (keyIsDown(68)) { // Right (D key)
      if (keyIsDown(16)) this.angle += turnSpeed * 2;
      else this.angle += turnSpeed;
    }

    // Apply friction if not moving forward or backward
    if (!keyIsDown(87) && !keyIsDown(83)) {
      this.speed *= 1 - this.friction;
      if (Math.abs(this.speed) < 0.01) this.speed = 0;
      this.currentColor = this.defaultColor;
    }

    // Update car position based on speed and angle
    this.x += this.speed * cos(this.angle);
    this.y += this.speed * sin(this.angle);

    // Example collision detection with canvas boundaries
    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
      this.takeDamage(10); // Lose health when hitting boundaries
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    // Draw the car body
    fill(this.currentColor);
    stroke(0);
    rectMode(CENTER);
    rect(0, 0, this.width, this.height, 8);

    // Draw wheels
    fill(50);
    let wheelOffsetX = this.width / 2 - 7;
    let wheelOffsetY = this.height / 2 + 3;
    ellipse(-wheelOffsetX, -wheelOffsetY, 12, 7);
    ellipse(wheelOffsetX, -wheelOffsetY, 12, 7);
    ellipse(-wheelOffsetX, wheelOffsetY, 12, 7);
    ellipse(wheelOffsetX, wheelOffsetY, 12, 7);

    // Draw headlights and taillights based on speed
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
