var font;
var vehicles = [];

function preload() {
  font = loadFont('AvenirNextLTPro-Demi.otf');
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  background(51);
  textFont(font);

  var points = font.textToPoints('train', 60, 210, 200);

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

function draw() {
  background(51);
  vehicles.forEach(function(vehicle) {
    vehicle.behaviours();
    vehicle.update();
    vehicle.show();
  });

}
