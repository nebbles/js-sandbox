var font;
var vehicles = [];
var food = [];
var poison = [];

var debug_behaviourProfile;

function toggleDebug() {
  var x = document.getElementById("debug-panel");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function setup() {
  // Set up canvas - fill screen with grid
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.elt.style.position = 'fixed';
  canvas.style('top', '0');
  canvas.style('left', '0');
  canvas.style('z-index', '-1');

  // Link debug checkboxes
  debug_behaviourProfile = document.getElementById('debugBehaviourProfile');
  // debug_behaviourProfile.checked = true; // default to enabled

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
}

function mouseDragged() {
  vehicles.push(
    new Vehicle(mouseX, mouseY)
  );
}

function touchMoved(event) {
  return false; // return false to block page scrolling
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
