// classes/enemy.js
class Enemy extends Car {
    constructor(p, x, y, target) {
      const stats = {
        acceleration: 0.4,  // Reduced from 0.7
        maxSpeed: 3.5,       // Reduced from 5
        health: 100,
        friction: 0.05       // Increased from 0.03
      };
      super(p, x, y, stats);
      this.target = target;
      this.attackDamage = 15;
      this.lastAttack = 0;
      this.attackCooldown = 1500;
      this.currentImage = p.enemyImg;
      this.removeFromWorld = false;
  
      // Movement properties
      this.velocity = p.createVector(0, 0);
      this.maxForce = 0.3;    // Reduced from 0.5
      this.desired = p.createVector(0, 0);
      this.steer = p.createVector(0, 0);
    }
  
    update() {
      // Don't call super.update() - completely override parent movement
      if (!this.target || this.controlDisabled) return;
  
      // Calculate desired direction to target
      this.desired = p5.Vector.sub(this.target.position, this.position);
      this.desired.setMag(this.maxSpeed);
  
      // Calculate steering force
      this.steer = p5.Vector.sub(this.desired, this.velocity);
      this.steer.limit(this.maxForce);
  
      // Apply steering force
      this.velocity.add(this.steer);
      
      // Apply friction independent of player controls
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
      if (other instanceof Car && Date.now() - this.lastAttack > this.attackCooldown) {
        other.healthBar = Math.max(0, other.healthBar - this.attackDamage);
        this.lastAttack = Date.now();
  
        // Add knockback
        const knockbackForce = 5;
        other.position.x += knockbackForce * this.p.cos(this.angle);
        other.position.y += knockbackForce * this.p.sin(this.angle);
      }
    }
  }