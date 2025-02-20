// car.js
class Car extends GameObject {
  constructor(p, x, y) {
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
    this.healthBar = SAVED_STATS.health;
    this.controlDisabled = false;
    this.time = 0.0;
    this.currentImage = window.cars[selectedCarIndex] || null;

    // polygon collider using alpha channel tracing
    if (this.currentImage) {
      this.width = 64;
      this.height = 64;
      this.collider = new Collider(
        this,
        "polygon",
        { offsetX: -16, offsetY: -32 },
        this.currentImage
      );
    } 
    // backup rect collider for rect
    else {
      this.width = 50;
      this.height = 30;
      this.collider = new Collider(this, "rectangle", {
        width: this.width,
        height: this.height,
        offsetX: -this.width / 2,
        offsetY: -this.height / 2
      });
    }
  }

  update() {
    const p = this.p;
    // key controls
    if (p.keyIsDown(87) && !this.controlDisabled) { // W
      if (p.keyIsDown(70)) { // F
        if (this.speed < 0) this.speed = 0.01;
        this.speed = p.constrain(this.speed + this.acceleration * 2, this.reverseSpeed * 2, this.maxSpeed * 2);
      } else {
        // deceleration from boosting beyond max speed vs. old static constraint
        if (this.speed > this.maxSpeed) {
          this.speed -= this.acceleration;
          
        } else {
          // constrains when not super fast
          this.speed = p.constrain(this.speed + this.acceleration, this.reverseSpeed, this.maxSpeed);
        }
      }
    }
    if (p.keyIsDown(83) && !this.controlDisabled) { // S
      this.speed = p.constrain(this.speed - this.acceleration, this.reverseSpeed, this.maxSpeed);
    }

    let turnSpeed = 0.05;
    if (p.keyIsDown(65) && !this.controlDisabled) { // A
      this.angle -= p.keyIsDown(16) ? turnSpeed * 2 : turnSpeed;
    }
    if (p.keyIsDown(68) && !this.controlDisabled) { // D
      this.angle += p.keyIsDown(16) ? turnSpeed * 2 : turnSpeed;
    }

    // friction
    if (!p.keyIsDown(87) && !p.keyIsDown(83)) {
      this.speed *= (1 - this.friction);
      if (Math.abs(this.speed) < 0.01) this.speed = 0;
    }

    // movement
    this.position.x += this.speed * p.cos(this.angle);
    this.position.y += this.speed * p.sin(this.angle);

    // edge logic
    if (this.position.x < 0) this.position.x = p.width;
    else if (this.position.x > p.width) this.position.x = 0;
    if (this.position.y < 0) this.position.y = p.height;
    else if (this.position.y > p.height) this.position.y = 0;
  }

  display() {
    const p = this.p;
    p.push();
    p.translate(this.position.x, this.position.y);
    p.rotate(this.angle);
    
    // draw image or rectangle if no image
    if (this.currentImage) {
      p.image(this.currentImage, -16, -32, 64, 64);
    } 
    else {
      p.fill(0);
      p.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    }

    p.pop();
  }

  onCollisionEnter(other) {
    super.onCollisionEnter(other);
    if (other instanceof Building) {
      this.speed = -1 * Math.abs(this.speed);
      console.log(`Car (id:${this.id}) collided with Building (id:${other.id}). Bounce: speed set to ${this.speed}`);
      this.controlDisabled = true;
      setTimeout(() => {
        this.controlDisabled = false;
      }, 250);
    }
  }
}
