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

        let colliding = objA.collider?.intersects(objB.collider);
        let key = this._pairKey(objA, objB);

        if (colliding) {
          newCollisionPairs.add(key);
          if (!this.collisionPairs.has(key)) {
            objA.onCollisionEnter?.(objB);
            objB.onCollisionEnter?.(objA);
          }
        } else {
          if (this.collisionPairs.has(key)) {
            objA.onCollisionExit?.(objB);
            objB.onCollisionExit?.(objA);
          }
        }
      }
    }
    this.collisionPairs = newCollisionPairs;
  }
}