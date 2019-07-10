var font;
var vehicles = [];
var food = [];
var poison = [];

var debug;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight - 20);

  for (var i = 0; i < 50; i++) {
    var x = random(width);
    var y = random(height);
    vehicles.push(
      new Vehicle(x, y)
    );
  }

  // vehicle = new Vehicle(10, 10);

  for (var j = 0; j < 40; j++) {
    var x1 = random(width);
    var y1 = random(height);
    food.push(createVector(x1, y1));

  }
  for (var k = 0; k < 20; k++) {
    var x2 = random(width);
    var y2 = random(height);
    poison.push(createVector(x2, y2));
  }

  debug = createCheckbox();
}

function mouseDragged() {
  vehicles.push(
    new Vehicle(mouseX, mouseY)
  );
}

function draw() {
  background(51);

  if (random() < 0.1) {
    var x1 = random(width);
    var y1 = random(height);
    food.push(createVector(x1, y1));
  }

  if (random() < 0.01) {
    var x2 = random(width);
    var y2 = random(height);
    poison.push(createVector(x2, y2));
  }

  food.forEach(function(f) {
    fill(0, 255, 0);
    noStroke();
    ellipse(f.x, f.y, 4);
  });

  poison.forEach(function(f) {
    fill(255, 0, 0);
    noStroke();
    ellipse(f.x, f.y, 4);
  });

  for (var i = vehicles.length - 1; i >= 0; i--) {
    vehicles[i].boundaries();
    vehicles[i].behaviours(food, poison);
    vehicles[i].update();
    vehicles[i].render();

    var newVehicle = vehicles[i].clone();
    if (newVehicle != null) vehicles.push(newVehicle);

    if (vehicles[i].dead()) {
      var x = vehicles[i].pos.x;
      var y = vehicles[i].pos.y;
      food.push(createVector(x, y));
      vehicles.splice(i, 1);
    }
  }

  // if (vehicles.length == 0) {
  //   location.reload();
  // }
}
