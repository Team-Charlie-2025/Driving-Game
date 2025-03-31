// classes/map.js

const gridSize = 32;
const mapSize = 500;

let roadSizes = { tiny: 5, small: 7, normal: 9, big: 11, main: 13 };
// These are more like outer bounds, and i need to change building generation to be better for buildings
let buildingSizes = { smallHouse: 2, largeHouse: 4, shop: 8, shopWidth: 3,
  factoryWidth: 10, factoryLength: 20
}
const largeHouseSize = 4;
let map = []; 

function drawMap(p, center, zoomFactor) {
  p.background("grey");
  let halfWidth = p.width / (2 * zoomFactor);
  let halfHeight = p.height / (2 * zoomFactor);
  let startX = Math.floor((center.x - halfWidth) / gridSize);
  let startY = Math.floor((center.y - halfHeight) / gridSize);
  let endX = Math.ceil((center.x + halfWidth) / gridSize);
  let endY = Math.ceil((center.y + halfHeight) / gridSize);
  
  for (let y = startY; y < endY; y++) {
    for (let x = startX; x < endX; x++) {
      if (y >= 0 && y < map.length && x >= 0 && x < map[y].length) {
        let tile = map[y][x];
        if (tile) {
          if (typeof tile.draw === "function") {
            tile.draw(p);
          } else if (typeof tile.display === "function") {
            tile.display();
          }
        }
      }
    }
  }
}

//############################ Procedural Map ##############################
// This is the beginning of generation, starts with blank map of grass, adds roads, then takes grass and fills it with buildings
function generateGenMap(p, rows, cols) {
  // Initialize the map with Grass.
  // grassImg = p.loadImage("assets/mapBuildier/Terrain/terr04.png");
  for (let y = 0; y < rows; y++) {
    map[y] = [];
    for (let x = 0; x < cols; x++) {
      map[y][x] = new Grass(p, x * gridSize + gridSize / 2, y * gridSize+ gridSize / 2, gridSize, gridSize, null);
    }
  }

  drawRectRoad(p,12,1,12+roadSizes.big,420);
  drawAngledRoad(p,20,15,420,42,roadSizes.big);
  drawBezierRoad(p,50,18,70,50,18,50,roadSizes.normal);
  drawAngledRoad(p,40,47,120,119,roadSizes.normal);
  drawRectRoad(p,119,22,119+roadSizes.big,252);
  drawLake(p,1,1,11,20)
  let blockSize = 50;
  for(let i=1; i<5; ++i){
    drawRectRoad(p,119+(i*blockSize),5,119+roadSizes.normal+(i*blockSize),252);   // Vertical roads
    drawRectRoad(p,119,22+(i*blockSize),380,22+roadSizes.normal+(i*blockSize));    // Horizontal Roads
  }

  drawBezierRoad(p,15,160,150,225,15,260,roadSizes.normal);
  drawAngledRoad(p,61,245,75,400,roadSizes.normal);
  drawAngledRoad(p,86,218,119,226,roadSizes.normal);
  //drawBezierRoad(10,10,30,30,40,5,6);

  //drawRectBuilding(27,25,47,39);
  //drawRectBuilding(27,57,35,97);
  //drawRowOfBuildings(1,1,12,101,8);
  fillBigBuildings(p,1,200,130,400);
  fillShopsDynamically(p,1,1,100,180);
  fillBuildingsDynamically(p,120,1,400,250);
  drawBezierRoad(p,20,105,80,100,75,75,roadSizes.normal)
}


function drawLake(p, xStart, yStart, xEnd, yEnd) {
  if(!canPlaceBuilding(p,xStart,yStart,xEnd,yEnd)) return;
  // Calculates the center and radius of the lake
  const centerX = Math.floor((xStart + xEnd) / 2);
  const centerY = Math.floor((yStart + yEnd) / 2);
  const radiusX = Math.floor((xEnd - xStart) / 2);
  const radiusY = Math.floor((yEnd - yStart) / 2);

  for (let y = yStart; y < yEnd; y++) {
    for (let x = xStart; x < xEnd; x++) {
      const dx = (x - centerX) / radiusX;
      const dy = (y - centerY) / radiusY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      const edgeThreshold = 1 + (Math.random() - 0.5) * 0.2; // Makes the edge fun and jaged

      if (distance <= edgeThreshold) {
        if (map[y] && map[y][x] instanceof Grass) {
          map[y][x] = new Water(p, x * gridSize + gridSize / 2, y * gridSize + gridSize / 2, gridSize, gridSize);
        }
      }
    }
  }
}

