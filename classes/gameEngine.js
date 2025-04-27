// classes/_gameEngine.js

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
      if (debug) console.log(
          `${this.constructor.name} (id:${this.id}) onCollisionEnter with ${other.constructor.name} (id:${other.id}).`
      );
  }

  onCollisionExit(other) {
      this.isColliding = false;
      if (debug) console.log(
          `${this.constructor.name} (id:${this.id}) onCollisionExit with ${other.constructor.name} (id:${other.id}).`
      );
  }
}
GameObject.nextId = 0;

class PhysicsEngine {
  constructor() {
      this.objects = [];
      this.collisionPairs = new Set();
      this._lastLog = Date.now();
  }

  add(object) {
      if (object.collider) {
          this.objects.push(object);
      }
  }

  remove(object) {
      this.objects = this.objects.filter(o => o !== object);
  }

  _pairKey(a, b) {
      return a.id < b.id ? `${a.id}-${b.id}` : `${b.id}-${a.id}`;
  }

  update() {
      // build tree
      const pw = window.mapCols * window.gridSize;
      const ph = window.mapRows * window.gridSize;
      const boundary = new Rectangle(pw/2, ph/2, pw/2, ph/2);
      const qt = new QuadTree(boundary, 4);
      for (let obj of this.objects) {
          qt.insert({ x: obj.position.x, y: obj.position.y, userData: obj });
      }

      // collision via quadtree
      const newPairs = new Set();
      for (let a of this.objects) {
          const r = new Rectangle(a.position.x, a.position.y, (a.width||0)/2, (a.height||0)/2);
          const candidates = qt.query(r);
          for (let pt of candidates) {
              const b = pt.userData;
              if (b.id <= a.id || (a.isStatic && b.isStatic)) continue;
              // count every intersects call
              const colliding = a.collider.intersects(b.collider);
              const key = this._pairKey(a, b);
              if (colliding) {
                  newPairs.add(key);
                  if (!this.collisionPairs.has(key)) {
                      a.onCollisionEnter(b);
                      b.onCollisionEnter(a);
                  }
              } else if (this.collisionPairs.has(key)) {
                  a.onCollisionExit(b);
                  b.onCollisionExit(a);
              }
          }
      }
      this.collisionPairs = newPairs;

      // log intersects/sec once per second, debugging. can disable.
      const now = Date.now();
      if (now - this._lastLog >= 1000) {
          console.log(`Collider.intersects calls/sec: ${Collider.intersectCount}`);
          Collider.intersectCount = 0;
          this._lastLog = now;
      }
  }
}

class Collider {
  static intersectCount = 0;

  constructor(gameObject, shape, options, img = null) {
      this.gameObject = gameObject;
      if (img) {
          const poly = getImagePolygon(img);
          const ox = options.offsetX||0, oy = options.offsetY||0;
          this.shape = 'polygon';
          this.options = { vertices: poly.map(v => new p5.Vector(v.x+ox, v.y+oy)), offsetX:ox, offsetY:oy };
      } else {
          this.shape = shape;
          this.options = options;
      }
  }

  get x() { return this.gameObject.position.x + (this.options.offsetX||0); }
  get y() { return this.gameObject.position.y + (this.options.offsetY||0); }
  get polygonVertices() {
      if (this.shape !== 'polygon') return [];
      const ang = this.gameObject.angle||0;
      const pInst = this.gameObject.p;
      return this.options.vertices.map(v => {
          const rx = v.x*pInst.cos(ang) - v.y*pInst.sin(ang);
          const ry = v.x*pInst.sin(ang) + v.y*pInst.cos(ang);
          return new p5.Vector(rx + this.gameObject.position.x, ry + this.gameObject.position.y);
      });
  }

  intersects(other) {
    // // first check to look through outer bounds of bigger area, for consistency in performance
    //   const dx = Math.abs(this.gameObject.position.x - other.gameObject.position.x);
    //   const dy = Math.abs(this.gameObject.position.y - other.gameObject.position.y);
    //   if (dx > gridSize*2 || dy > gridSize*2) {
    //       Collider.intersectCount++;
    //       return false;
    //   }
      Collider.intersectCount++;
      // rectangle vs rectangle
      if (this.shape==='rectangle' && other.shape==='rectangle') {
          return this.x < other.x + other.options.width &&
                 this.x + this.options.width > other.x &&
                 this.y < other.y + other.options.height &&
                 this.y + this.options.height > other.y;
      }
      // polygon vs polygon
      if (this.shape==='polygon' && other.shape==='polygon') {
          return polygonsIntersect(this.polygonVertices, other.polygonVertices);
      }
      // rectangle vs polygon
      let rectPoly;
      if (this.shape==='rectangle' && other.shape==='polygon') {
          rectPoly = [
              new p5.Vector(this.x, this.y),
              new p5.Vector(this.x+this.options.width, this.y),
              new p5.Vector(this.x+this.options.width, this.y+this.options.height),
              new p5.Vector(this.x, this.y+this.options.height)
          ];
          return polygonsIntersect(rectPoly, other.polygonVertices);
      }
      if (this.shape==='polygon' && other.shape==='rectangle') {
          rectPoly = [
              new p5.Vector(other.x, other.y),
              new p5.Vector(other.x+other.options.width, other.y),
              new p5.Vector(other.x+other.options.width, other.y+other.options.height),
              new p5.Vector(other.x, other.y+other.options.height)
          ];
          return polygonsIntersect(this.polygonVertices, rectPoly);
      }
      return false;
  }

  drawOutline(shield=false) {
      const p = this.gameObject.p;
      p.push(); p.noFill();
      p.stroke(shield?[143,233,250]:[255,0,0]); p.strokeWeight(2);
      if (this.shape==='rectangle') {
          p.rect(this.x, this.y, this.options.width, this.options.height);
      } else {
          p.beginShape(); for (let v of this.polygonVertices) p.vertex(v.x,v.y); p.endShape(p.CLOSE);
      }
      p.pop();
  }
}
