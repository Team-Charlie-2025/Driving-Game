/*
This file holds all of the functions that are used to draw roads on maps
*/


function drawRectRoad(p, xStart, yStart, xEnd, yEnd) {
    for (let y = yStart; y < yEnd; y++) {
      for (let x = xStart; x < xEnd; x++) {
        if (map[y] && map[y][x] !== undefined) {
          map[y][x] = new Road(p, x * gridSize + gridSize / 2, y * gridSize + gridSize / 2, gridSize, gridSize);
        }
      }
    }
  }
 
  
  
function drawAngledRoad(p, x0, y0, x1, y1, width) {
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const stepX = x0 < x1 ? 1 : -1;
  const stepY = y0 < y1 ? 1 : -1;
  let err = dx - dy;
  let x = x0;
  let y = y0;

  const maxSteps = Math.max(dx, dy) * 2 + 10;
  let steps = 0;

  while ((x !== x1 || y !== y1) && steps++ < maxSteps) {
    for (let w = -Math.floor(width / 2); w <= Math.floor(width / 2); w++) {
      let wx = x, wy = y;

      if (dx > dy) wy += w; // horizontal-ish
      else wx += w;         // vertical-ish

      if (inBounds(wx, wy)) {
        map[wy][wx] = new Road(p, wx * gridSize + gridSize / 2, wy * gridSize + gridSize / 2, gridSize, gridSize);
      }
    }

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

function drawCurvedChain(p, x0, y0, x2, y2, numCurves, width, windiness = 1) {
  const segmentPoints = [ { x: x0, y: y0 } ];

  for (let i = 1; i < numCurves; i++) {
    const t = i / numCurves;

    const dx = x2 - x0;
    const dy = y2 - y0;
    const perpX = -dy;
    const perpY = dx;
    const perpLen = Math.hypot(perpX, perpY) || 1;

    // Windiness factor applied here
    const curveOffset = windiness * (Math.random() > 0.5 ? 1 : -1) * (5 + Math.random() * 10);

    const px = x0 + dx * t + (curveOffset * perpX / perpLen);
    const py = y0 + dy * t + (curveOffset * perpY / perpLen);

    segmentPoints.push({ x: px, y: py });
  }

  segmentPoints.push({ x: x2, y: y2 });

  for (let i = 0; i < segmentPoints.length - 2; i++) {
    const a = segmentPoints[i];
    const b = segmentPoints[i + 1];
    const c = segmentPoints[i + 2];
    drawBezierRoad(p, a.x, a.y, b.x, b.y, c.x, c.y, width);
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


// Generates grid-like downtown with some variance for some smaller side roads and skips some side roads
function generateDowntownRoads(p, xStart, yStart, blocks, blockSize) {
  console.log("Generating downtown roads");

  for (let i = 0; i <= blocks; i++) {
    // Vertical roads
    let roadWidth = i % 2 === 0 ? roadSizes.normal : roadSizes.small;
    if (roadWidth === roadSizes.small && Math.random() < 0.3) {
      // 30% chance to skip small roads
      continue;
    }
    drawRectRoad(
      p,
      xStart + i * blockSize, // Start X
      yStart,                 // Start Y
      xStart + i * blockSize + roadWidth, // End X
      yStart + blocks * blockSize // End Y
    );

    // Horizontal roads
    roadWidth = i % 2 === 0 ? roadSizes.normal : roadSizes.small;
    if (roadWidth === roadSizes.small && Math.random() < 0.3) {
      // 30% chance to skip small roads
      continue;
    }
    drawRectRoad(
      p,
      xStart,                 // Start X
      yStart + i * blockSize, // Start Y
      xStart + blocks * blockSize, // End X
      yStart + i * blockSize + roadWidth // End Y
    );
  }

  console.log("Generated downtown roads");
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
    