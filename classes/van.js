// classes/van.js - New vehicle class

class Van extends Car {
    constructor(p, x, y, stats) {
      // Call parent constructor with base stats
      super(p, x, y, stats);
      
      // Modify base properties for the van
      this.maxSpeed = this.maxSpeed * 0.7;      // 30% slower than regular car
      this.turnRadius = 0.06;                   // Worse turning (higher value = worse)
      this.friction = 0.04;                     // Slightly less friction
      this.healthBar = this.healthBar * 1.6;    // 60% more health
      
      // Boost modifications
      this.boostMax = 150;                      // 50% more boost capacity
      this.boostMeter = this.boostMax;          // Start with full boost
      this.boostRegenDelay = 1000;              // 1 second delay before regen (faster)
      this.boostRegenRate = 2.5;                // Faster regeneration
      
      // Visual adjustments if needed
      this.width = 80;
      this.height = 48;
      
      // Update the collider to match the van dimensions
      if (this.currentImage) {
        this.collider = new Collider(
          this,
          "polygon",
          { 
            offsetX: -this.width / 2, 
            offsetY: -this.height / 2 
          },
          this.currentImage
        );
      } else {
        this.collider = new Collider(this, "rectangle", {
          width: this.width,
          height: this.height,
          offsetX: -this.width / 2,
          offsetY: -this.height / 2,
        });
      }
    }
    
    // Override the update method to include van-specific boost behavior
    update() {
      const p = this.p;
  
      if (this.healthBar <= 0) {
        this.healthBar = 0; // Prevent negative values
        window.isGameOver = true; 
        console.log("Game Over Triggered!"); // Debugging log
      }
  
      // W key: accelerate
      if (p.keyIsDown(87) && !this.controlDisabled) {
        // F key: boost - Van has better turn radius during boost
        if (p.keyIsDown(70) && this.boostMeter > 0) {
          this.isBoosting = true;
          this.boostMeter = Math.max(0, this.boostMeter - 2); // Drain boost more slowly
          this.lastBoostTime = Date.now();
  
          if (this.speed < 0) this.speed = 0.01;
          this.speed = p.constrain(
            this.speed + this.acceleration * 2.0, // Slightly weaker boost acceleration
            this.reverseSpeed * 2,
            this.maxSpeed * 2.5 // Lower top speed during boost than regular car
          );
          
          // Improved turning during boost
          let turnSpeed = 0.07; // Better turning during boost
          if (p.keyIsDown(65) && !this.controlDisabled) { // A key
            this.angle -= p.keyIsDown(16) ? turnSpeed * 2 : turnSpeed;
          }
          if (p.keyIsDown(68) && !this.controlDisabled) { // D key
            this.angle += p.keyIsDown(16) ? turnSpeed * 2 : turnSpeed;
          }
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
  
      // Normal turning (slower for van)
      if (!this.isBoosting) {
        let turnSpeed = 0.03; // Slower turning when not boosting
        if (p.keyIsDown(65) && !this.controlDisabled) { // A key
          this.angle -= p.keyIsDown(16) ? turnSpeed * 2 : turnSpeed;
        }
        if (p.keyIsDown(68) && !this.controlDisabled) { // D key
          this.angle += p.keyIsDown(16) ? turnSpeed * 2 : turnSpeed;
        }
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
  
      // Boost regeneration - faster for van
      if (!this.isBoosting && Date.now() - this.lastBoostTime > this.boostRegenDelay) {
        this.boostMeter = Math.min(this.boostMax, this.boostMeter + this.boostRegenRate);
      }
    }
  }
  