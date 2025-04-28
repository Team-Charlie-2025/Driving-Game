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

    const openSet = new PriorityQueue();
    const closedSet = new Set();
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
        get key() {
            return `${this.x},${this.y}`;
        }
    }

    const startNode = new Node(start.x, start.y);
    const endNode = new Node(end.x, end.y);

    const openSetMap = new Map();

    startNode.h = heuristic(startNode, endNode);
    startNode.f = startNode.h;
    openSet.enqueue(startNode, startNode.f);
    openSetMap.set(startNode.key, startNode);

    while (!openSet.isEmpty()) {
        const current = openSet.dequeue();
        openSetMap.delete(current.key);
        closedSet.add(current.key);

        if (current.x === endNode.x && current.y === endNode.y) {
            let temp = current;
            while (temp) {
                path.push({ x: temp.x, y: temp.y });
                temp = temp.parent;
            }
            return path.reverse();
        }

        const neighbors = [
            {x: 0, y: -1},
            {x: 1, y: 0},
            {x: 0, y: 1},
            {x: -1, y:0}
        ];

        for (let offset of neighbors) {
            const nx = current.x + offset.x;
            const ny = current.y + offset.y;

            const neighborKey = `${nx},${ny}`;

            if (
                nx < 0 || ny < 0 || nx >= cols || ny >= rows ||
                grid[ny][nx] !== 0 ||
                closedSet.has(neighborKey)
            ) {
                continue;
            }

            const g = current.g + 1;
            let neighbor = openSetMap.get(neighborKey);

            if (!neighbor) {
                neighbor = new Node(nx, ny, current);
                neighbor.g = g;
                neighbor.h = heuristic(neighbor, endNode);
                neighbor.f = neighbor.g + neighbor.h;
                openSet.enqueue(neighbor, neighbor.f);
                openSetMap.set(neighborKey, neighbor);
            } else if (g < neighbor.g) {
                neighbor.parent = current;
                neighbor.g = g;
                neighbor.f = neighbor.g + neighbor.h;
                openSet.enqueue(neighbor, neighbor.f);
            }
        }
    }
    return []; //no path found
}

class PriorityQueue {
    constructor() {
        this.items = [];
    }

    enqueue(element, priority) {
        this.items.push({element, priority});
        this.bubbleUp();
    }

    dequeue() {
        const min = this.items[0].element;
        const end = this.items.pop();
        if (this.items.length > 0) {
            this.items[0] = end;
            this.sinkDown(0);
        }
        return min;
    }

    bubbleUp() {
        let index = this.items.length - 1;
        const element = this.items[index];

        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            const parent = this.items[parentIndex];
            if (element.priority >= parent.priority) break;
            this.items[index] = parent;
            index = parentIndex;
        }
        this.items[index] = element;
    }

    sinkDown(index) {
        const length = this.items.length;
        const element = this.items[index];

        while (true) {
            let leftIndex = 2 * index + 1;
            let rightIndex = 2 * index + 2;
            let swap = null;

            if (leftIndex < length) {
                if (this.items[leftIndex].priority < element.priority) {
                    swap = leftIndex;
                }
            }

            if (rightIndex < length) {
                if (
                    this.items[rightIndex].priority < 
                    (swap === null ? element.priority : this.items[leftIndex].priority)
                ) {
                    swap = rightIndex;
                }
            }

            if (swap === null) break;

            this.items[index] = this.items[swap];
            this.items[swap] = element;
            index = swap;
        }
    }

    isEmpty() {
        return this.items.length === 0;
    }
}