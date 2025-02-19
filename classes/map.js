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


function drawMap(p, car) {
  p.background(255);
  p.translate(p.width / 2 - car.x, p.height / 2 - car.y); // Center view on car

  let colsVisible = Math.ceil(p.windowWidth / gridSize) + 2; // Gets canvas size 
  let rowsVisible = Math.ceil(p.windowHeight / gridSize) + 2;

  let startX = Math.floor(car.x / gridSize) - Math.floor(colsVisible / 2);
  let startY = Math.floor(car.y / gridSize) - Math.floor(rowsVisible / 2);

  for (let y = startY; y < startY + rowsVisible; y++) {
    for (let x = startX; x < startX + colsVisible; x++) {
      if (map[y] && map[y][x]) { // Check if tile exists
        map[y][x].draw(p);
      }
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
  let blockSize = 50;
  for(let i=1; i<5; ++i){
    drawRectRoad(p,119+(i*blockSize),5,128+(i*blockSize),252);   // Vertical roads
    drawRectRoad(p,119,22+(i*blockSize),380,31+(i*blockSize));    // Horizontal Roads
  }

  drawBezierRoad(p,15,160,150,225,15,260,9);
  drawAngledRoad(p,61,245,75,400,9);
  drawAngledRoad(p,86,218,119,226,8);
  //drawBezierRoad(10,10,30,30,40,5,6);

  //drawRectBuilding(27,25,47,39);
  //drawRectBuilding(27,57,35,97);
  //drawRowOfBuildings(1,1,12,101,8);
  fillBigBuildings(p,1,200,130,400);
  fillShopsDynamically(p,1,1,100,180);
  fillBuildingsDynamically(p,120,1,400,250);
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

// Draws a curved road curving towards x1,y1 starting from x0).
function drawBezierRoad(p,x0, y0, x1, y1, x2, y2, width) {
  let numSteps = 1000; // Increase number when turn has random grass spots
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



// Draws Buildings given the cordinates 

function drawRectBuilding(p, xStart, yStart, xEnd, yEnd) {
  for (let y = yStart; y < yEnd; y++) {
    for (let x = xStart; x < xEnd; x++) {
      if (map[y] && map[y][x] !== undefined) {
        map[y][x] = new Building(x * gridSize, y * gridSize);
      }
    }
  }
}

function drawAngle45Building(p, xStart, yStart, xEnd, yEnd, width) {
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
