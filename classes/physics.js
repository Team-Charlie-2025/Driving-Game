// classes/physics.js
  class PhysicsEngine {
    constructor() {
      this.objects = [];
      this.collisionPairs = new Set();
    }
    
    add(object) {
      if (object.collider) {
        this.objects.push(object);
      }
    }
    
    remove(object) {
      this.objects = this.objects.filter(o => o !== object);
    }
    
    _pairKey(objA, objB) {
      return (objA.id < objB.id) ? `${objA.id}-${objB.id}` : `${objB.id}-${objA.id}`;
    }
    
    update() {
      let newCollisionPairs = new Set();
      for (let i = 0; i < this.objects.length; i++) {
        for (let j = i + 1; j < this.objects.length; j++) {
          let objA = this.objects[i];
          let objB = this.objects[j];
          if (objA.isStatic && objB.isStatic) continue;
          let key = this._pairKey(objA, objB);
          let colliding = false;
          if (objA.collider && objB.collider) {
            colliding = objA.collider.intersects(objB.collider);
          }
          if (colliding) {
            newCollisionPairs.add(key);
            if (!this.collisionPairs.has(key)) {
              // console.log(`${objA.constructor.name} (id:${objA.id}) collision ENTER with ${objB.constructor.name} (id:${objB.id})`);
              if (objA.onCollisionEnter) objA.onCollisionEnter(objB);
              if (objB.onCollisionEnter) objB.onCollisionEnter(objA);
            }
          } else {
            if (this.collisionPairs.has(key)) {
              // console.log(`${objA.constructor.name} (id:${objA.id}) collision EXIT with ${objB.constructor.name} (id:${objB.id})`);
              if (objA.onCollisionExit) objA.onCollisionExit(objB);
              if (objB.onCollisionExit) objB.onCollisionExit(objA);
            }
          }
        }
      }
      this.collisionPairs = newCollisionPairs;
    }
  }
