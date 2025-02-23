//classes/gameObject.js
class GameObject {
    constructor(x, y) {
      this.position = new p5.Vector(x, y);
      this.collider = null;
      this.id = GameObject.nextId++;  // standard id incrementing for uniqueness/debug
      this.isColliding = false;  // used for triggers or debugs
      this.isStatic = false;  // object never moves
    }
    
    update() {}
    display() {}
    
    onCollisionEnter(other) {
      this.isColliding = true;
      // console.log(`${this.constructor.name} (id:${this.id}) onCollisionEnter with ${other.constructor.name} (id:${other.id}).`);
    }
    
    onCollisionExit(other) {
      this.isColliding = false;
      // console.log(`${this.constructor.name} (id:${this.id}) onCollisionExit with ${other.constructor.name} (id:${other.id}).`);
    }
  }
  GameObject.nextId = 0;