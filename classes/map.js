// classes/map.js
let map = [];
const gridSize = 64; // Size of each grid cell

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

function generateDevMap(p, rows, cols, buildingImg) {
  map = [];
  for (let y = 0; y < rows; y++) {
    map[y] = [];
    for (let x = 0; x < cols; x++) {
      map[y][x] = new Road(p, x * gridSize + gridSize/2, y * gridSize + gridSize/2, gridSize, gridSize);
      console.assert(map[y][x] !== undefined, `generateDevMap: Map cell at (${x}, ${y}) is undefined.`);
    }
  }
  console.log(`generateDevMap: Generated base map with ${rows} rows and ${cols} columns.`);
  drawRect(p, 20, 6, 8, 8, buildingImg);
  drawRect(p, 36, 6, 8, 8, buildingImg);
  drawRect(p, 20, 22, 8, 8, buildingImg);
  drawRect(p, 36, 22, 8, 8, buildingImg);
  console.log("generateDevMap: Completed procedural generation of Buildings.");
}

function drawRect(p, xStart, yStart, xLength, yLength, buildingImg) {
  for (let y = yStart; y < yStart + yLength; y++) {
    for (let x = xStart; x < xStart + xLength; x++) {
      if (map[y] && map[y][x] !== undefined) {
        map[y][x] = new Building(p, x * gridSize + gridSize/2, y * gridSize + gridSize/2, gridSize, gridSize, buildingImg);
      }
    }
  }
  console.log(`drawRect: Replaced region starting at (${xStart},${yStart}) of size (${xLength}x${yLength}) with Buildings.`);
}

function drawMap(p) {
  p.background(255);
  for (let row of map) {
    for (let cell of row) {
      if (cell && typeof cell.display === "function") {
        cell.display();
      } else {
        console.warn("drawMap: cell.display is not a function for cell:", cell);
      }
    }
  }
}



