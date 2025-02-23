/* classes/map.js */
const gridSize = 32;  // Size of each grid cell
const mapSize = 500;  // Number of tiles per dimension
let map = [];         // Global 2D array of map tiles

// Only draw the tiles that fall in the visible region (based on center and zoomFactor).
// This spatial culling avoids iterating over all 150k tiles.
function drawMap(p, center, zoomFactor) {
  // Compute visible boundaries in world coordinates.
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
