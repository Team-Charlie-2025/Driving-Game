let map = [];
const gridSize = 32; // Length and width of the grid

// Building class to represent a yellow building
class Building {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = 'yellow';
    this.width = gridSize;
    this.height = gridSize;
    //roadWidth = 3;
  }

  draw() {
    fill(this.color);
    noStroke();
    rect(this.x, this.y, this.width, this.height);
  }
}

// Road class to represent a grey road
class Road {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = 'white';
    this.width = gridSize;
    this.height = gridSize;
  }

  draw() {
    fill(this.color);
    //noStroke();
    rect(this.x, this.y, this.width, this.height);
  }
}

// This function needs logic to make sense but it gives nice open area

function generateRandomMap(rows, cols) {
  console.log("gen random map");
  for (let y = 0; y < rows; y++) {
    map[y] = [];
    for (let x = 0; x < cols; x++) {
      if (Math.random() > 0.1) { // 90% chance of road
        map[y][x] = new Road(x * gridSize, y * gridSize);
      } else {
        map[y][x] = new Building(x * gridSize, y * gridSize);
      }
      if(y > (rows/2)+2  && y < (rows/2) -2){
        map[y][x] = new Building(x * gridSize, y * gridSize);
      }
    }
  }
}


// Function to generate the map, will need some random
function generateMap(rows, cols) {
  // Creates the map with buildings first
  console.log("gen map");
  for (let y = 0; y < rows; y++) {
    map[y] = [];
    for (let x = 0; x < cols; x++) {
      map[y][x] = new Building(x * gridSize, y * gridSize); // Start with all buildings
    }
  }
  let roadWidth = 3;
  // Add roads: horizontal roads (3 tiles wide)
  for (let y = roadWidth; y < rows; y += roadWidth*2) { // Create horizontal roads evenly spaced
    for (let x = 0; x < cols; x++) {
      for(let z=0; z<roadWidth; z++) { 
        if(y+z == rows)
          break;
        else
          map[y+z][x] = new Road(x * gridSize, (y+z) * gridSize);
      }
    }
  }

  // Add roads: vertical roads (roadwidth tiles wide)
  for (let x = roadWidth; x < cols; x += roadWidth*2) { // Create vertical roads every 4 columns, 2 tiles wide
    for (let y = 0; y < rows; y++) {
      for (let z = 0; z < roadWidth; z++) { 
        map[y][x+z] = new Road((x+z) * gridSize, y * gridSize);
      }
    }
  }
  
  // Add diagonal roads
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      if (x-y <= roadWidth && y-x <= roadWidth){
        map[y][x] = new Road(x*gridSize, y*gridSize)
      }
    }
  }
}

// This is a shit function that will draw a map useable for testing purposes and
// should not be used in a production enviorment, idk how to make it modular tho so f it
function generateDevMap(rows,cols){
  
  for(let y=0; y<rows; y++){
    map[y] = [];
    for(let x=0; x<cols; x++){
      map[y][x] = new Road(x*gridSize, y*gridSize);
    }
  }
  ///*  Big squares to make up town square
  drawRect(20,6,8,8);
  drawRect(36,6,8,8);
  drawRect(20,22,8,8);
  drawRect(36,22,8,8);
  //*/

  drawAngle45(45,13,58,0,4);
  drawAngle45(45,25,58,8,4);
  drawAngledBuilding(19,10,0,16,4);
  drawAngledBuilding(19,24,0,29,4);

  
  /*  TEMPLATE 
  for(let y=0; y<rows; y++){
    for(let x=0; x<rows; x++){
      map[y][x] = new Road(x*gridSize, y*gridSize);
    }
  }
  */
}
// Draws a building at these cordinates, we need to later add a terrain brim between map and buildings
function drawRect(xStart,yStart,xLength,yLength){
  for(let y=yStart; y<yStart+yLength; y++){
    for(let x=xStart; x<xStart+xLength; x++){
      map[y][x] = new Building(x*gridSize, y*gridSize);
    }
  }
}

// This function only works with 45 degree buildings ()
function drawAngle45(xStart, yStart, xEnd, yEnd, width) {
  console.log("Drawing 1:1 sloped buildings");

  let stepX = xStart < xEnd ? 1 : -1; // Determine direction
  let stepY = yStart < yEnd ? 1 : -1;
  let length = Math.abs(xEnd - xStart); // Since it's 1:1, dx = dy

  for (let i = 0; i <= length; i++) {
    let baseX = xStart + i * stepX;
    let baseY = yStart + i * stepY;

    // Apply width perpendicular to slope (horizontal expansion)
    for (let j = -Math.floor(width / 2); j <= Math.floor(width / 2); j++) {
      let buildX = baseX + j;
      let buildY = baseY;

      if (map[buildY] && map[buildY][buildX] !== undefined) {
        map[buildY][buildX] = new Building(buildX * gridSize, buildY * gridSize);
      }
    }
  }
}

// This function only works if its not a 45 angle
function drawAngledBuilding(xStart, yStart, xEnd, yEnd, width) {
  console.log("Drawing angled buildings");

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
        map[buildY][buildX] = new Building(buildX * gridSize, buildY * gridSize);
      }
    }

    // Bresenham step to follow the line
    let e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x += stepX; }
    if (e2 < dx) { err += dx; y += stepY; }
  }
}



// Function to draw the entire map, this gets repeated every frame with the car 
function drawMap() {
  //console.log("gen map");
  background(255); // Clear the canvas with a white background
  for (let row of map) {
    for (let cell of row) {
      cell.draw(); // Draw each cell (either Road or Building)
    }
  }
}
