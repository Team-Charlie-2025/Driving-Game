let infoButton;
let showInfo = false;

function setup() {
  // Create the button
  infoButton = createButton('ℹ️');
  infoButton.position(20, 20);

  infoButton.style('background-color', '#28a745'); // Green color
  infoButton.style('color', 'white');
  infoButton.style('border', 'none');
  infoButton.style('padding', '10px 15px');
  infoButton.style('border-radius', '20px');
  infoButton.style('font-size', '16px');
  infoButton.style('cursor', 'pointer');
  infoButton.style('transition', '0.3s');

  // effect
  infoButton.mouseOver(() => {
    infoButton.style('background-color', '#218838'); // Darker green on hover
  });
  infoButton.mouseOut(() => {
    infoButton.style('background-color', '#28a745'); // Original green
  });

  // Add click event
  infoButton.mousePressed(toggleInfo);
}

function draw() {
  
  // Display info box
  if (showInfo) {
    fill(34, 139, 34, 200); // Dark green with transparency
    noStroke();
    rect(50, 100, 300, 100, 15); // Background box

    fill(255);
    textSize(16);
    textAlign(CENTER, CENTER);
    text("Still to be modified", 200, 150);
  }
}

// Toggle info display
function toggleInfo() {
  showInfo = !showInfo;
}