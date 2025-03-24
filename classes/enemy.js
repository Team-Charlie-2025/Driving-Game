// classes/enemy.js

class Enemy extends Car {
  constructor(p, x, y, target) {
    const stats = {
      acceleration: 0.4 * window.difficulty,
      maxSpeed: 4.5 * window.difficulty,
      health: 100 * window.difficulty,
      friction: 0.05 
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
    this.maxForce = 0.3;
    this.desired = p.createVector(0, 0);
    this.steer = p.createVector(0, 0);

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
  }
  
  update() {
    if (!this.target || this.controlDisabled) return;
  
    // Calculate desired direction to target
    this.desired = p5.Vector.sub(this.target.position, this.position);
    this.desired.setMag(this.maxSpeed);
  
    // Calculate steering force
    this.steer = p5.Vector.sub(this.desired, this.velocity);
    this.steer.limit(this.maxForce);
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
    super.onCollisionEnter(other);
    // Only apply damage if the collided object is the player car (not an Enemy)
    if (other instanceof Car && !(other instanceof Enemy) && Date.now() - this.lastAttack > this.attackCooldown) {
      other.healthBar = Math.max(0, other.healthBar - this.attackDamage);
      this.lastAttack = Date.now();
      
      // Add knockback effect for the player car
      const knockbackForce = 7 * window.difficulty;
      other.position.x += knockbackForce * this.p.cos(this.angle);
      other.position.y += knockbackForce * this.p.sin(this.angle);
    }
    // Handle enemy-enemy collisions without damage
    if (other instanceof Enemy) {
      let separation = p5.Vector.sub(this.position, other.position);
      separation.setMag(5);  // Push enemies apart to avoid overlap
      this.position.add(separation);
    }
  }
}

// Truck: Slower, sharper turns, more damage
class Truck extends Enemy {
  constructor(p, x, y, target) {
    super(p, x, y, target);
    // Override movement properties
    this.acceleration = 0.25 * window.difficulty; // Even slower acceleration
    this.maxSpeed = 2.5 * window.difficulty;      // Even slower max speed
    this.maxForce = 0.5;                          // Sharper turns (higher force = sharper)
    // Override combat properties
    this.healthBar = 200 * window.difficulty;     // Much more health
    this.attackDamage = 35 * window.difficulty;   // Much more damage
    this.attackCooldown = 2000 / window.difficulty; // Slower attack rate
    // Set truck image - fix this to use the actual truck image
    this.currentImage = p.truckImg;
  }
}

// Motorcycle: Faster, wider turns, less damage
class Motorcycle extends Enemy {
  constructor(p, x, y, target) {
    super(p, x, y, target);
    // Override movement properties
    this.acceleration = 5.0 * window.difficulty;  // Much higher acceleration
    this.maxSpeed = 50.0 * window.difficulty;     // Significantly faster max speed
    this.maxForce = 0.08;                         // Much wider turns (lower value = wider turns)
    // Override combat properties
    this.healthBar = 60 * window.difficulty;      // Less health
    this.attackDamage = 10 * window.difficulty;   // Less damage
    this.attackCooldown = 1000 / window.difficulty; // Faster attack rate
    // Set motorcycle image
    this.currentImage = p.bikeImg;
  }
}