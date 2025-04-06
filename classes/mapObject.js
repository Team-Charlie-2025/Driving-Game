class BaseTile extends GameObject {
  constructor(p, x, y, width, height, img, defaultColor, createCollider = true) {
    super(x, y);
    this.p = p;
    this.width = width;
    this.height = height;
    this.currentImage = img;
    this.defaultColor = defaultColor;
    this.isStatic = true;
    if (createCollider) {
      this.collider = new Collider(this, "rectangle", {
        width: this.width,
        height: this.height,
        offsetX: -this.width / 2,
        offsetY: -this.height / 2,
      });
    }
  }

  update() {
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
      p.fill(this.defaultColor);
      p.noStroke();
      p.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    }
    p.pop();
  }
}

class Grass extends BaseTile {
  constructor(p, x, y, width, height, img = null) {
    super(p, x, y, width, height, img = grassImg, "green", false);
  }
}

class Building extends BaseTile {
  constructor(p, x, y, width, height, img = null) {
    super(p, x, y, width, height, img, "yellow");
  }
}

class Rocks extends BaseTile {
  constructor(p, x, y, width, height, img = null) {
    super(p, x, y, width, height, img, "white");
  }
}

class Water extends BaseTile {
  constructor(p, x, y, width, height, img = null) {
    super(p, x, y, width, height, img=waterImg, "blue");
  }
}

class Road extends BaseTile {
  constructor(p, x, y, width, height) {
    super(p, x, y, width, height, null, "gray", false);
  }
}
