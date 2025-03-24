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

    const data = loadPersistentData();
    const SAVED_STATS = data.stats;
    const selectedCarIndex = data.selectedCar || 0;

    this.baseAcceleration = SAVED_STATS.acceleration;
    this.baseMaxSpeed = SAVED_STATS.maxSpeed;
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

    this.boostMeter = 100;
    this.boostMax = 100;
    this.boostRegenDelay = 2000;
    this.boostRegenRate = 1.5;
    this.lastBoostTime = 0;
    this.isBoosting = false;
  }

  update() {
    const p = this.p;

    if (this.healthBar <= 0) {
      this.healthBar = 0;
      window.isGameOver = true;
      console.log("Game Over Triggered!");
    }
    //check terrain type
    let terrainType = getTileTypeAt(this.position.x, this.position.y);
    //console.log(`Car is on: ${terrainType} at (${this.position.x}, {$this.position.y})`)
    
    if(this.isBoosting) {
      if (terrainType === "grass") {
        this.acceleration = this.baseAcceleration * 1.5; //smaller boost on grass
        this.maxSpeed = this.baseMaxSpeed * 1.75; //lower maxSpeed increase on grass
      } else {
        this.acceleration = this.baseAcceleration * 2.5;
        this.maxSpeed = this.baseMaxSpeed * 3;
      }
    } else {
      if (terrainType === "grass") {
        this.acceleration = this.baseAcceleration * 0.65; //reduce acceleration
        this.maxSpeed = this.baseMaxSpeed * 0.65; //reduce max speed
      } else {
        this.acceleration = this.baseAcceleration;
        this.maxSpeed = this.baseMaxSpeed;
      }
    }  
    
    const boostKey = getKeyForAction("boost");
    const forwardKey = getKeyForAction("forward");
    const backwardKey = getKeyForAction("backward");
    const leftKey = getKeyForAction("left");
    const rightKey = getKeyForAction("right");

    if (p.keyIsDown(getKeyForAction("forward")) && !this.controlDisabled) {
      if (p.keyIsDown(getKeyForAction("boost")) && this.boostMeter > 0) {
        this.isBoosting = true;
        this.boostMeter = Math.max(0, this.boostMeter - 2.5);
        this.lastBoostTime = Date.now();

        if (this.speed < 0) this.speed = 0.01;
        //make sure speed does not exceed max allowed for terrain
        this.speed = Math.min(this.speed, this.maxSpeed);
        this.speed = p.constrain(
          this.speed + this.acceleration * 2.5,
          this.reverseSpeed * 2,
          this.maxSpeed * 3
        );
        //console.log(`Boost activated. Speed: ${this.speed.toFixed(2)}, Max Speed: ${this.maxSpeed.toFixed(2)}`);
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
      //console.log(`Boost ended. Speed: ${this.speed.toFixed(2)}, Max Speed: ${this.maxSpeed.toFixed(2)}`);
    }

    if (p.keyIsDown(getKeyForAction("backward")) && !this.controlDisabled) {
      this.speed = p.constrain(
        this.speed - this.acceleration,
        this.reverseSpeed,
        this.maxSpeed
      );
    }

    const turnSpeed = 0.05;
    if (p.keyIsDown(getKeyForAction("left")) && !this.controlDisabled) {
      this.angle -= p.keyIsDown(16) ? turnSpeed * 2 : turnSpeed;
    }
    if (p.keyIsDown(getKeyForAction("right")) && !this.controlDisabled) {
      this.angle += p.keyIsDown(16) ? turnSpeed * 2 : turnSpeed;
    }
    
    if (
      !(p.keyIsDown(getKeyForAction("forward")) && !this.controlDisabled) &&
      !(p.keyIsDown(getKeyForAction("backward")) && !this.controlDisabled)
    ) {
      this.speed *= 1 - this.friction;
      if (Math.abs(this.speed) < 0.01) this.speed = 0;
    }

    this.position.x += this.speed * p.cos(this.angle);
    this.position.y += this.speed * p.sin(this.angle);

    this.velocity.set(
      this.speed * this.p.cos(this.angle),
      this.speed * this.p.sin(this.angle)
    );

    if (this.position.x < 0) this.position.x = 0;
    else if (this.position.x > mapSize * gridSize) this.position.x = mapSize * gridSize;
    if (this.position.y < 0) this.position.y = 0;
    else if (this.position.y > mapSize * gridSize) this.position.y = mapSize * gridSize;

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
      p.fill(0);
      p.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    }

    p.pop();
  }

  onCollisionEnter(other) {
    //super.onCollisionEnter(other);
    let damage;
    // Add damage effect
    if (other instanceof Enemy) { //upon ememy collision
      damage = other.attackDamage;
      damage = ItemsManager.shieldDamage(damage);
      this.healthBar = Math.max(0, this.healthBar - damage);
    }
  }

  buildingCollision(){
    let damage = 5 * window.difficulty;
    damage = ItemsManager.shieldDamage(damage);
    this.healthBar = Math.max(0, this.healthBar - damage);
  }

}
