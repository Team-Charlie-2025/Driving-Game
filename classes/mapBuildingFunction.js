/*
This file holds all the functions for drawing buildings, lakes and other obstacles on the map
*/



// Draws Buildings given the cordinates 
function drawRectBuilding(p, xStart, yStart, xEnd, yEnd, buildImg = buildingImg) {
  const buildingWidth = Math.abs((xEnd - xStart)) * gridSize;
  const buildingHeight = Math.abs((yEnd - yStart)) * gridSize;

  const centerX = (xStart + xEnd) * gridSize / 2;
  const centerY = (yStart + yEnd) * gridSize / 2;

  //console.log(`Building dimensions: ${buildingWidth}x${buildingHeight}`);
  //console.log(`Building center: (${centerX}, ${centerY})`);

  // Update the map to mark all tiles as part of the building
  for (let y = yStart; y < yEnd; y++) {
    for (let x = xStart; x < xEnd; x++) {
      if (map[y] && map[y][x] !== undefined) {
        map[y][x] = new Building(
          p,
          centerX,
          centerY,
          buildingWidth,
          buildingHeight,
          buildImg // Pass the building image
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

function fillBuildingsDynamically(p, xPosStart, yPosStart, xPosEnd, yPosEnd, buildImages = p.houseImages) {
  let imageIndex;
  let buildImage;
  for (let yStart = yPosStart; yStart < yPosEnd; yStart++) {
    for (let xStart = xPosStart; xStart < xPosEnd; xStart++) {
      //imageIndex = Math.random() * buildImages.length;
      imageIndex = Math.round(Math.random() * buildImages.length-1);
      buildImage = buildImages[imageIndex];
      // Check if this tile is empty (grass) and has the required g ap from other buildings
      if (
        map[yStart][xStart] instanceof Grass &&
        hasBuildingGap(p, xStart, yStart, 3) && 
        isAdjacentToRoad(p,xStart,yStart)
      ) {
        // Decide expansion direction
        let expandLeft = Math.random() > 0.5 ? -1 : 1;
        let expandUp = Math.random() > 0.5 ? -1 : 1;

        // Randomize building size
        let xEnd = xStart + expandLeft * (Math.floor(Math.random() * 3) + 3); // 3-6 wide
        let yEnd = yStart + expandUp * (Math.floor(Math.random() * 3) + 3);   // 3-6 tall

        // Ensure xEnd/yEnd are in the correct order
        let finalXStart = Math.min(xStart, xEnd);
        let finalXEnd = Math.max(xStart, xEnd);
        let finalYStart = Math.min(yStart, yEnd);
        let finalYEnd = Math.max(yStart, yEnd);

        // Ensure space is free for the building
        if (canPlaceBuilding(p, finalXStart, finalYStart, finalXEnd, finalYEnd)) {
          drawRectBuilding(p, finalXStart, finalYStart, finalXEnd, finalYEnd,buildImage);
        }
      }
    }
  }
}


function fillShopsDynamically(p, xPosStart, yPosStart, xPosEnd, yPosEnd, buildImages = p.buildingImages) {
  let imageIndex;
  let buildImage;
  for (let yStart = yPosStart; yStart < yPosEnd; yStart++) {
    for (let xStart = xPosStart; xStart < xPosEnd; xStart++) {
      imageIndex = Math.round(Math.random() * buildImages.length-1);
      buildImage = buildImages[imageIndex];
      // Check if this tile is empty and is adjacent to a road
      if (map[yStart][xStart] instanceof Grass && isAdjacentToRoad(p, xStart, yStart)) {
        // Randomize shop dimensions
        let shopLength = Math.floor(Math.random() * 11) + 5; // 5-15 tiles long
        let shopDepth = Math.floor(Math.random() * 3) + 3;   // 3-5 tiles deep

        // Determine shop orientation using the isRoadParallel function
        let isHorizontal = isRoadParallel(xStart, yStart);

        if (isHorizontal === null) {
          // Skip if no clear road alignment is found
          continue;
        }

        let xEnd, yEnd;
        if (isHorizontal) {
          // Horizontal shop (aligned with the road)
          xEnd = xStart + shopLength;
          yEnd = yStart + shopDepth;
        } else {
          // Vertical shop (aligned with the road)
          xEnd = xStart + shopDepth;
          yEnd = yStart + shopLength;
        }

        // Ensure space is free for the shop
        if (canPlaceBuilding(p, xStart, yStart, xEnd, yEnd)) {
          console.log("shop built")
          drawRectBuilding(p, xStart, yStart, xEnd, yEnd,buildImage);
        }
      }
    }
  }
}




/*
These are logic functions to determine if we can place what we want to
*/

function hasBuildingGap(p, x, y, gap) {
  for (let offsetY = -gap; offsetY <= gap; offsetY++) {
    for (let offsetX = -gap; offsetX <= gap; offsetX++) {
      let checkX = x + offsetX;
      let checkY = y + offsetY;
      if (
        map[checkY] &&
        map[checkY][checkX] instanceof Building // Check if there's already a building nearby
      ) {
        return false;
      }
    }
  }
  return true;
}

function isRoadParallel(x, y) {
  // Check if the road is horizontal (left/right)
  const isHorizontal =
    (map[y] && map[y][x - 4] instanceof Road) ||
    (map[y] && map[y][x + 4] instanceof Road);

  // Check if the road is vertical (above/below)
  const isVertical =
    (map[y - 4] && map[y - 2][x] instanceof Road) ||
    (map[y + 2] && map[y + 2][x] instanceof Road);

  // Return true if the road is parallel (either horizontal or vertical)
  if (isHorizontal) return true; // Horizontal road
  if (isVertical) return false;  // Vertical road
  return null;   
}

// Check if a tile is adjacent to a road but maintains a 1-tile gap
function isAdjacentToRoad(p, x, y) {
  return (
    (map[y - 1] && map[y - 1][x] instanceof Road) || // Above
    (map[y + 1] && map[y + 1][x] instanceof Road) || // Below
    (map[y][x - 1] && map[y][x - 1] instanceof Road) || // Left
    (map[y][x + 1] && map[y][x + 1] instanceof Road) || // Right
    (map[y - 2] && map[y - 2][x] instanceof Road) || // Two tiles above
    (map[y + 2] && map[y + 2][x] instanceof Road) || // Two tiles below
    (map[y][x - 2] && map[y][x - 2] instanceof Road) || // Two tiles left
    (map[y][x + 2] && map[y][x + 2] instanceof Road) // Two tiles right
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


// Draws a lake with some jagged edges
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
        
        const edgeThreshold = 1 + (Math.random() - 0.5) * 0.12; // Makes the edge fun and jaged
  
        if (distance <= edgeThreshold) {
          if (map[y] && map[y][x] instanceof Grass) {
            map[y][x] = new Water(p, x * gridSize + gridSize / 2, y * gridSize + gridSize / 2, gridSize, gridSize);
          }
        }
      }
    }
  }

  // Places the dock halfway over the map edge, dock is 4 tiles wide, 16 long
  function placeDock(p,xStart,yStart,xEnd,yEnd,dockImage=p.dockWithoutBoat){

    const buildingWidth = Math.abs((xEnd - xStart)) * gridSize;
    const buildingHeight = Math.abs((yEnd - yStart)) * gridSize;

    if (ItemsManager.unlockedItems.boat){
      dockImage = p.dockWithBoat;
    }
    let dockScale = 8;
    const dockWidth = 3*dockScale *32;   // Width of the image
    const dockHeight = 2*dockScale*32; // Width of the image and same height as tiles

    const centerX = (xStart + xEnd+(dockScale*3)-4) * gridSize / 2;  
    const centerY = (yStart + yEnd-1) * gridSize / 2;

    for (let y = yStart; y < yEnd; y++) {
      for (let x = xStart; x < xEnd; x++) {
        if (map[y] && map[y][x] !== undefined) {
          map[y][x] = new Dock(
            p,
            centerX,
            centerY,
            dockWidth,
            dockHeight,
            dockImage
            //p.buildingImg
          );
        }
      }
    }
  }