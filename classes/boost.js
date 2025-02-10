class Boost {
    constructor(maxBoost) {
      this.maxBoost = maxBoost;
      this.currentBoost = maxBoost;
      this.boostRegenRate = 1; // Rate of boost recharge
      this.boostDrainRate = 1; // Rate of boost drain when using boost
    }
  
    useBoost() {
      if (this.currentBoost > 0) {
        this.currentBoost = max(0, this.currentBoost - this.boostDrainRate);
        return true; // Boost is available
      }
      return false; // No boost left
    }
  
    rechargeBoost() {
      this.currentBoost = min(this.maxBoost, this.currentBoost + this.boostRegenRate);
    }
  
    display(x, y, width, height) {
      push();
      fill(50);
      rect(x, y, width, height); // Background bar
  
      fill(0, 100, 255); // Blue for boost
      let boostWidth = (this.currentBoost / this.maxBoost) * width;
      rect(x, y, boostWidth, height);
  
      pop();
    }
  }
  