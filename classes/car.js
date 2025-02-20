// classes/car.js
class Car {
  constructor(p, x, y, stats) {
    this.p = p;
    this.x = x;
    this.y = y;
    this.speed = 0;
    this.angle = 0;
    // creates stats as const to prevent modifications
    const SAVED_STATS = Object.freeze({ ...stats });
    this.acceleration = SAVED_STATS.acceleration;
    this.maxSpeed = SAVED_STATS.maxSpeed;
    this.friction = 0.05;
    this.reverseSpeed = -4;
    this.currentImage = (typeof cars !== 'undefined' && cars[0]) ? cars[0] : null;
    this.width = 50;
    this.height = 30;
    this.healthBar = SAVED_STATS.health;
  }

  update() {
    let p = this.p;
    if (p.keyIsDown(87)) {
      if (p.keyIsDown(70)) {
        if (this.speed < 0) {
          this.speed = 0.01;
        }
        this.speed = p.constrain(
          this.speed + this.acceleration * 2,
          this.reverseSpeed * 2,
          this.maxSpeed * 2
        );
      } else {
        this.speed = p.constrain(
          this.speed + this.acceleration,
          this.reverseSpeed,
          this.maxSpeed
        );
      }
    }
    if (p.keyIsDown(83)) {
      this.speed = p.constrain(this.speed - this.acceleration, this.reverseSpeed, this.maxSpeed);
    }
    let turnSpeed = 0.05;
    if (p.keyIsDown(65)) {
      if (p.keyIsDown(16)) this.angle -= turnSpeed * 2;
      else this.angle -= turnSpeed;
    }
    if (p.keyIsDown(68)) {
      if (p.keyIsDown(16)) this.angle += turnSpeed * 2;
      else this.angle += turnSpeed;
    }
    if (!p.keyIsDown(87) && !p.keyIsDown(83)) {
      this.speed *= 1 - this.friction;
      if (Math.abs(this.speed) < 0.01) this.speed = 0;
    }
    this.x += this.speed * p.cos(this.angle);
    this.y += this.speed * p.sin(this.angle);
    if (this.x < 0) this.x = p.width;
    else if (this.x > p.width) this.x = 0;
    if (this.y < 0) this.y = p.height;
    else if (this.y > p.height) this.y = 0;
  }

  display() {
    let p = this.p;
    p.push();
    p.translate(this.x, this.y);
    p.rotate(this.angle);
    if (this.currentImage) {
      p.image(this.currentImage, -32, -64, 128, 128);
    } else {
      p.fill(0, 0, 0);
      p.rect(0, 0, this.width, this.height);
    }
    p.pop();
  }
}
