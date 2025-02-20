class Building extends GameObject {
  
  constructor(p, x, y, width, height, img = null) {
    super(x, y);
    this.p = p;
    this.width = width;
    this.height = height;
    this.currentImage = img;
    this.isStatic = true;
    this.collider = new Collider(this, "rectangle", { width: this.width, height: this.height, offsetX: -this.width/2, offsetY: -this.height/2 });
    console.log(`Building: Created Building (id:${this.id}) at (${x}, ${y}) with image: ${this.currentImage ? 'Yes' : 'No'}.`);
  }
  
  update() {
    
  }
  
  display() {
    let p = this.p;
    p.push();
    p.translate(this.position.x, this.position.y);
    if (this.currentImage) {
      p.image(this.currentImage, -this.width / 2, -this.height / 2, this.width, this.height);
    } else {
      p.fill("yellow");
      p.noStroke();
      p.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    }
    p.pop();
  }
}
