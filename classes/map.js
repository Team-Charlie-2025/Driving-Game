let map = [];
const gridSize = 40; // each grid cell will be 40x40px

// Building class to represent a yellow building
class Building {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = 'yellow';
        this.width = gridSize;
        this.height = gridSize;
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
        this.color = 'grey';
        this.width = gridSize;
        this.height = gridSize;
    }

    draw() {
        fill(this.color);
        noStroke();
        rect(this.x, this.y, this.width, this.height);
    }
}

// This function needs logic to make sense but it gives nice open area

function generateRandomMap(rows, cols) {
    for (let y = 0; y < rows; y++) {
        map[y] = [];
        for (let x = 0; x < cols; x++) {
            if (Math.random() > 0.2) { // 80% chance of road
                map[y][x] = new Road(x * gridSize, y * gridSize);
            } else {
                map[y][x] = new Building(x * gridSize, y * gridSize);
            }
        }
    }
}

// Function to generate the map, will need some random
function generateMap(rows, cols) {
    // Creates the map with buildings first
    for (let y = 0; y < rows; y++) {
        map[y] = [];
        for (let x = 0; x < cols; x++) {
            map[y][x] = new Building(x * gridSize, y * gridSize); // Start with all buildings
        }
    }

    // Add roads: horizontal roads (2 tiles wide)
    for (let y = 2; y < rows; y += 4) { // Create horizontal roads every 4 rows, 2 tiles wide
        for (let x = 0; x < cols; x++) {
            map[y][x] = new Road(x * gridSize, y * gridSize);
            map[y + 1][x] = new Road(x * gridSize, (y + 1) * gridSize);
        }
    }

    // Add roads: vertical roads (2 tiles wide)
    for (let x = 2; x < cols; x += 4) { // Create vertical roads every 4 columns, 2 tiles wide
        for (let y = 0; y < rows; y++) {
            map[y][x] = new Road(x * gridSize, y * gridSize);
            map[y][x + 1] = new Road((x + 1) * gridSize, y * gridSize);
        }
    }
}



// Function to draw the entire map
function drawMap() {
    background(255); // Clear the canvas with a white background
    for (let row of map) {
        for (let cell of row) {
            cell.draw(); // Draw each cell (either Road or Building)
        }
    }
}
