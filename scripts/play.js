// game logic
function drawPlay()
 {
  background(230);

  car.update();
  car.display();
  
let sec = DateObj.getSeconds();
// Printing second
console.log(sec);

}
