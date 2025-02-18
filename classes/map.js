// classes/map.js
let map = [];
const gridSize = 32; // Size of each grid cell

class Building {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = 'yellow';
    this.width = gridSize;
    this.height = gridSize;
  }

  draw(p) {
    p.fill(this.color);
    p.noStroke();
    p.rect(this.x, this.y, this.width, this.height);
  }
}

class Road {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = 'white';
    this.width = gridSize;
    this.height = gridSize;
  }

  draw(p) {
    p.fill(this.color);
    p.rect(this.x, this.y, this.width, this.height);
  }
}

class Grass {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = 'green';
    this.width = gridSize;
    this.height = gridSize;
  }

  draw(p) {
    p.fill(this.color);
    p.noStroke();
    p.rect(this.x, this.y, this.width, this.height);
  }
}
function generateRandomMap(p, rows, cols) {
  map = [];
  for (let y = 0; y < rows; y++) {
    map[y] = [];
    for (let x = 0; x < cols; x++) {
      if (p.random() > 0.1) {
        map[y][x] = new Road(x * gridSize, y * gridSize);
      } else {
        map[y][x] = new Building(x * gridSize, y * gridSize);
      }
      if (y > (rows / 2) + 2 && y < (rows / 2) - 2) {
        map[y][x] = new Building(x * gridSize, y * gridSize);
      }
    }
  }
}

function generateMap(p, rows, cols) {
  map = [];
  for (let y = 0; y < rows; y++) {
    map[y] = [];
    for (let x = 0; x < cols; x++) {
      map[y][x] = new Building(x * gridSize, y * gridSize);
    }
  }
  let roadWidth = 3;
  // Horizontal roads
  for (let y = roadWidth; y < rows; y += roadWidth * 2) {
    for (let x = 0; x < cols; x++) {
      for (let z = 0; z < roadWidth; z++) {
        if (y + z == rows) break;
        else map[y + z][x] = new Road(x * gridSize, (y + z) * gridSize);
      }
    }
  }
  // Vertical roads
  for (let x = roadWidth; x < cols; x += roadWidth * 2) {
    for (let y = 0; y < rows; y++) {
      for (let z = 0; z < roadWidth; z++) {
        map[y][x + z] = new Road((x + z) * gridSize, y * gridSize);
      }
    }
  }
  // Diagonal roads
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      if (x - y <= roadWidth && y - x <= roadWidth) {
        map[y][x] = new Road(x * gridSize, y * gridSize);
      }
    }
  }
}

function generateDevMap(p, rows, cols) {
  map = [];
  for (let y = 0; y < rows; y++) {
    map[y] = [];
    for (let x = 0; x < cols; x++) {
      map[y][x] = new Road(x * gridSize, y * gridSize);
    }
  }
  drawRectBuilding(p, 20, 6, 8, 8);
  drawRectBuilding(p, 36, 6, 8, 8);
  drawRectBuilding(p, 20, 22, 8, 8);
  drawRectBuilding(p, 36, 22, 8, 8);

  drawAngle45(p, 45, 13, 58, 0, 4);
  drawAngle45(p, 45, 25, 58, 8, 4);
  drawAngledBuilding(p, 19, 10, 0, 16, 4);
  drawAngledBuilding(p, 19, 24, 0, 29, 4);
}

function drawRectBuilding(p, xStart, yStart, xEnd, yEnd) {
  for (let y = yStart; y < yEnd; y++) {
    for (let x = xStart; x < xEnd; x++) {
      if (map[y] && map[y][x] !== undefined) {
        map[y][x] = new Building(x * gridSize, y * gridSize);
      }
    }
  }
}

function drawAngle45(p, xStart, yStart, xEnd, yEnd, width) {
  let stepX = xStart < xEnd ? 1 : -1;
  let stepY = yStart < yEnd ? 1 : -1;
  let length = Math.abs(xEnd - xStart);
  for (let i = 0; i <= length; i++) {
    let baseX = xStart + i * stepX;
    let baseY = yStart + i * stepY;
    for (let j = -Math.floor(width / 2); j <= Math.floor(width / 2); j++) {
      let buildX = baseX + j;
      let buildY = baseY;
      if (map[buildY] && map[buildY][buildX] !== undefined) {
        map[buildY][buildX] = new Building(buildX * gridSize, buildY * gridSize);
      }
    }
  }
}

