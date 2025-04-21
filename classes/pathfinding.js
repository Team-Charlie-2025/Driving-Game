//pathfinding.js

//create a simplified grid of 0 (drivable) and 1 (blocked)
function buildDrivableGrid(tileGrid, drivableTypes = ["Road", "Grass"]) {
    const rows = Object.keys(tileGrid).map(Number);
    const maxRow = Math.max(...rows);
    const maxCol = Math.max(...Object.values(tileGrid).map(row => row.length || 0));

    const grid = [];

    for (let row = 0; row <= maxRow; row++) {
        grid[row] = [];
        for (let col = 0; col <= maxCol; col++) {
            const tile = tileGrid[row]?.[col];
            if (tile && drivableTypes.includes(tile.constructor.name)) {
                grid[row][col] = 0;
            } else {
                grid[row][col] = 1;
            }
        }
    }
    return grid;
}

//convert world (pixel) coordingates to grid (tile) coordinates
function worldToGrid(x, y, tileWidth, tileHeight) {
    return {
        x: Math.floor(x/tileWidth),
        y: Math.floor(y/tileHeight)
    };
}

//converts grid (tile) coord to world (pixel) coord
function gridToWorld(gridX, gridY, tileWidth, tileHeight) {
    return {
        x: gridX * tileWidth + tileWidth / 2,
        y: gridY * tileHeight + tileHeight / 2
    };
}

//A* pathfinding algorithm
function astar(grid, start, end) {
    const cols = grid[0].length;
    const rows = grid.length;

    const openSet = [];
    const closedSet = [];
    const path = [];

    function heuristic(a,b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    class Node {
        constructor(x, y, parent = null) {
            this.x = x;
            this.y = y;
            this.parent = parent;
            this.g = 0;
            this.h = 0;
            this.f = 0;
        }
    }

    const startNode = new Node(start.x, start.y);
    const endNode = new Node(end.x, end.y);

    openSet.push(startNode);

    while (openSet.length > 0) {
        //find node with lowest f cost
        let lowestIndex = 0;
        for (let i = 1; i < openSet.length; i++) {
            if (openSet[i].f < openSet[lowestIndex].f) {
                lowestIndex = i;
            }
        }

        let current = openSet[lowestIndex];

        if (current.x === endNode.x && current.y === endNode.y) {
            let temp = current;
            while (temp) {
                path.push({ x: temp.x, y: temp.y });
                temp = temp.parent;
            }
            return path.reverse();
        }

        openSet.splice(lowestIndex, 1);
        closedSet.push(current);

        const neighbors = [
            {x: 0, y: -1},
            {x: 1, y: 0},
            {x: 0, y: 1},
            {x: -1, y:0}
        ];

        for (let offset of neighbors) {
            const nx = current.x + offset.x;
            const ny = current.y + offset.y;

            if (
                nx < 0 || ny < 0 || nx >= cols || ny >= rows ||
                grid[ny][nx] !== 0 ||
                closedSet.some(n => n.x === nx && n.y === ny)
            ) {
                continue;
            }

            const g = current.g + 1;
            let neighbor = openSet.find(n => n.x === nx && n.y === ny);

            if (!neighbor) {
                neighbor = new Node(nx, ny, current);
                neighbor.g = g;
                neighbor.h = heuristic(neighbor, endNode);
                neighbor.f = neighbor.g + neighbor.h;
                openSet.push(neighbor);
            } else if (g < neighbor.g) {
                neighbor.parent = current;
                neighbor.g = g;
                neighbor.f = neighbor.g + neighbor.h;
            }
        }
    }
    return []; //no path found
}