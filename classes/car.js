// classes/car.js
const carWidth = 50;
const carHeight = 30;

class Car {
  constructor(p, x, y, stats) {
    this.p = p;
    this.x = x;
    this.y = y;
    this.speed = 0;
    this.angle = 0;
    // creates stats as const to prevent modifications
    const SAVED_STATS = Object.freeze({ ...stats });
    this.acceleration = SAVED_STATS.acceleration;
    this.maxSpeed = SAVED_STATS.maxSpeed;
    this.friction = 0.05;
    this.reverseSpeed = -4;
    this.currentImage = (typeof cars !== 'undefined' && cars[0]) ? cars[0] : null;
    this.width = carWidth;
    this.height = carHeight;
    this.healthBar = SAVED_STATS.health;
  }

  update() {
    let p = this.p;
    if (p.keyIsDown(87)) {
      if (p.keyIsDown(70)) {
        if (this.speed < 0) {
          this.speed = 0.01;
        }
        this.speed = p.constrain(
          this.speed + this.acceleration * 2,
          this.reverseSpeed * 2,
          this.maxSpeed * 2
        );
      } else {
        this.speed = p.constrain(
          this.speed + this.acceleration,
          this.reverseSpeed,
          this.maxSpeed
        );
      }
    }
    if (p.keyIsDown(83)) {
      this.speed = p.constrain(this.speed - this.acceleration, this.reverseSpeed, this.maxSpeed);
    }
    let turnSpeed = 0.05;
    if (p.keyIsDown(65)) {
      if (p.keyIsDown(16)) this.angle -= turnSpeed * 2;
      else this.angle -= turnSpeed;
    }
    if (p.keyIsDown(68)) {
      if (p.keyIsDown(16)) this.angle += turnSpeed * 2;
      else this.angle += turnSpeed;
    }
    if (!p.keyIsDown(87) && !p.keyIsDown(83)) {
      this.speed *= 1 - this.friction;
      if (Math.abs(this.speed) < 0.01) this.speed = 0;
    }
    // Calculates what tile the car will be on 
    this.x += this.speed * p.cos(this.angle);
    this.y += this.speed * p.sin(this.angle);
    console.log("x: ", this.x/gridSize);
    console.log("y: ", this.y/gridSize);
    

    handleCollisions(this);
    if (this.x <= 0) this.x = 0;
    else if (this.x > mapSize*gridSize) this.x = mapSize*gridSize;
    if (this.y < 0) this.y = 0;
    else if (this.y >= mapSize*gridSize) this.y = mapSize*gridSize;
    
  }

  display() {
    let p = this.p;
    p.push();
    p.translate(this.x, this.y);
    p.rotate(this.angle);

    // Ensure both image and rectangle are drawn centered
    p.imageMode(p.CENTER);
    p.rectMode(p.CENTER);
    if (this.currentImage) {
      p.image(this.currentImage, 0, 0, carWidth*2, carHeight*3);
    } else {
      p.fill(0, 0, 0);
      p.rect(0, 0, this.width, this.height);
    }
    p.pop();
  }
}


// Function that looks at car location and sees if it overlaps with an object 
// we should change to integer with a switch statement on calling function with all objects but thats confuisng for now
function checkCollision(car,object) {

  // Gets the positions of corners
  let corners = [
    { x: car.x - carWidth *.8 , y: car.y - carHeight *.8 }, // Top-Left
    { x: car.x + carWidth *.8, y: car.y - carHeight *.8}, // Top-Right
    { x: car.x, y: car.y - carHeight *.9},                //Front Middle
    { x: car.x - carWidth *1, y: car.y + carHeight *1}, // Bottom-Left
    { x: car.x + carWidth *1, y: car.y + carHeight *1}  // Bottom-Right
  ];

  // Checks each corner for collision with a building
  for (let corner of corners) {
    let gridX = Math.floor(corner.x / gridSize);
    let gridY = Math.floor(corner.y / gridSize);
    
    if (map[gridY] && map[gridY][gridX] instanceof object) {
        return true; 
    }
  }
  
  return false;
}

// Simple check to see if cars are close enough to collide
function checkCarCollision(car1, car2) {
  let dx = car1.x - car2.x;
  let dy = car1.y - car2.y;
  let distance = Math.sqrt(dx * dx + dy * dy);

  return distance < carWidth; // Returns if they are colliding or not
}


// Checks for and handles collision between car 
function handleCollisions(car) {
  // Collision with buildings
  if (checkCollision(car, Building)) {
    //car.x -= car.velX;
    //car.y -= car.velY;
    car.velX = 0;
    car.velY = 0;
    car.speed = car.speed /-2 ;
    }

  // Slows down the car on grass
  if (checkCollision(car, Grass)) {
    car.velX *= 0.7;
    car.velY *= 0.7;
  }

  // Collision with enemy cars
  /*
  for (let enemy of enemyCars) {
    if (checkCarCollision(car, enemy)) {
        
    }
  }
  */
}
