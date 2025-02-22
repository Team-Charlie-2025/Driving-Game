//classes/collider.js
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
        // get rotation / apply // translate
        const angle = this.gameObject.angle || 0;
        const pInst = this.gameObject.p;
        return this.options.vertices.map(v => {
          const rotatedX = v.x * pInst.cos(angle) - v.y * pInst.sin(angle);
          const rotatedY = v.x * pInst.sin(angle) + v.y * pInst.cos(angle);
          return new p5.Vector(rotatedX + this.gameObject.position.x, rotatedY + this.gameObject.position.y);
        });
      }
      return [];
    }
    
    intersects(other) {
      // calculates intersections by:
      // rectangles: overlap coordinate points
      // polygons: calls function
      // rect/poly and poly/rect convert rect to vectors and compare with poly funct
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
    
    drawOutline() {
      // debugging
      const p = this.gameObject.p;
      p.push();
      p.noFill();
      p.stroke(255, 0, 0); // collision display
      p.strokeWeight(2);
      
      if (this.shape === "rectangle") {
        p.rect(this.x, this.y, this.options.width, this.options.height);
      } else if (this.shape === "polygon") {
        p.beginShape();
        for (let v of this.polygonVertices) {
          p.vertex(v.x, v.y);
        }
        p.endShape(p.CLOSE);
      }
      p.pop();
    }
  }