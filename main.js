
function preload() {
  bgImage = loadImage("https://i.imgur.com/hnKdHwZ.jpeg");
  imgTitle = new Image();
  imgTitle.src = "graphics/title.png";

  imgCar = new Image();
  imgCar.src = "graphics/redStripe.png";
  cars[0] = imgCar;
  imgCar = new Image();
  imgCar.src = "graphics/orangeStripe.png";
  cars[1] = imgCar;
  imgCar = new Image();
  imgCar.src = "graphics/yellowStripe.png";
  cars[2] = imgCar;
  //can continue to add options for preload if car images
}
drawTitle();