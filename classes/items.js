const frameDuration = 150; // 5fps

const shieldMaxTime = 10000; //max time, milliseconds
let shieldStartTime = null; //start time
let currentTime = null;
let shieldElapsedTime = null; 
let shieldPauseTime = 0;
let shieldTotalPausedTime = 0;

let wrenchHealthMod = 10;    //addition to health on wrench collision

const BombWaitTime = 1000; //bomb place time delay
let BombPlaceTime = null; 
let bombInventory = 0; //number of bombs player collected 

class ItemsManager {

    static ItemResetGame(){ //reset times and inventory
      shieldStartTime = null;
      currentTime = null;
      shieldElapsedTime = null; 
      shieldPauseTime = 0;
      shieldTotalPausedTime = 0;

      BombPlaceTime = null;
      bombInventory = 0;
    }
    static ifShield(){
      if(shieldStartTime == null) return false;
      return shieldElapsedTime <= shieldMaxTime;
    }
    static shieldDisplayBar(p, isPaused = false){
      if (isPaused) {
        // If paused, we use the time when the pause started
        if (shieldPauseTime === 0 && shieldStartTime !== null) {
          // Record when shield was paused
          shieldPauseTime = p.millis();
        }
        
        // Use stored values during pause
        if (currentTime !== null) {
          shieldElapsedTime = (shieldPauseTime - shieldStartTime) - shieldTotalPausedTime;
        }
      } else {
        // If we're unpausing
        if (shieldPauseTime !== 0) {
          // Add the pause duration to total paused time
          shieldTotalPausedTime += (p.millis() - shieldPauseTime);
          shieldPauseTime = 0;
        }
        
        currentTime = p.millis();
        if (shieldStartTime !== null) {
          shieldElapsedTime = (currentTime - shieldStartTime) - shieldTotalPausedTime;
        }
      }
      
      if(!this.ifShield())
        return; // don't display if zero
        
      p.fill(50);
      p.rect(260*window.widthScale, 20*window.heightScale, (shieldMaxTime * 10 /1000)*window.widthScale, 25*window.heightScale);
      p.fill(143, 233, 250);
      p.rect(260*window.widthScale, 20*window.heightScale, ((shieldMaxTime * 10 /1000) - (shieldElapsedTime * 10 /1000)) * window.widthScale , 25*window.heightScale);

      p.fill(255);

      p.textSize(16*window.scale);
      p.text("Shield", 300*window.widthScale, 20*window.heightScale);


    }
    
    static shieldCollected(){ //a shield has been collected
      shieldStartTime = currentTime; //new start time
      shieldTotalPausedTime = 0; // Reset paused time for a new shield
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
      car.onCollisionEnter( wrench);
    }

    static bombCollected(car){
      bombInventory ++;
    }
    static placeBomb(p, car, bombs, isPaused = false){
      if (isPaused) return; // Don't place bombs when paused
      
      currentTime = p.millis();
      if((BombPlaceTime == null || currentTime - BombPlaceTime > BombWaitTime) && bombInventory > 0){
        let bombSize = 25;
        //////////////////////////bomb placement behind car//////////////////////
        let bombX = car.position.x - (gridSize * p.cos(car.angle)*1.5) - (bombSize/1.5 * p.cos(car.angle));
        let bombY = car.position.y - (gridSize * p.sin(car.angle)*1.5) - (bombSize/1.5 * p.sin(car.angle));

        let bombPlaced = new Bomb(p, bombX , bombY);

        const tileX = Math.floor(bombPlaced.position.x / gridSize);
        const tileY = Math.floor(bombPlaced.position.y / gridSize);
        let placeable = true;
        for (let j = tileY - 1; j <= tileY + 1; j++){
          for (let i = tileX - 1; i <= tileX + 1; i++){ 
            if (map[j] && map[j][i] instanceof Building)
              placeable = false;//position is not building//
          }
        }
        if(placeable){//position is not building//
          bombPlaced.placed = true;
          //console.log("Bomb Placed: " + Math.round(bombPlaced.position.x/gridSize) +", " + Math.round(bombPlaced.position.y/gridSize));
          bombs.push(bombPlaced);
          bombInventory --;
          BombPlaceTime = currentTime;
        }
        
      }
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
      this.animationStartTime = p.millis();
    }
  