function drawRectRoad(p, xStart, yStart, xEnd, yEnd) {
  for (let y = yStart; y < yEnd; y++) {
    for (let x = xStart; x < xEnd; x++) {
      if (map[y] && map[y][x] !== undefined) {
        map[y][x] = new Road(p, x * gridSize + gridSize / 2, y * gridSize + gridSize / 2, gridSize, gridSize);
      }
    }
  }
}


// This function only works if its not a 45 angle
function drawAngledRoad(p, xStart, yStart, xEnd, yEnd, width) {
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
      let perpX = (dy > dx) ? j : 0; // Offset horiz /steep
      let perpY = (dx > dy) ? j : 0; // Offset vert / shallow
      let buildX = x + perpX;
      let buildY = y + perpY;
      if (map[buildY] && map[buildY][buildX] !== undefined) {
        map[buildY][buildX] = new Road(p, buildX * gridSize + gridSize/2, buildY * gridSize + gridSize/2, gridSize, gridSize);
      }
    }
    // Bresenham step to follow the line
    let e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x += stepX; }
    if (e2 < dx) { err += dx; y += stepY; }
  }
}

// Draws a curved road curving towards x1,y1 starting from x0).
function drawBezierRoad(p, x0, y0, x1, y1, x2, y2, width) {
  let numSteps = 1000;// Increase number when turn has random grass spots
  let prevX = x0, prevY = y0;
  let perpX, perpY = 0;
  for (let i = 0; i <= numSteps; i++) {
    let t = i / numSteps;
    // Quadratic Bézier formula
    let x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * x1 + t * t * x2;
    let y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * y1 + t * t * y2;
    // Compute the tangent vector (direction of curve at this point)
    let tangentX = x - prevX;
    let tangentY = y - prevY;
    let length = Math.sqrt(tangentX * tangentX + tangentY * tangentY) || 1;
    // Normalize tangent to get a perpendicular direction
    perpX = -tangentY / length;
    perpY = tangentX / length;

    // Apply width consistently along the curve
    for (let j = -Math.floor(width / 2); j <= Math.floor(width / 2); j++) {
      let buildX = Math.round(x + j * perpX);
      let buildY = Math.round(y + j * perpY);
      if (map[buildY] && map[buildY][buildX] !== undefined) {
        map[buildY][buildX] = new Road(p, buildX * gridSize + gridSize/2, buildY * gridSize + gridSize/2, gridSize, gridSize);
      }
    }
    prevX = x;
    prevY = y;
  }
  console.log("perpX" + perpX);
  // Extend the road slightly beyond the endpoint to ensure overlap
  for (let j = -Math.floor(width / 2); j <= Math.floor(width / 2); j++) {
    let buildX = Math.round(x2 + j * perpX);
    let buildY = Math.round(y2 + j * perpY);
    if (map[buildY] && map[buildY][buildX] !== undefined) {
      map[buildY][buildX] = new Road(p, buildX * gridSize + gridSize / 2, buildY * gridSize + gridSize / 2, gridSize, gridSize);
    }
  }
}

//get tile type to determine if car is on grass or road
function getTileTypeAt(x, y) {
  let col = Math.floor(x / gridSize);
  let row = Math.floor(y / gridSize);

  if (row >= 0 && row < map.length && col >= 0 && col < map[row].length) {
      let tile = map[row][col];
      if (tile instanceof Road) {
          return "road";
      } else if (tile instanceof Grass) {
          return "grass";
      }
  }
  return "unknown"; //default case (e.g., out of bounds)
}


// Draws Buildings given the cordinates 
function drawRectBuilding(p, xStart, yStart, xEnd, yEnd) {
  for (let y = yStart; y < yEnd; y++) {
    for (let x = xStart; x < xEnd; x++) {
      if (map[y] && map[y][x] !== undefined) {
        map[y][x] = new Building(
          p,
          x * gridSize + gridSize / 2,
          y * gridSize + gridSize / 2,
          gridSize,
          gridSize,
          buildingImg
        );
      }
    }
  }
}


/* 
  #######################################################################
  This file is for trying to generate the building map through logic and chance
  
  Currently I am trying to generate maps with the logic of "neighborhoods"
  different areas have different generation
  #########################################################################
*/

