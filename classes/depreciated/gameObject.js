// classes/gameObject.js

class GameObject {
    constructor(x, y) {
      this.position = new p5.Vector(x, y);
      this.collider = null;
      this.id = GameObject.nextId++;
      this.isColliding = false;
      this.isStatic = false;
    }
    
    update() {}
    display() {}
    
    onCollisionEnter(other) {
      this.isColliding = true;
      if(debug) console.log(`${this.constructor.name} (id:${this.id}) onCollisionEnter with ${other.constructor.name} (id:${other.id}).`);
    }
    
    onCollisionExit(other) {
      this.isColliding = false;
      if(debug) console.log(`${this.constructor.name} (id:${this.id}) onCollisionExit with ${other.constructor.name} (id:${other.id}).`);
    }
  }
  GameObject.nextId = 0;