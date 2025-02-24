// classes/enemy.js
class Enemy extends Car {
  constructor(p, x, y, target, allEnemies = []) {
      const stats = {
          acceleration: 0.4,
          maxSpeed: 3.5,
          health: 100,
          friction: 0.05
      };
      
      super(p, x, y, stats);
      this.target = target;
      this.allEnemies = allEnemies || []; // Ensure it's always an array
      this.attackDamage = 15;
      this.lastAttack = 0;
      this.attackCooldown = 1500;
      this.currentImage = p.enemyImg;
      this.removeFromWorld = false;
      
      // Movement properties
      this.velocity = p.createVector(0, 0);
      this.maxForce = 0.3;
      this.desired = p.createVector(0, 0);
      this.steer = p.createVector(0, 0);
  }
  
  update() {
      if (!this.target || this.controlDisabled) return;
      
      const predictionTime = 30; // Predict player movement 30 frames ahead
      let predictedPosition = this.p.createVector(
          this.target.position.x + this.target.velocity.x * predictionTime,
          this.target.position.y + this.target.velocity.y * predictionTime
      );
      
      // Calculate desired direction to predicted target position
      this.desired = p5.Vector.sub(predictedPosition, this.position);
      this.desired.setMag(this.maxSpeed);
      
      // Collision avoidance with other enemies
        for (let other of this.allEnemies) {
            if (other !== this) {
                let distance = p5.Vector.dist(this.position, other.position);
                if (distance < 50) { // Avoid crowding
                    let repel = p5.Vector.sub(this.position, other.position);
                    repel.setMag(0.1);
                    this.velocity.add(repel);
                }
            }
        }
      
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
      if (other instanceof Car && Date.now() - this.lastAttack > this.attackCooldown) {
          other.healthBar = Math.max(0, other.healthBar - this.attackDamage);
          this.lastAttack = Date.now();
          
          // Smooth knockback force instead of instant displacement
          const knockbackForce = this.p.createVector(this.p.cos(this.angle), this.p.sin(this.angle)).mult(5);
          other.velocity.add(knockbackForce);
      }
  }
}