function fillBuildingsDynamically(p, xPosStart, yPosStart, xPosEnd, yPosEnd) {
  for (let yStart = yPosStart; yStart < yPosEnd; yStart++) {
    for (let xStart = xPosStart; xStart < xPosEnd; xStart++) {
      // Check if this tile is empty (grass) and is adjacent to a road
      if (map[yStart][xStart] instanceof Grass && isAdjacentToRoad(p, xStart, yStart)) {
        // Decide expansion direction
        let expandLeft = Math.random() > 0.5 ? -1 : 1;
        let expandUp = Math.random() > 0.5 ? -1 : 1;
        // Randomize building size
        let xEnd = xStart + expandLeft * (Math.floor(Math.random() * 3) + 3); // 3-6 wide, tall
        let yEnd = yStart + expandUp * (Math.floor(Math.random() * 3) + 3);
        // Ensure xEnd/yEnd are in the correct order
        let finalXStart = Math.min(xStart, xEnd);
        let finalXEnd = Math.max(xStart, xEnd);
        let finalYStart = Math.min(yStart, yEnd);
        let finalYEnd = Math.max(yStart, yEnd);
        // Ensure space is free & includes gaps
        if (canPlaceBuilding(p, finalXStart, finalYStart, finalXEnd, finalYEnd)) {
          drawRectBuilding(p, finalXStart, finalYStart, finalXEnd, finalYEnd);
          //markBuildingArea(p, finalXStart, finalYStart, finalXEnd, finalYEnd); // Reserve the space
        }
      }
    }
  }
}

function fillShopsDynamically(p, xPosStart, yPosStart, xPosEnd, yPosEnd) {
  for (let yStart = yPosStart; yStart < yPosEnd; yStart++) {
    for (let xStart = xPosStart; xStart < xPosEnd; xStart++) {
      // Check if this tile is empty (grass) and is adjacent to a road
      if (map[yStart][xStart] instanceof Grass && isAdjacentToRoad(p, xStart, yStart)) {
        // Randomize building size
        let xEnd = xStart + Math.floor(Math.random() * 7) + 3; // 2-4 wide/tall
        let yEnd = yStart + Math.floor(Math.random() * 7) + 3;
        // Ensure space is free & includes gaps
        if (canPlaceBuilding(p, xStart, yStart, xEnd, yEnd)) {
          drawRectBuilding(p, xStart, yStart, xEnd, yEnd);
          //markBuildingArea(p, xStart, yStart, xEnd, yEnd); // Reserve the space
        }
      }
    }
  }
}

  // Check if a tile is adjacent to a road but maintains a 1-tile gap
function isAdjacentToRoad(p, x, y) {
  return (
    (map[y - 2] && map[y - 2][x] instanceof Road) ||
    (map[y + 2] && map[y + 2][x] instanceof Road) ||
    (map[y][x - 2] && map[y][x - 2] instanceof Road) ||
    (map[y][x + 2] && map[y][x + 2] instanceof Road)
  );
}

  // Ensure space is free for the building, considering gaps
function canPlaceBuilding(p, xStart, yStart, xEnd, yEnd) {
  for (let y = yStart - 1; y <= yEnd; y++) {
    for (let x = xStart - 1; x <= xEnd; x++) {
      // Check that its grass and within bounds
      if (
        y < 0 || y >= map.length ||
        x < 0 || x >= map[y].length ||
        !(map[y][x] instanceof Grass)
      ) {
        return false;
      }
    }
  }
  return true;
}

const bigBuildingChance = 0.3;
const bigBuildingSize = 30;
const requiredOpenSpace = bigBuildingSize + 6;// Space needed to fit big buildings
const grassBuffer = 5; // Distance between parking lot and road



function fillBigBuildings(p, xPosStart, yPosStart, xPosEnd, yPosEnd) {
  for (let y = yPosStart; y < yPosEnd - requiredOpenSpace; y++) {
    for (let x = xPosStart; x < xPosEnd - requiredOpenSpace; x++) {
      if (map[y][x] instanceof Grass && Math.random() < bigBuildingChance) {
        let xEnd = x + Math.floor(bigBuildingSize / 2);
        let yEnd = y + bigBuildingSize;
        if (canPlaceLargeBuilding(p, x, y, xEnd, yEnd)) {
          drawRectBuilding(p, x, y, xEnd, yEnd);
          let lotXStart = x - 4, lotXEnd = xEnd + 4;
          let lotYStart = y - 4, lotYEnd = yEnd + 4;
          drawParkingLot(p, lotXStart, lotYStart, lotXEnd, lotYEnd);
          createParkingLotEntrances(p, lotXStart, lotYStart, lotXEnd, lotYEnd);
        }
      }
    }
  }
}

  // Ensure space is large enough for the building + buffer
