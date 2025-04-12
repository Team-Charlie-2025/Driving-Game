// classes/_vehicles.js
const carWidth = 50;
const carHeight = 30;

class Car extends GameObject {
  constructor(p, x, y, stats) {
    super(x, y);
    this.p = p;
    this.speed = 0;
    this.angle = 0;
    this.velocity = new p5.Vector(0, 0);
    this.attackDamage = 10; //damage done to enemy on hit

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
    this.maxHealth = this.healthBar;
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
    else if(other instanceof Wrench){
      let healing = other.collisionEffect;
      this.healthBar = Math.min(this.maxHealth, this.healthBar + healing);
    }
    else if(other instanceof Bomb){
      damage = other.attackDamage;
      damage = ItemsManager.shieldDamage(damage);
      this.healthBar = Math.max(0, this.healthBar - damage);
    }
    else if(other instanceof Oil){
      damage = other.attackDamage;
      damage = ItemsManager.shieldDamage(damage);
      this.healthBar = Math.max(0, this.healthBar - damage);
      this.speed = this.speed *0.9;
    }
  }

  buildingCollision(){
    let damage = 5 * window.difficulty;
    damage = ItemsManager.shieldDamage(damage);
    this.healthBar = Math.max(0, this.healthBar - damage);
  }

  getHealth(){
    return this.healthBar;
  }
}

class Enemy extends Car{
  constructor(p, x, y, target) {
    const stats = {
      acceleration: 0.8 * window.difficulty,
      maxSpeed: 7.0 * window.difficulty,
      health: 100 * window.difficulty,
      friction: 0.03
    };
    
    super(p, x, y, stats);
    this.target = target;
    this.attackDamage = 15 * window.difficulty;
    this.lastAttack = 0;
    this.attackCooldown = 1500 / window.difficulty;
    this.currentImage = p.enemyImg;
    this.removeFromWorld = false;
    
    this.baseAcceleration = stats.acceleration;
    this.baseMaxSpeed = stats.maxSpeed;

    // Movement properties
    this.velocity = p.createVector(0, 0);
    this.maxForce = 0.8;         // How quickly it can change direction
    this.turnRadius = 0.8;       // Turn radius control (lower = wider turns)
    this.desired = p.createVector(0, 0);
    this.steer = p.createVector(0, 0);
    
    // Visual scale to make vehicles visually distinct
    this.visualScale = 1.0;

    if (this.currentImage) {
      this.width = 64 * this.visualScale;
      this.height = 64 * this.visualScale;
      this.collider = new Collider(
        this,
        "polygon",
        { offsetX: -32 * this.visualScale, offsetY: -32 * this.visualScale },
        this.currentImage
      );
    } else {
      this.width = carWidth * this.visualScale;
      this.height = carHeight * this.visualScale;
      this.collider = new Collider(this, "rectangle", {
        width: this.width,
        height: this.height,
        offsetX: -this.width / 2,
        offsetY: -this.height / 2,
      });
    }
  }
  
  update() {
    if (!this.target || this.controlDisabled) return;

    let terrainType = getTileTypeAt(this.position.x, this.position.y);

    if (window.difficulty <= 1.0 && terrainType === "grass") {
      this.acceleration = this.baseAcceleration * 0.65;
      this.maxSpeed = this.baseMaxSpeed * 0.65;
    } else {
      this.acceleration = this.baseAcceleration;
      this.maxSpeed = this.baseMaxSpeed;
    }
    //console.log(`Max Speed: ${this.maxSpeed.toFixed(2)}`);

    // Calculate desired direction to target
    this.desired = p5.Vector.sub(this.target.position, this.position);
    
    // Apply turn radius limitation by adding an intermediate target
    if (this.turnRadius > 0) {
      // Get current direction and desired direction
      const currentDir = p5.Vector.fromAngle(this.angle);
      const desiredDir = this.desired.copy().normalize();
      
      // Calculate angle between current and desired direction
      let angleDiff = this.p.atan2(
        currentDir.x * desiredDir.y - currentDir.y * desiredDir.x,
        currentDir.x * desiredDir.x + currentDir.y * desiredDir.y
      );
      
      // Limit the angle change based on turn radius
      const maxAngleChange = this.turnRadius;
      angleDiff = this.p.constrain(angleDiff, -maxAngleChange, maxAngleChange);
      
      // Create a new direction based on the limited angle change
      const newDir = p5.Vector.fromAngle(this.angle + angleDiff);
      newDir.setMag(this.desired.mag());
      this.desired = newDir;
    }
    
    this.desired.setMag(this.maxSpeed);
  
    // Calculate steering force
    this.steer = p5.Vector.sub(this.desired, this.velocity);
    this.steer.limit(this.maxForce);
    
    // Apply acceleration
    // this.steer.mult(this.acceleration);
    this.velocity.add(this.steer);
    
    // Apply friction
    this.velocity.mult(1 - this.friction);
    
    // Limit final velocity
    this.velocity.limit(this.maxSpeed);
  
    // Update position
    this.position.add(this.velocity);
  
    // Update angle to face movement direction
    if (this.velocity.mag() > 0.1) {
      this.angle = this.velocity.heading();
    }
  
    // Boundary check
    const margin = 2000;
    if (this.position.x < -margin || this.position.x > mapSize * gridSize + margin ||
        this.position.y < -margin || this.position.y > mapSize * gridSize + margin) {
      this.removeFromWorld = true;
    }
  }
  
