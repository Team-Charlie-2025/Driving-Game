// // Add this to your physics.js file (or as a separate class file)
// class Road extends GameObject {
//     constructor(p, x, y, width, height) {
//       super(x, y);
//       this.p = p;
//       this.width = width;
//       this.height = height;
//       // No collider is assigned so that collisions aren’t triggered.
//     }
//     update() {
//       // Roads are static.
//     }
//     display() {
//       let p = this.p;
//       p.push();
//       p.translate(this.position.x, this.position.y);
//       p.fill(200); // Road color.
//       p.noStroke();
//       p.rect(0, 0, this.width, this.height);
//       p.pop();
//     }
//   }
  