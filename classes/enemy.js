// classes/enemy.js
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
    //super.onCollisionEnter(other);
    // Only apply damage if the collided object is the player car (not an Enemy)
    if (other instanceof Car && !(other instanceof Enemy) && Date.now() - this.lastAttack > this.attackCooldown) {
      let damage = this.attackDamage;
      
      // Use ItemsManager's shield damage reduction if available
      if (typeof ItemsManager !== 'undefined' && ItemsManager.shieldDamage) {
        damage = ItemsManager.shieldDamage(damage);
      }
      
      other.healthBar = Math.max(0, other.healthBar - damage);
      this.lastAttack = Date.now();
      
      // Add knockback effect for the player car
      const knockbackForce = 7 * window.difficulty;
      other.position.x += knockbackForce * this.p.cos(this.angle);
      other.position.y += knockbackForce * this.p.sin(this.angle);
    }
    
    // Enemy takes damage when hit by player car
    if (other instanceof Car && !(other instanceof Enemy)) {
      let damage = 10;
      this.healthBar = Math.max(0, this.healthBar - damage);
    }
    
    // Handle enemy-enemy collisions without damage
    if (other instanceof Enemy) {
      let separation = p5.Vector.sub(this.position, other.position);
      separation.setMag(5);  // Push enemies apart to avoid overlap
      this.position.add(separation);
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