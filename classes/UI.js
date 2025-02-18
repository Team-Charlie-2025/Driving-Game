// classes/UI.js
class UIManager {
    constructor(p, car) {
      this.p = p;
      this.car = car;
      this.startTime = p.millis();
      
      // Boost properties
      this.boostMax = 100;
      this.boostCurrent = this.car.boost;
      this.boostDrainRate = 20;  // per second
      this.boostRechargeRate = 10;  // per second
      this.boostRechargeDelay = 2000; // 2 seconds
      this.lastBoostUse = 0;
      this.canRechargeBoost = true;
  
      // Debug buttons
      this.createDebugButtons();
    }
  
    createDebugButtons() {
      // Health buttons
      this.healthPlus = this.p.createButton('+');
      this.healthMinus = this.p.createButton('-');
      this.healthPlus.position(20, 160);
      this.healthMinus.position(60, 160);
      
      this.healthPlus.mousePressed(() => {
        this.car.healthBar = Math.min(100, this.car.healthBar + 10);
      });
      
      this.healthMinus.mousePressed(() => {
        this.car.healthBar = Math.max(0, this.car.healthBar - 10);
      });
    }
  
    update() {
        // Update boost first
        if (this.p.keyIsDown(70) && this.boostCurrent > 0) {
          this.boostCurrent -= this.boostDrainRate * (this.p.deltaTime / 1000);
          this.lastBoostUse = this.p.millis();
          this.canRechargeBoost = false;
          this.car.boost = this.boostCurrent; // Update car's boost reference
        } else {
          if (this.p.millis() - this.lastBoostUse > this.boostRechargeDelay) {
            this.canRechargeBoost = true;
          }
          if (this.canRechargeBoost && this.boostCurrent < this.boostMax) {
            this.boostCurrent += this.boostRechargeRate * (this.p.deltaTime / 1000);
          }
          this.car.boost = this.boostCurrent; // Update even when recharging
        }
        this.boostCurrent = this.p.constrain(this.boostCurrent, 0, this.boostMax);
    }
  
    display() {
        this.p.push();
        this.p.textSize(20);
        this.p.textStyle(this.p.BOLD);
        this.p.strokeWeight(2);
    
        // Timer
        const timer = this.p.millis() - this.startTime;
        const minutes = Math.floor(timer / 60000);
        const seconds = ((timer % 60000) / 1000).toFixed(0).padStart(2, '0');
        this.p.fill(255);
        this.p.stroke(0);
        this.p.text(`Time: ${minutes}:${seconds}`, 20, 40);
    
        // Health Bar
        const healthWidth = this.p.map(this.car.healthBar, 0, 100, 0, 200);
        
        // Background
        this.p.fill(150, 0, 0);
        this.p.stroke(100, 0, 0);
        this.p.rect(20, 60, 200, 30);
        
        // Foreground
        this.p.fill(0, 200, 50);
        this.p.rect(20, 60, healthWidth, 30);
        
        // Text
        this.p.fill(255);
        this.p.noStroke();
        this.p.textAlign(this.p.CENTER, this.p.CENTER);
        this.p.text(`${Math.round(this.car.healthBar)}%`, 20 + 100, 60 + 15);
    
        // Boost Meter
        const boostWidth = this.p.map(this.boostCurrent, 0, this.boostMax, 0, 200);
        
        // Background
        this.p.fill(200, 80, 0);
        this.p.stroke(150, 60, 0);
        this.p.rect(20, 100, 200, 30);
        
        // Foreground
        this.p.fill(255, 255, 0);
        this.p.rect(20, 100, boostWidth, 30);
        
        // Text
        this.p.fill(0);
        this.p.noStroke();
        this.p.textAlign(this.p.CENTER, this.p.CENTER);
        this.p.text(`${Math.round(this.boostCurrent)}%`, 20 + 100, 100 + 15);
    
        this.p.pop();
      }
    }