function canPlaceLargeBuilding(p, xStart, yStart, xEnd, yEnd, extraGap = 3) {
  for (let y = yStart - grassBuffer - extraGap; y < yEnd + grassBuffer + extraGap; y++) {
    for (let x = xStart - grassBuffer - extraGap; x < xEnd + grassBuffer + extraGap; x++) {
      if (
        y < 0 || x < 0 || y >= map.length || x >= map[y].length ||
        !(map[y][x] instanceof Grass)
      ) {
        return false;
      }
    }
  }
  return true;
}

  // Create entrance/exit paths for the parking lot
function createParkingLotEntrances(p, lotXStart, lotYStart, lotXEnd, lotYEnd) {
  let possibleEntrances = [];
  // Check each side of the parking lot for the nearest road
  if (isAdjacentToRoad(p, lotXStart - grassBuffer, Math.floor((lotYStart + lotYEnd) / 2)))
    possibleEntrances.push({ x: lotXStart - 1, y: Math.floor((lotYStart + lotYEnd) / 2) });
  if (isAdjacentToRoad(p, lotXEnd + grassBuffer, Math.floor((lotYStart + lotYEnd) / 2)))
    possibleEntrances.push({ x: lotXEnd, y: Math.floor((lotYStart + lotYEnd) / 2) });
  if (isAdjacentToRoad(p, Math.floor((lotXStart + lotXEnd) / 2), lotYStart - grassBuffer))
    possibleEntrances.push({ x: Math.floor((lotXStart + lotXEnd) / 2), y: lotYStart - 1 });
  if (isAdjacentToRoad(p, Math.floor((lotXStart + lotXEnd) / 2), lotYEnd + grassBuffer))
    possibleEntrances.push({ x: Math.floor((lotXStart + lotXEnd) / 2), y: lotYEnd });

    // Pick two random entrance/exits
  if (possibleEntrances.length > 1) {
    let entrance = possibleEntrances.splice(Math.floor(Math.random() * possibleEntrances.length), 1)[0];
    let exit = possibleEntrances.splice(Math.floor(Math.random() * possibleEntrances.length), 1)[0];
    map[entrance.y][entrance.x] = new Road(p, entrance.x * gridSize + gridSize/2, entrance.y * gridSize + gridSize/2, gridSize, gridSize);
    map[exit.y][exit.x] = new Road(p, exit.x * gridSize + gridSize/2, exit.y * gridSize + gridSize/2, gridSize, gridSize);
  }
}

function drawParkingLot(p, xStart, yStart, xEnd, yEnd) {
  for (let y = yStart; y < yEnd; y++) {
    for (let x = xStart; x < xEnd; x++) {
      if (map[y] && map[y][x] instanceof Grass) {
        map[y][x] = new Road(p, x * gridSize + gridSize/2, y * gridSize + gridSize/2, gridSize, gridSize);
      }
    }
  }
}
  
  // ROAD GENERATION 
  /*
  
    As of right now we are just doing some random roads
    Map will be generated with 500x500 "cities" with roads in/out connecting 
    Each city is divided into districts that are varying random sizes 
      City Square - Big main road with longer blocks, small alleys with shops and important buildings
      Residential - Grid design with some offshooting more interesting neighborhoods (culdesacs, interesting streets looping back and dead ends)
      Factory - Industrial complexes and stuff, maybe have it be a more decrepid open area
      Country - Long country roads, some windy "mountain" roads, surrounds all of the city
    These districts can all have interesting traits/gimmiks like city & resedential having more coins
    Factory having more power ups and country roads could have something else
  */

function generateRoadMap(p, rows, cols) {

  for(let y=0; y<rows; y++){
    map[y] = [];
    for(let x=0; x<cols; x++){
      map[y][x] = new Grass(x * gridSize, y * gridSize);
    }
  }
  // Draws a residential area 
  // generateResidentialRoads(p, 0, 0, 5, 50);
  generateWindyCountryRoads(p,0,0,100,100 );

}
function generateResidentialRoads(p, xStart, yStart, blocks, blockSize) {
  // Generate grid-like residential area with house
  console.log("generating roads");
  for (let i = 0; i < blocks; i++) {
    drawRectRoad(xStart+(i*blockSize), yStart, xStart+roadSizes.normal+(i*blockSize), yStart+(blockSize*blocks));
    drawRectRoad(xStart, yStart+(i*blockSize), xStart+(blocks*blockSize), yStart+roadSizes.normal+(i*blockSize));
  }
  console.log("generated Roads");
}

