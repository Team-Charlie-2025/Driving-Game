const frameDuration = 150; // 5fps

const shieldMaxTime = 10000; //max time, milliseconds
let shieldStartTime = null; //start time
let currentTime = null;
let shieldElapsedTime = null; 

let wrenchHealthMod = 10;    //addition to health on wrench collision

let bombInventory = 0;

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
    static wrenchCollected(car, wrench){
      let newHealth = car.getHealth() + wrenchHealthMod;
      console.log("current health: " + car.getHealth());
      car.onCollisionEnter( wrench);
      console.log("health restored : " + car.getHealth());
    }

    static bombCollected(car){
      bombInventory ++;
      console.log("Bomb Inventory: " + bombInventory);
    }
    static placeBomb(p, car, bombs){
      let bombPlaced = new Bomb(p, car.x - 10 , car.y - 10); //adjust location
      console.log("Bomb Placed: " + car.x - 10 +", " + car.y - 10);
      //will need to call collision on enemy cars
      

    }



  }


class Coin extends GameObject {
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
    this.collisionEffect = 10;
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

class Bomb extends GameObject {
  constructor(p, x, y, size = 25) {
    super(x, y);
    this.p = p;
    this.size = size;
    this.collected = false;
    this.placed = false;
    this.attackDamage = 10 * window.difficulty; //damage from bombs
    this.collider = new Collider(this, "rectangle", {
      width: this.size,
      height: this.size,
      offsetX: -this.size / 2,
      offsetY: -this.size / 2
    });
  }

  display() { 
    const p = this.p;
    let bombImg = null
    if(this.placed = true){
      const frameIndex = Math.floor(p.millis() / frameDuration) % window.animations["bomb"].length;
      bombImg = window.animations["bomb"][frameIndex];
    }
    else{
      bombImg = window.animations["bomb"][0];
    }

    p.push();
      p.translate(this.position.x, this.position.y);
      p.imageMode(p.CENTER);
      p.noStroke();
      p.image(bombImg, 0, 0, this.size, this.size);
    p.pop();
  }
}
