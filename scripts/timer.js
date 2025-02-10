var timeCheck;
var r, g, b;
var score;

function setup() 
{
  //createCanvas(400, 400);
  //set timeCheck and score at 0;
  timeCheck = 0;
  score = 0;
  r = 220;
  g = 220; 
  b = 220;
}

function drawtimer()
{
  background(r, g, b);

  //get the current time in seconds, floor rounds down
  //draw this in the upper left corner of the screen
  textSize(20);
  text("Time Passed", 10, 20);
  currentTime = floor(millis()/1000);
  text(currentTime, 10, 50);
  
  //if more than 2 seconds have elapsed, change the background to a random color
  //then don't forget to reset the timeCheck value to the currentTime.
  if ((currentTime - timeCheck) > 2)
  {
    r = random(0, 225);
    g = random(0, 225);
    b = random(0, 225);
    timeCheck = currentTime;
  }  

  text("score", 330, 20);
  text(score, 350, 50);
}
  //setting up a "winning" condition
  /*if (score > 10){
    push();
      textSize(80);
      fill('red');
      text("YOU WIN", 20, 200);
    pop();
  }
}

function keyPressed(){
 if (keyCode === UP_ARROW){
    score++; 
 }
}*/