function generateResidentialBuildings(p, xStart, yStart, width) {

}

// More direct country road, no hairpins
function generateCountryRoads(p, xStart, yStart, xEnd, yEnd, windiness = 1) {  
  let currentX = xStart;
  let currentY = yStart;
  let roadWidth = roadSizes.small; 

  while (currentX < xEnd && currentY < yEnd) {
    let nextX = currentX + Math.floor(Math.random() * 30) + 10;
    let nextY = currentY + Math.floor(Math.random() * 30) + 10;

    if (nextX > xEnd) nextX = xEnd;
    if (nextY > yEnd) nextY = yEnd;

    let curvature = Math.random();
    let controlX, controlY;
    if (curvature < 0.2) {
      controlX = currentX + (nextX - currentX) / 2 + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 10);
      controlY = currentY + (nextY - currentY) / 2 + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 10);
    } else if (curvature < 0.8) {
      controlX = currentX + (nextX - currentX) / 2 + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 20);
      controlY = currentY + (nextY - currentY) / 2 + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 20);
    } else {
      controlX = currentX + (nextX - currentX) / 2 + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 30);
      controlY = currentY + (nextY - currentY) / 2 + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 30);
    }

    drawBezierRoad(p, currentX, currentY, controlX, controlY, nextX, nextY, roadWidth);
    if (Math.random() > .5) {
      let turnX = nextX + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 20);
      let turnY = nextY + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 20);
      let controlX1 = nextX + (turnX - nextX) / 2 + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 20);
      let controlY1 = nextY + (turnY - nextY) / 2 + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 20);
      drawBezierRoad(p, nextX, nextY, controlX1, controlY1, turnX, turnY, roadWidth);

      let returnX = turnX + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 20);
      let returnY = turnY + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 20);
      let controlX2 = turnX + (returnX - turnX) / 2 + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 20);
      let controlY2 = turnY + (returnY - turnY) / 2 + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 20);
      drawBezierRoad(p, turnX, turnY, controlX2, controlY2, returnX, returnY, roadWidth);

      currentX = returnX;
      currentY = returnY;
    } else {
      currentX = nextX;
      currentY = nextY;
    }
  }

}

// Windy country road
function generateWindyCountryRoads(p, xStart, yStart, xEnd, yEnd, windiness = 1) {  
  let currentX = xStart;
  let currentY = yStart;
  let roadWidth = roadSizes.small; 

  while (currentX < xEnd && currentY < yEnd) {
    let nextX = currentX + Math.floor(Math.random() * 30) + 10;
    let nextY = currentY + Math.floor(Math.random() * 30) + 10;

    if (nextX > xEnd) nextX = xEnd;
    if (nextY > yEnd) nextY = yEnd;

    let curvature = Math.random();
    let controlX, controlY;
    if (curvature < 0.2) {
      controlX = currentX + (nextX - currentX) / 2 + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 10);
      controlY = currentY + (nextY - currentY) / 2 + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 10);
    } else if (curvature < 0.8) {
      controlX = currentX + (nextX - currentX) / 2 + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 20);
      controlY = currentY + (nextY - currentY) / 2 + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 20);
    } else {
      controlX = currentX + (nextX - currentX) / 2 + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 30);
      controlY = currentY + (nextY - currentY) / 2 + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 30);
    }

    drawBezierRoad(p, currentX, currentY, controlX, controlY, nextX, nextY, roadWidth);

    // 180 degree hairpin turn
    if (Math.random() > 0.8) {
      let turnX = nextX + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 20);
      let turnY = nextY + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 20);
      let controlX1 = nextX + (turnX - nextX) / 2 + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 20);
      let controlY1 = nextY + (turnY - nextY) / 2 + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 20);
      drawBezierRoad(p, nextX, nextY, controlX1, controlY1, turnX, turnY, roadWidth);

      let returnX = turnX + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 20);
      let returnY = turnY + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 20);
      let controlX2 = turnX + (returnX - turnX) / 2 + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 20);
      let controlY2 = turnY + (returnY - turnY) / 2 + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 20);
      drawBezierRoad(p, turnX, turnY, controlX2, controlY2, returnX, returnY, roadWidth);

      currentX = returnX;
      currentY = returnY;
    } else {
      currentX = nextX;
      currentY = nextY;
    }
  }

}