  onCollisionEnter(other) {
    // Only apply damage if the collided object is the player car (not an Enemy)
    
    // Enemy takes damage when hit by player car
    if (other instanceof Car && !(other instanceof Enemy)) {
      let damage = other.attackDamage;
      this.healthBar = Math.max(0, this.healthBar - damage);
    }
    
    // Handle enemy-enemy collisions without damage
    else if (other instanceof Enemy) {
      let separation = p5.Vector.sub(this.position, other.position);
      separation.setMag(5);  // Push enemies apart to avoid overlap
      this.position.add(separation);
    }
    else if(other instanceof Bomb){
      let damage = other.attackDamage;
      this.healthBar = Math.max(0, this.healthBar - damage);

    }
    else if(other instanceof Oil){
      let damage = other.attackDamage;
      this.healthBar = Math.max(0, this.healthBar - damage);
      this.maxSpeed = this.maxSpeed *0.1;
    }
  }
  
  // Override default display method to apply visual scale
  display() {
    const p = this.p;
    p.push();
    p.translate(this.position.x, this.position.y);
    p.rotate(this.angle);

    if (this.currentImage) {
      p.image(this.currentImage, 
              -this.width / 2, 
              -this.height / 2, 
              this.width, 
              this.height);
    } else {
      // fallback rectangle
      p.fill(0);
      p.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    }

    p.pop();
  }
}

// Truck: Slower, sharper turns, more damage
class Truck extends Enemy {
  constructor(p, x, y, target) {
    super(p, x, y, target);
    
    // Movement properties
    this.acceleration = 0.5 * window.difficulty;  // slow acceleration
    this.maxSpeed = 6 * window.difficulty;       // slow max speed
    this.baseAcceleration = this.acceleration;
    this.baseMaxSpeed = this.maxSpeed;
    this.maxForce = 0.2;                           // Less force
    this.turnRadius = 0.8;                        // SMALL turn radius = sharp turns
    this.friction = 0.03;                          // Less friction
    
    // Combat properties
    this.healthBar = 250 * window.difficulty;      // Much more health
    this.attackDamage = 25 * window.difficulty;    // Much more damage
    this.attackCooldown = 2000 / window.difficulty; // Slower attack rate
    
    this.currentImage = p.truckImg;
    
    // Adjust width and height separately for truck proportions
    // Make the truck longer than it is wide
    if (this.currentImage) {
      this.width = 146 // Wider/longer
      this.height = 59 // Less tall
      
      // Update collider to match new dimensions
      this.collider = new Collider(
        this,
        "polygon",
        { 
          offsetX: -this.width / 2, 
          offsetY: -this.height / 2 
        },
        this.currentImage
      );
    }
  }
}

// Motorcycle: Faster, wider turns, less damage
class Motorcycle extends Enemy {
  constructor(p, x, y, target) {
    super(p, x, y, target);
    
    // Movement properties
    this.acceleration = 0.8 * window.difficulty;   // High acceleration
    this.maxSpeed = 11.0 * window.difficulty;       // High max speed
    this.baseAcceleration = this.acceleration;
    this.baseMaxSpeed = this.maxSpeed;
    this.maxForce = 0.5;                           // More force
    this.turnRadius = 0.08;                        // LARGE turn radius = wide turns
    this.friction = 0.05;                          // Medium friction
    
    // Combat properties
    this.healthBar = 60 * window.difficulty;       // Less health
    this.attackDamage = 8 * window.difficulty;     // Less damage
    this.attackCooldown = 1000 / window.difficulty; // Faster attack rate
    
    this.currentImage = p.bikeImg;
    
    // Update collider to match new size
    if (this.currentImage) {
      this.width = 70 // Wider/longer
      this.height = 36 // Less tall
      
      // Update collider to match new dimensions
      this.collider = new Collider(
        this,
        "polygon",
        { 
          offsetX: -this.width / 2, 
          offsetY: -this.height / 2 
        },
        this.currentImage
      );
    }
  }
}