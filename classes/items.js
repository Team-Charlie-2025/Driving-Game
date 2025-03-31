const frameDuration = 150; // 5fps

const shieldMaxTime = 10000; //max time, milliseconds
let shieldStartTime = null; //start time
let currentTime = null;
let shieldElapsedTime = null; 

class ItemsManager {
    static shieldResetGame(){
      shieldStartTime = null;
      currentTime = null;
      shieldElapsedTime = null; 
    }
    static ifShield(){
      if(shieldStartTime == null) return false;
      return shieldElapsedTime <= shieldMaxTime;
    }
    static shieldDisplayBar(p,scale){
      currentTime = p.millis();
      shieldElapsedTime = (currentTime - shieldStartTime);
      if(!this.ifShield())
        return; //dont display if zero?
      p.fill(50);
      p.rect(260*windowWidthScale, 20*windowHeightScale, (shieldMaxTime * 10 /1000)*windowWidthScale, 25*windowHeightScale);
      p.fill(143, 233, 250);
      p.rect(260*windowWidthScale, 20*windowHeightScale, ((shieldMaxTime * 10 /1000) - (shieldElapsedTime * 10 /1000)) * windowWidthScale , 25*windowHeightScale);

      p.fill(255);
      p.textSize(16*windowScale);
      p.text("Shield", 300*windowWidthScale, 20*windowHeightScale);

    }
    static shieldCollected(){ //a shield has been collected
      shieldStartTime = currentTime; //new start time
    }
    static shieldDamage(damageTaken){
      if (!this.ifShield()){
            return damageTaken; //no shield active
      }
      else
        return 0;
    }
    static wrenchCollected(car){
      let newHealth = car.getHealth() + 10;
      console.log("current health: " + car.getHealth());
      newHealth = Math.min(newHealth, loadPersistentData().stats.health);
      car.healthChange( newHealth); //no more than max
      console.log("health restored : " + car.getHealth());
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
  
    display() { 
      const p = this.p;
      const frameIndex = Math.floor(p.millis() / frameDuration) % window.animations["shield"].length;
      const shieldImg = window.animations["shield"][frameIndex];
  
      p.push();
        p.translate(this.position.x, this.position.y);
        p.imageMode(p.CENTER);
        p.noStroke();
        p.image(shieldImg, 0, 0, this.size, this.size);
      p.pop();
    }
  }



class Wrench extends GameObject {
  constructor(p, x, y, size = 30) {
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

  display() { 
    const p = this.p;
    const frameIndex = Math.floor(p.millis() / frameDuration) % window.animations["wrench"].length;
    const wrenchImg = window.animations["wrench"][frameIndex];

    p.push();
      p.translate(this.position.x, this.position.y);
      p.imageMode(p.CENTER);
      p.noStroke();
      p.image(wrenchImg, 0, 0, this.size, this.size);
    p.pop();
  }
}