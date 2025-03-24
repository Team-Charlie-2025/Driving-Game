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
      //super.onCollisionEnter(other);
      if (other instanceof Car) { //upon ememy collision
        let damage = 10;
        this.healthBar = Math.max(0, this.healthBar - damage);
      }
      if (other instanceof Car && Date.now() - this.lastAttack > this.attackCooldown) {
        this.lastAttack = Date.now();
  
        // Add knockback
        const knockbackForce = 7 * window.difficulty;
        other.position.x += knockbackForce * this.p.cos(this.angle);
        other.position.y += knockbackForce * this.p.sin(this.angle);
      }
      //prevent enemy overlap
      if (other instanceof Enemy) {
        let separation = p5.Vector.sub(this.position, other.position);
        separation.setMag(5);  //push apart
        this.position.add(separation);
      }
    }
  }