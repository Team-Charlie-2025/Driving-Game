// classes/physics.js

function pointInPolygon(point, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      let xi = polygon[i].x, yi = polygon[i].y;
      let xj = polygon[j].x, yj = polygon[j].y;
      let intersect = ((yi > point.y) !== (yj > point.y)) &&
        (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }
  
  function lineIntersects(p1, p2, p3, p4) {
    let denom = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
    if (denom === 0) return false;
    let ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denom;
    let ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denom;
    return (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1);
  }
  
  function polygonsIntersect(poly1, poly2) {
    for (let i = 0; i < poly1.length; i++) {
      let nextI = (i + 1) % poly1.length;
      for (let j = 0; j < poly2.length; j++) {
        let nextJ = (j + 1) % poly2.length;
        if (lineIntersects(poly1[i], poly1[nextI], poly2[j], poly2[nextJ])) {
          return true;
        }
      }
    }
    if (pointInPolygon(poly1[0], poly2)) return true;
    if (pointInPolygon(poly2[0], poly1)) return true;
    return false;
  }
  
  function getImagePolygon(img, alphaThreshold = 0) {
    img.loadPixels();
    let w = img.width, h = img.height;
    let binary = [];
    for (let y = 0; y < h; y++) {
      binary[y] = [];
      for (let x = 0; x < w; x++) {
        let idx = 4 * (x + y * w);
        let a = img.pixels[idx + 3];
        binary[y][x] = (a > alphaThreshold);
      }
    }
    let start = null;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (binary[y][x]) {
          start = { x, y };
          break;
        }
      }
      if (start) break;
    }
    if (!start) {
      console.error("getImagePolygon: No opaque pixels found in image!");
      return [];
    }
    let contour = [];
    let current = start;
    let directions = [
      { dx: 0, dy: -1 },
      { dx: 1, dy: -1 },
      { dx: 1, dy: 0 },
      { dx: 1, dy: 1 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 1 },
      { dx: -1, dy: 0 },
      { dx: -1, dy: -1 }
    ];
    let prevDirIndex = 6;
    contour.push({ x: current.x, y: current.y });
    while (true) {
      let startDir = (prevDirIndex + 1) % 8;
      let found = false;
      let next = null;
      let nextDirIndex = null;
      for (let i = 0; i < 8; i++) {
        let dirIndex = (startDir + i) % 8;
        let nx = current.x + directions[dirIndex].dx;
        let ny = current.y + directions[dirIndex].dy;
        if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
        if (binary[ny][nx]) {
          next = { x: nx, y: ny };
          nextDirIndex = dirIndex;
          found = true;
          break;
        }
      }
      if (!found) break;
      prevDirIndex = (nextDirIndex + 6) % 8;
      current = next;
      if (current.x === start.x && current.y === start.y) break;
      else contour.push({ x: current.x, y: current.y });
      if (contour.length > w * h) break; // safety check
    }
    console.log(`getImagePolygon: Generated contour with ${contour.length} vertices.`);
    return contour;
  }

  class PhysicsEngine {
    constructor() {
      this.objects = [];
      this.collisionPairs = new Set();
      console.log("PhysicsEngine: Initialized.");
    }
    
    add(object) {
      if (object.collider) {
        this.objects.push(object);
        console.log(`PhysicsEngine: Added ${object.constructor.name} (id:${object.id}).`);
      } else {
        console.log(`PhysicsEngine: Object ${object.constructor.name} (id:${object.id}) has no collider; not added.`);
      }
    }
    
    remove(object) {
      this.objects = this.objects.filter(o => o !== object);
      console.log(`PhysicsEngine: Removed ${object.constructor.name} (id:${object.id}).`);
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
              console.log(`${objA.constructor.name} (id:${objA.id}) collision ENTER with ${objB.constructor.name} (id:${objB.id})`);
              if (objA.onCollisionEnter) objA.onCollisionEnter(objB);
              if (objB.onCollisionEnter) objB.onCollisionEnter(objA);
            }
          } else {
            if (this.collisionPairs.has(key)) {
              console.log(`${objA.constructor.name} (id:${objA.id}) collision EXIT with ${objB.constructor.name} (id:${objB.id})`);
              if (objA.onCollisionExit) objA.onCollisionExit(objB);
              if (objB.onCollisionExit) objB.onCollisionExit(objA);
            }
          }
        }
      }
      this.collisionPairs = newCollisionPairs;
    }
  }
  
  class Collider {
    constructor(gameObject, shape, options, img = null) {
      this.gameObject = gameObject;
      if (img !== null) {
        let poly = getImagePolygon(img);
        let offsetX = options.offsetX || 0;
        let offsetY = options.offsetY || 0;
        let vertices = poly.map(v => new p5.Vector(v.x + offsetX, v.y + offsetY));
        this.shape = "polygon";
        this.options = { vertices, offsetX, offsetY };
        console.log(`Collider: Created polygon collider for ${gameObject.constructor.name} (id:${gameObject.id}) with ${vertices.length} vertices.`);
      } else {
        this.shape = shape;
        this.options = options;
        console.log(`Collider: Created ${shape} collider for ${gameObject.constructor.name} (id:${gameObject.id}).`);
      }
    }
    
    get x() {
      return this.gameObject.position.x + (this.options.offsetX || 0);
    }
    
    get y() {
      return this.gameObject.position.y + (this.options.offsetY || 0);
    }
    
    get polygonVertices() {
      if (this.shape === "polygon") {
        return this.options.vertices.map(v => new p5.Vector(v.x + this.gameObject.position.x, v.y + this.gameObject.position.y));
      }
      return [];
    }
    
    intersects(other) {
      if (this.shape === "rectangle" && other.shape === "rectangle") {
        return (
          this.x < other.x + other.options.width &&
          this.x + this.options.width > other.x &&
          this.y < other.y + other.options.height &&
          this.y + this.options.height > other.y
        );
      } else if (this.shape === "polygon" && other.shape === "polygon") {
        return polygonsIntersect(this.polygonVertices, other.polygonVertices);
      } else if (this.shape === "rectangle" && other.shape === "polygon") {
        let rectPoly = [
          new p5.Vector(this.x, this.y),
          new p5.Vector(this.x + this.options.width, this.y),
          new p5.Vector(this.x + this.options.width, this.y + this.options.height),
          new p5.Vector(this.x, this.y + this.options.height)
        ];
        return polygonsIntersect(rectPoly, other.polygonVertices);
      } else if (this.shape === "polygon" && other.shape === "rectangle") {
        let rectPoly = [
          new p5.Vector(other.x, other.y),
          new p5.Vector(other.x + other.options.width, other.y),
          new p5.Vector(other.x + other.options.width, other.y + other.options.height),
          new p5.Vector(other.x, other.y + other.options.height)
        ];
        return polygonsIntersect(this.polygonVertices, rectPoly);
      }
      return false;
    }
  }

  class GameObject {
    constructor(x, y) {
      this.position = new p5.Vector(x, y);
      this.collider = null;
      this.id = GameObject.nextId++;
      this.isColliding = false;
      this.isStatic = false;
      console.log(`GameObject: Created ${this.constructor.name} (id:${this.id}) at (${x}, ${y}).`);
    }
    
    update() {}
    display() {}
    
    onCollisionEnter(other) {
      this.isColliding = true;
      console.log(`${this.constructor.name} (id:${this.id}) onCollisionEnter with ${other.constructor.name} (id:${other.id}).`);
    }
    
    onCollisionExit(other) {
      this.isColliding = false;
      console.log(`${this.constructor.name} (id:${this.id}) onCollisionExit with ${other.constructor.name} (id:${other.id}).`);
    }
  }
  GameObject.nextId = 0;