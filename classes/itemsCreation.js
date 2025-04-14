const totalCoins = 400;
const totalShields = 10;
const totalWrenches  = 20;
const totalBombs = 20;
const totalOils = 20;
const totalGas = 20; // Same amount as shields

let attempts = 0;
const maxAttempts = 10000; 

    ////////////////////////////////////////////////
    // coin creation, positioning, building check, and logs
function createCoins(p, coins, map){
    attempts = 0;
    while (coins.length < totalCoins && attempts < maxAttempts) {
      // random map index
      let randX = Math.floor(p.random(0, map[0].length));
      let randY = Math.floor(p.random(0, map.length));
      
      // checks tile, if road, puts coin in center
      if (map[randY] && map[randY][randX] instanceof Road) {
        let coinX = randX * gridSize + gridSize / 2;
        let coinY = randY * gridSize + gridSize / 2;
        if (window.debug) console.log(`Spawning coin ${coins.length + 1} at tile (${randX}, ${randY}) with world coordinates (${coinX}, ${coinY})`);
        coins.push(new Coin(p, coinX, coinY));
      }
      attempts++;
    }
    if (attempts >= maxAttempts && debug) {
      console.log("Max attempts reached while spawning coins. Coins spawned: " + coins.length);
    }
}

    ////////////////////////////////////////////////
    // shield creation, positioning, building check, and logs
function createShields(p, shields, map){
    attempts = 0;
    while (shields.length < totalShields && attempts < maxAttempts) {
      // random map index
      let randX = Math.floor(p.random(0, map[0].length));
      let randY = Math.floor(p.random(0, map.length));
      
      // checks tile, if road, puts shield in center
      if (map[randY] && map[randY][randX] instanceof Road) {
        let shieldX = randX * gridSize + gridSize / 2;
        let shieldY = randY * gridSize + gridSize / 2;
        if (window.debug) console.log(`Spawning shield ${shields.length + 1} at tile (${randX}, ${randY}) with world coordinates (${shieldX}, ${shieldY})`);
        shields.push(new Shield(p, shieldX, shieldY));
      }
      attempts++;
    }   
    if (attempts >= maxAttempts && debug) {
      console.log("Max attempts reached while spawning shields. Shields spawned: " + shields.length);
    }
}

    ////////////////////////////////////////////////
    // gas can creation, positioning, building check, and logs
function createGas(p, gas, map){
    attempts = 0;
    while (gas.length < totalGas && attempts < maxAttempts) {
      // random map index
      let randX = Math.floor(p.random(0, map[0].length));
      let randY = Math.floor(p.random(0, map.length));
      
      // checks tile, if road, puts gas can in center
      if (map[randY] && map[randY][randX] instanceof Road) {
        let gasX = randX * gridSize + gridSize / 2;
        let gasY = randY * gridSize + gridSize / 2;
        if (window.debug) console.log(`Spawning gas can ${gas.length + 1} at tile (${randX}, ${randY}) with world coordinates (${gasX}, ${gasY})`);
        gas.push(new Gas(p, gasX, gasY));
      }
      attempts++;
    }
    if (attempts >= maxAttempts && debug) {
      console.log("Max attempts reached while spawning gas cans. Gas cans spawned: " + gas.length);
    }
}

    ////////////////////////////////////////////////
    // wrench creation, positioning, building check, and logs
function createWrenches(p, wrenches, map ){
    attempts = 0;
    while (wrenches.length < totalWrenches && attempts < maxAttempts) {
      // random map index
      let randX = Math.floor(p.random(0, map[0].length));
      let randY = Math.floor(p.random(0, map.length));
      
      // checks tile, if road, put wrench in center
      if (map[randY] && map[randY][randX] instanceof Road) {
        let wrenchX = randX * gridSize + gridSize / 2;
        let wrenchY = randY * gridSize + gridSize / 2;
        if (window.debug) console.log(`Spawning wrench ${wrenches.length + 1} at tile (${randX}, ${randY}) with world coordinates (${wrenchX}, ${wrenchY})`);
        wrenches.push(new Wrench(p, wrenchX, wrenchY));
      }
      attempts++;
    }  
    if (attempts >= maxAttempts && debug) {
      console.log("Max attempts reached while spawning wrenches. wrenches spawned: " + wrenches.length);
    }
}


function createBomb(p, bombs, map){
  attempts = 0;
  while (bombs.length < totalBombs && attempts < maxAttempts) {
    // random map index
    let randX = Math.floor(p.random(0, map[0].length));
    let randY = Math.floor(p.random(0, map.length));
    
    // checks tile, if road, puts bomb in center
    if (map[randY] && map[randY][randX] instanceof Road) {
      let bombX = randX * gridSize + gridSize / 2;
      let bombY = randY * gridSize + gridSize / 2;
      if (window.debug) console.log(`Spawning bomb ${bombs.length + 1} at tile (${randX}, ${randY}) with world coordinates (${bombX}, ${bombY})`);
      bombs.push(new Bomb(p, bombX, bombY));
    }
    attempts++;
  }
  if (attempts >= maxAttempts && debug) {
    console.log("Max attempts reached while spawning bombs. Bombs spawned: " + bombs.length);
  }
}
function createOil(p, oils, map){
  attempts = 0;
  while (oils.length < totalOils && attempts < maxAttempts) {
    // random map index
    let randX = Math.floor(p.random(0, map[0].length));
    let randY = Math.floor(p.random(0, map.length));
    
    // checks tile, if road, puts oil in center
    if (map[randY] && map[randY][randX] instanceof Road) {
      let oilX = randX * gridSize + gridSize / 2;
      let oilY = randY * gridSize + gridSize / 2;
      if (window.debug) console.log(`Spawning oil ${oils.length + 1} at tile (${randX}, ${randY}) with world coordinates (${oilX}, ${oilY})`);
      oils.push(new Oil(p, oilX, oilY));
    }
    attempts++;
  }
  if (attempts >= maxAttempts && debug) {
    console.log("Max attempts reached while spawning oils. oils spawned: " + oils.length);
  }
}