function drawAngledBuilding(p, xStart, yStart, xEnd, yEnd, width) {
  let dx = Math.abs(xEnd - xStart);
  let dy = Math.abs(yEnd - yStart);
  let stepX = xStart < xEnd ? 1 : -1;
  let stepY = yStart < yEnd ? 1 : -1;
  let err = dx - dy;
  let x = xStart;
  let y = yStart;
  while (x !== xEnd || y !== yEnd) {
    for (let j = -Math.floor(width / 2); j <= Math.floor(width / 2); j++) {
      let perpX = (dy > dx) ? j : 0;
      let perpY = (dx > dy) ? j : 0;
      let buildX = x + perpX;
      let buildY = y + perpY;
      if (map[buildY] && map[buildY][buildX] !== undefined) {
        map[buildY][buildX] = new Building(buildX * gridSize, buildY * gridSize);
      }
    }
    let e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x += stepX;
    }
    if (e2 < dx) {
      err += dx;
      y += stepY;
    }
  }
}

//############################ Procedural Map ##############################
// This is the beginning of generation, starts with blank map of grass, adds roads, then takes grass and fills it with buildings
function generateGenMap(p,rows,cols){
  for(let y=0; y<rows; y++){
    map[y] = [];
    for(let x=0; x<cols; x++){
      map[y][x] = new Grass(x*gridSize, y*gridSize);
    }
  }
  drawRectRoad(p,12,1,25,420);
  drawAngledRoad(p,20,15,420,42,11);
  drawBezierRoad(p,50,18,70,50,18,50,9);
  drawAngledRoad(p,40,47,120,119,9);
  drawRectRoad(p,119,22,130,252);
  //drawBezierRoad(10,10,30,30,40,5,6);

  //drawRectBuilding(27,25,47,39);
  //drawRectBuilding(27,57,35,97);
  //drawRowOfBuildings(1,1,12,101,8);
  fillBigBuildings(p);
  fillBuildingsDynamically(p);
  drawBezierRoad(p,20,105,80,100,75,75,9)
  
  
}

function drawRectRoad(p,xStart,yStart,xEnd,yEnd){
  for(let y=yStart; y<yEnd; y++){
    for(let x=xStart; x<xEnd; x++){
      if(map[y][x] !== undefined){
        map[y][x] = new Road(x*gridSize, y*gridSize);
        }
      }
  }
}

// This function only works if its not a 45 angle
function drawAngledRoad(p,xStart, yStart, xEnd, yEnd, width) {

  let dx = Math.abs(xEnd - xStart);
  let dy = Math.abs(yEnd - yStart);
  let stepX = xStart < xEnd ? 1 : -1;
  let stepY = yStart < yEnd ? 1 : -1;

  let err = dx - dy;
  let x = xStart;
  let y = yStart;

  // Iterate using Bresenham-like logic to move along the slope
  while (x !== xEnd || y !== yEnd) {
    // Apply width perpendicular to the slope
    for (let j = -Math.floor(width / 2); j <= Math.floor(width / 2); j++) {
      let perpX = (dy > dx) ? j : 0; // Offset horizontally for steep slopes
      let perpY = (dx > dy) ? j : 0; // Offset vertically for shallow slopes

      let buildX = x + perpX;
      let buildY = y + perpY;

      if (map[buildY] && map[buildY][buildX] !== undefined) {
        map[buildY][buildX] = new Road(buildX * gridSize, buildY * gridSize);
      }
    }

    // Bresenham step to follow the line
    let e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x += stepX; }
    if (e2 < dx) { err += dx; y += stepY; }
  }
}

//Need to start it inside the previous road
function drawBezierRoad(p,x0, y0, x1, y1, x2, y2, width) {
  let numSteps = 1000; // Increase number when turn has 
  let prevX = x0, prevY = y0;

  for (let i = 0; i <= numSteps; i++) {
    let t = i / numSteps;
    
    // Quadratic Bézier formula
    let x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * x1 + t * t * x2;
    let y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * y1 + t * t * y2;

    // Compute the tangent vector (direction of curve at this point)
    let tangentX = x - prevX;
    let tangentY = y - prevY;
    let length = Math.sqrt((tangentX * tangentX) + (tangentY * tangentY));
    
    // Normalize tangent to get a perpendicular direction
    let perpX = -tangentY / length;
    let perpY = tangentX / length;

    // Apply width consistently along the curve
    for (let j = -Math.floor(width / 2); j <= Math.floor(width / 2); j++) {
      let buildX = Math.round(x + j * perpX);
      let buildY = Math.round(y + j * perpY);

      if (map[buildY] && map[buildY][buildX] !== undefined) {
        map[buildY][buildX] = new Road(buildX * gridSize, buildY * gridSize);
      }
    }

    prevX = x;
    prevY = y;
  }
}


function drawMap(p) {
  p.background(255);
  for (let row of map) {
    for (let cell of row) {
      cell.draw(p);
    }
  }
}

