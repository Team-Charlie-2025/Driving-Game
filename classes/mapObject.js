/* classes/mapObject.js */
// Assumes gridSize is defined globally (see map.js)

class Building extends GameObject {
    constructor(p, x, y, width, height, img = null) {
      super(x, y);
      this.p = p;
      this.width = width;
      this.height = height;
      this.currentImage = img;
      this.isStatic = true;
      this.collider = new Collider(this, "rectangle", {
        width: this.width,
        height: this.height,
        offsetX: -this.width / 2,
        offsetY: -this.height / 2,
      });
    }
  
    update() {
      // Buildings are static; no update needed.
    }
  
    display() {
      let p = this.p;
      p.push();
      p.translate(this.position.x, this.position.y);
      if (this.currentImage) {
        p.image(
          this.currentImage,
          -this.width / 2,
          -this.height / 2,
          this.width,
          this.height
        );
      } else {
        p.fill("yellow"); // Buildings appear yellow.
        p.noStroke();
        p.rect(-this.width / 2, -this.height / 2, this.width, this.height);
      }
      p.pop();
    }
  }
  
  class Road extends GameObject {
    constructor(p, x, y, width, height) {
      super(x, y);
      this.p = p;
      this.width = width;
      this.height = height;
      this.isStatic = true;
      this.collider = null;
      console.log(`Road: Created Road (id:${this.id}) at (${x}, ${y}).`);
    }
  
    update() {
      // Roads are static.
    }
  
    display() {
      let p = this.p;
      p.push();
      p.translate(this.position.x, this.position.y);
      p.fill("gray"); // Roads are drawn in gray.
      p.noStroke();
      p.rect(-this.width / 2, -this.height / 2, this.width, this.height);
      p.pop();
    }
  }
  
  class Grass {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.color = "green"; // Grass is green.
      this.width = gridSize;
      this.height = gridSize;
    }
  
    draw(p) {
      p.fill(this.color);
      p.noStroke();
      p.rect(this.x, this.y, this.width, this.height);
    }
  }
  