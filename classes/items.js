const shieldMax = 30;
let currentShieldHealth = 0;

class ItemsManager {
    static ifShield(){
        return currentShieldHealth != 0;
    }
    static ifShieldFull(){
        return shieldMax == currentShieldHealth;
    }
    static sheildDisplayBar(p){
    if(!this.ifShield())
        return; //dont display if zero?
    p.fill(50);
    p.rect(350, 20, shieldMax * 2, 25);
    p.fill(0, 255, 0);
    p.rect(350, 20, currentShieldHealth * 2, 25);

    p.fill(255);
    p.textSize(16);
    p.text("Shield", 320, 20);

    }
    static shieldCollected(){ //a shield has been collected
        currentShieldHealth = shieldMax;
    }
    static shieldDamage(damageTaken){
        if (!this.ifShield()){
            return damageTaken; //no shield active
        }
        else if (damageTaken <= currentShieldHealth){
            currentShieldHealth -=damageTaken; //shield active
            return 0;
        }
        else{ //shield active but weak
            let temp = currentShieldHealth;
            currentShieldHealth = 0;
            return damageTaken - temp;
        }
    }
    }

class Shield extends GameObject {
    constructor(p, x, y, size = 25) {
      super(x, y);
      this.p = p;
      this.size = size;
      this.collected = false;
      this.collider = new Collider(this, "rectangle", {
        width: this.size,
        height: this.size,
        offsetX: -this.size / 2,
        offsetY: -this.size / 2
      });
    }
  
    update() {
    }
  
    display() { 
      const p = this.p;
      const frameDuration = 150; // 5fps
      //const frameIndex = Math.floor(p.millis() / frameDuration) % window.animations["shield"].length;
      const frameIndex = 0;
      const shieldImg = window.animations["shield"][frameIndex];
  
      p.push();
        p.translate(this.position.x, this.position.y);
        p.imageMode(p.CENTER);
        p.noStroke();
        p.image(shieldImg, 0, 0, this.size, this.size);
      p.pop();
    }
  }
  /*
class basicGun extends GameObject {
    constructor(p, x, y, size = 20) {
      super(x, y);
      this.p = p;
      this.size = size;
      this.collected = false;
      this.collider = new Collider(this, "rectangle", {
        width: this.size,
        height: this.size,
        offsetX: -this.size / 2,
        offsetY: -this.size / 2
      });
    }
  
    update() {
    }
  
    display() {
      const p = this.p;
      const frameDuration = 150; // 5fps
      const frameIndex = Math.floor(p.millis() / frameDuration) % window.animations["coin"].length;
      const coinImg = window.animations["coin"][frameIndex];
  
      p.push();
        p.translate(this.position.x, this.position.y);
        p.imageMode(p.CENTER);
        p.noStroke();
        p.image(coinImg, 0, 0, this.size, this.size);
      p.pop();
    }
  }
  */