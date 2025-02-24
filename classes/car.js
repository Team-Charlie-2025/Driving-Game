// classes/car.js
const carWidth = 50;
const carHeight = 30;

class Car extends GameObject {
  constructor(p, x, y, stats) {
    super(x, y);
    this.p = p;
    this.speed = 0;
    this.angle = 0;
    this.velocity = new p5.Vector(0, 0);

    // Load saved stats
    const data = loadPersistentData();
    const SAVED_STATS = data.stats;
    const selectedCarIndex = data.selectedCar || 0;

    this.acceleration = SAVED_STATS.acceleration;
    this.maxSpeed = SAVED_STATS.maxSpeed;
    this.friction = 0.05;
    this.reverseSpeed = -4;

    this.currentImage = window.cars[selectedCarIndex] || null;
    this.removeFromWorld = false;

    if (this.currentImage) {
      this.width = 64;
      this.height = 64;
      this.collider = new Collider(
        this,
        "polygon",
        { offsetX: -32, offsetY: -32 },
        this.currentImage
      );
    } else {
      // fallback rectangle
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

    // Boost properties
    this.boostMeter = 100;
    this.boostMax = 100;
    this.boostRegenDelay = 2000; // 2 seconds delay before regen
    this.boostRegenRate = 1.5;   // Regeneration speed
    this.lastBoostTime = 0;
    this.isBoosting = false;
  }

  update() {
    const p = this.p;

    // W key: accelerate
    if (p.keyIsDown(87) && !this.controlDisabled) {
      // F key: boost
      if (p.keyIsDown(70) && this.boostMeter > 0) {
        this.isBoosting = true;
        this.boostMeter = Math.max(0, this.boostMeter - 2.5); // Drain boost
        this.lastBoostTime = Date.now();

        if (this.speed < 0) this.speed = 0.01;
        this.speed = p.constrain(
          this.speed + this.acceleration * 2.5, // Stronger boost
          this.reverseSpeed * 2,
          this.maxSpeed * 3 // Higher top speed during boost
        );
      } else {
        this.isBoosting = false;
        if (this.speed > this.maxSpeed) {
          this.speed -= this.acceleration;
        } else {
          this.speed = p.constrain(
            this.speed + this.acceleration,
            this.reverseSpeed,
            this.maxSpeed
          );
        }
      }
    }

    // S key: brake/reverse
    if (p.keyIsDown(83) && !this.controlDisabled) {
      this.speed = p.constrain(
        this.speed - this.acceleration,
        this.reverseSpeed,
        this.maxSpeed
      );
    }

    let turnSpeed = 0.05;
    if (p.keyIsDown(65) && !this.controlDisabled) { // A key
      this.angle -= p.keyIsDown(16) ? turnSpeed * 2 : turnSpeed;
    }
    if (p.keyIsDown(68) && !this.controlDisabled) { // D key
      this.angle += p.keyIsDown(16) ? turnSpeed * 2 : turnSpeed;
    }

    // Friction
    if (!p.keyIsDown(87) && !p.keyIsDown(83)) {
      this.speed *= (1 - this.friction);
      if (Math.abs(this.speed) < 0.01) this.speed = 0;
    }

    // Update position
    this.position.x += this.speed * p.cos(this.angle);
    this.position.y += this.speed * p.sin(this.angle);

    this.velocity.set(
      this.speed * this.p.cos(this.angle),
      this.speed * this.p.sin(this.angle)
    );

    // Keep within map bounds
    if (this.position.x < 0) this.position.x = 0;
    else if (this.position.x > mapSize * gridSize) this.position.x = mapSize * gridSize;
    if (this.position.y < 0) this.position.y = 0;
    else if (this.position.y > mapSize * gridSize) this.position.y = mapSize * gridSize;

    // Boost regeneration
    if (!this.isBoosting && Date.now() - this.lastBoostTime > this.boostRegenDelay) {
      this.boostMeter = Math.min(this.boostMax, this.boostMeter + this.boostRegenRate);
    }
  }

  display() {
    const p = this.p;
    p.push();
    p.translate(this.position.x, this.position.y);
    p.rotate(this.angle);

    if (this.currentImage) {
      p.image(this.currentImage, -this.width / 2, -this.height / 2, this.width, this.height);
    } else {
      // fallback rectangle
      p.fill(0);
      p.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    }

    p.pop();
  }

  onCollisionEnter(other) {
    super.onCollisionEnter(other);
    // Add damage effect
    if (other instanceof Enemy) {
      this.healthBar = Math.max(0, this.healthBar - 10);
    }
  }
}