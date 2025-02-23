/* classes/car.js */
const carWidth = 50;
const carHeight = 30;

class Car extends GameObject {
  constructor(p, x, y, stats) {
    super(x, y);
    this.p = p;
    this.speed = 0;
    this.angle = 0;
    const data = loadPersistentData();
    const SAVED_STATS = data.stats;
    const selectedCarIndex = data.selectedCar || 0;
    this.acceleration = SAVED_STATS.acceleration;
    this.maxSpeed = SAVED_STATS.maxSpeed;
    this.friction = 0.05;
    this.reverseSpeed = -4;
    this.currentImage = window.cars[selectedCarIndex] || null;
    if (this.currentImage) {
      this.width = 64;
      this.height = 64;
      this.collider = new Collider(
        this,
        "polygon",
        { offsetX: -16, offsetY: -32 },
        this.currentImage
      );
    } else {
      this.width = carWidth;
      this.height = carHeight;
      this.collider = new Collider(this, "rectangle", {
        width: this.width,
        height: this.height,
        offsetX: -this.width / 2,
        offsetY: -this.height / 2,
      });
    }
    this.healthBar = SAVED_STATS.health;
    this.controlDisabled = false;
    this.time = 0.0;
  }

  update() {
    const p = this.p;
    if (p.keyIsDown(87) && !this.controlDisabled) { // W key: move forward
      if (p.keyIsDown(70)) { // Boost when F is held
        if (this.speed < 0) this.speed = 0.01;
        this.speed = p.constrain(this.speed + this.acceleration * 2, this.reverseSpeed * 2, this.maxSpeed * 2);
      } else {
        if (this.speed > this.maxSpeed) {
          this.speed -= this.acceleration;
        } else {
          this.speed = p.constrain(this.speed + this.acceleration, this.reverseSpeed, this.maxSpeed);
        }
      }
    }
    if (p.keyIsDown(83) && !this.controlDisabled) { // S key: brake/reverse
      this.speed = p.constrain(this.speed - this.acceleration, this.reverseSpeed, this.maxSpeed);
    }
    let turnSpeed = 0.05;
    if (p.keyIsDown(65) && !this.controlDisabled) { // A key: turn left
      this.angle -= p.keyIsDown(16) ? turnSpeed * 2 : turnSpeed;
    }
    if (p.keyIsDown(68) && !this.controlDisabled) { // D key: turn right
      this.angle += p.keyIsDown(16) ? turnSpeed * 2 : turnSpeed;
    }
    if (!p.keyIsDown(87) && !p.keyIsDown(83)) {
      this.speed *= (1 - this.friction);
      if (Math.abs(this.speed) < 0.01) this.speed = 0;
    }
    this.position.x += this.speed * p.cos(this.angle);
    this.position.y += this.speed * p.sin(this.angle);
    if (this.position.x < 0) this.position.x = 0;
    else if (this.position.x > mapSize * gridSize) this.position.x = mapSize * gridSize;
    if (this.position.y < 0) this.position.y = 0;
    else if (this.position.y > mapSize * gridSize) this.position.y = mapSize * gridSize;
  }

  display() {
    const p = this.p;
    p.push();
    p.translate(this.position.x, this.position.y);
    p.rotate(this.angle);
    if (this.currentImage) {
      p.image(this.currentImage, -this.width / 4, -this.height / 2, this.width, this.height);
    } else {
      p.fill(0);
      p.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    }
    p.pop();
  }

  onCollisionEnter(other) {
    super.onCollisionEnter(other);
    if (other instanceof Building) {
      this.speed = -Math.abs(this.speed);
      console.log(`Car (id:${this.id}) collided with Building (id:${other.id}). Bounce: speed set to ${this.speed}`);
      this.controlDisabled = true;
      setTimeout(() => {
        this.controlDisabled = false;
      }, 250);
    }
  }
}
