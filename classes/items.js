const shieldMaxTime = 10000; //max time, milliseconds
let shieldStartTime = null; //start time
let currentTime;
let shieldElapsedTime; 

class ItemsManager {
    static ifShield(){
      if(shieldStartTime == null) return false;
      return shieldElapsedTime <= shieldMaxTime;
    }
    static shieldDisplayBar(p){
      currentTime = p.millis();
      shieldElapsedTime = (currentTime - shieldStartTime);
      if(!this.ifShield())
        return; //dont display if zero?
      p.fill(50);
      p.rect(300, 20, shieldMaxTime * 10 /1000, 25);
      p.fill(0, 255, 0);
      p.rect(300, 20, (shieldMaxTime * 10 /1000) - (shieldElapsedTime * 10 /1000) , 25);

      p.fill(255);
      p.textSize(16);
      p.text("Shield", 300, 20);

    }
    static shieldCollected(){ //a shield has been collected
      shieldStartTime = currentTime; //new start time
    }
    static shieldDamage(damageTaken){
        if (!this.ifShield()){
            return damageTaken; //no shield active
        }
        /*
        else if (damageTaken <= currentShield){
            currentShield -=damageTaken; //shield active
            return 0;
        }
        else{ //shield active but weak
            let temp = currentShield;
            currentShield = 0;
            return damageTaken - temp;
        }
        */
       else
        return 0;

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