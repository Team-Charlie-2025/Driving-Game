class Health {
    constructor(maxHealth) {
      this.maxHealth = maxHealth;
      this.currentHealth = maxHealth;
    }
  
    takeDamage(amount) {
      this.currentHealth = max(0, this.currentHealth - amount);
    }
  
    heal(amount) {
      this.currentHealth = min(this.maxHealth, this.currentHealth + amount);
    }
  
    isDead() {
      return this.currentHealth <= 0;
    }
  
    display(x, y, width, height) {
      push();
      fill(255, 0, 0);
      rect(x, y, width, height);
      fill(0, 255, 0);
      let healthWidth = (this.currentHealth / this.maxHealth) * width;
      rect(x, y, healthWidth, height);
      pop();
    }
  }
  