    update() {
    }
  
    display(isPaused = false) {
      const p = this.p;
      let animationTime = isPaused ? this.animationStartTime : p.millis();
      const frameIndex = Math.floor(animationTime / frameDuration) % window.animations["coin"].length;
      const coinImg = window.animations["coin"][frameIndex];
  
      p.push();
        p.translate(this.position.x, this.position.y);
        p.imageMode(p.CENTER);
        p.noStroke();
        p.image(coinImg, 0, 0, this.size, this.size);
      p.pop();
      
      if (!isPaused) {
        this.animationStartTime = p.millis();
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
      this.animationStartTime = p.millis();
    }
  
    display(isPaused = false) { 
      const p = this.p;
      let animationTime = isPaused ? this.animationStartTime : p.millis();
      const frameIndex = Math.floor(animationTime / frameDuration) % window.animations["shield"].length;
      const shieldImg = window.animations["shield"][frameIndex];
  
      p.push();
        p.translate(this.position.x, this.position.y);
        p.imageMode(p.CENTER);
        p.noStroke();
        p.image(shieldImg, 0, 0, this.size, this.size);
      p.pop();
      
      if (!isPaused) {
        this.animationStartTime = p.millis();
      }
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
    this.animationStartTime = p.millis();
  }

  display(isPaused = false) { 
    const p = this.p;
    let animationTime = isPaused ? this.animationStartTime : p.millis();
    const frameIndex = Math.floor(animationTime / frameDuration) % window.animations["wrench"].length;
    const wrenchImg = window.animations["wrench"][frameIndex];

    p.push();
      p.translate(this.position.x, this.position.y);
      p.imageMode(p.CENTER);
      p.noStroke();
      p.image(wrenchImg, 0, 0, this.size, this.size);
    p.pop();
    
    if (!isPaused) {
      this.animationStartTime = p.millis();
    }
  }
}

class Bomb extends GameObject {
  constructor(p, x, y, size = 25) {
    super(x, y);
    this.p = p;
    this.size = size;
    this.collected = false;
    this.placed = false; //active bomb
    this.timeHit = null; //EXPLOSION ANIMATION
    this.attackDamage = 30 * window.difficulty; //damage from bombs
    this.collider = new Collider(
      this,
      "polygon",
      { offsetX: -8, offsetY: -9 },
      window.animations["bomb"][2]
    );
    this.animationStartTime = p.millis();
    this.explosionStartTime = null;
  }

  display(isPaused = false) { 
    const p = this.p;
    let animationTime = isPaused ? this.animationStartTime : p.millis();
    let bombImg = null;

    if (this.timeHit != null) { //EXPLOSION ANIMATION
      // For explosion, track a separate animation time
      if (this.explosionStartTime === null) {
        this.explosionStartTime = p.millis();
      }
      
      let explosionTime = isPaused ? this.explosionStartTime : p.millis();
      const frameIndex = Math.floor((explosionTime - this.timeHit) / frameDuration) % window.animations["bombExplosion"].length;
      bombImg = window.animations["bombExplosion"][frameIndex];
      
      // Update explosion animation time if not paused
      if (!isPaused && this.timeHit !== null) {
        this.explosionStartTime = p.millis();
      }
    }
    else if(this.placed){ //animate when active
      const frameIndex = Math.floor(animationTime / frameDuration) % window.animations["bomb"].length;
      bombImg = window.animations["bomb"][frameIndex];
    }
    else{ //inactive bomb
      bombImg = window.animations["bomb"][0];
    }

    p.push();
      p.translate(this.position.x, this.position.y);
      p.imageMode(p.CENTER);
      p.noStroke();
      p.image(bombImg, 0, 0, this.size, this.size);
    p.pop();
    
    if (!isPaused) {
      this.animationStartTime = p.millis();
    }
  }
}