var font;
var vehicles = [];

function preload() {
  font = loadFont('AvenirNextLTPro-Demi.otf');
}

function setup() {
  // Set up canvas - fill screen with grid
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.elt.style.position = 'fixed';
  canvas.style('top', '0');
  canvas.style('left', '0');
  canvas.style('z-index', '-1');

  background(51);
  textFont(font);

  console.log(width/4.7);
  console.log(width/15.6);

  var points = font.textToPoints(
    'sandbox',  // text
    width / 15.6, height / 2, // x, y 
    width / 4.7, // size
    {
      sampleFactor: 0.2
    }
    );

  for (var i = 0; i < points.length; i++) {
    var p = points[i];
    var vehicle = new Vehicle(p.x, p.y);
    vehicles.push(vehicle);
    // stroke(255);
    // strokeWeight(8);
    // point(p.x, p.y);
  }
  // console.log(vehicles);
}

function touchMoved(event) {
  // Override the mouseX/Y variables with the touch position
  mouseX = event.touches[0].clientX;
  mouseY = event.touches[0].clientY;  
  return false; // return false to block page scrolling
}

function touchEnded() {
  mouseX = 0;
  mouseY = 0;
}

function draw() {
  background(0);
  vehicles.forEach(function(vehicle) {
    vehicle.behaviours();
    vehicle.update();
    vehicle.show();
  });
}
