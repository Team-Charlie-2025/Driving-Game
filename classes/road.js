// classes/road.js

class Road extends GameObject {
    constructor(p, x, y, width, height) {
      super(x, y);
      this.p = p;
      this.width = width;
      this.height = height;
      this.isStatic = true;
      this.collider = null;
    }
    
    update() {}
    
    display() {
      let p = this.p;
      p.push();
      p.translate(this.position.x, this.position.y);
      p.fill(200);
      p.noStroke();
      p.rect(-this.width / 2, -this.height / 2, this.width, this.height);
      p.pop();
    }
  }
  