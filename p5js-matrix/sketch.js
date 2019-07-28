var symbolSize = 10;
var streams = [];

function setup() {
  // Set up canvas - fill screen with grid
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.elt.style.position = 'fixed';
  canvas.style('top', '0');
  canvas.style('left', '0');
  canvas.style('z-index', '-1');

  textSize(symbolSize);

  var x = 0;

  for (var i = 0; i <= width / symbolSize; i++) {
    var stream = new Stream(
      round(random(5, 30)),
      random(1, 3)
    );
    stream.generateSymbols(x, random(-500, 0));
    streams.push(stream);
    x += symbolSize;
  }
}

function draw() {
  background(0, 120);
  streams.forEach(function(stream) {
    stream.render();
  });
}

function Symbol(x, y, speed, first) {
  this.x = x;
  this.y = y;
  this.value = "";
  this.speed = speed;
  this.switchInterval = round(random(10, 20));
  this.first = first;

  this.setToRandomSymbol = function() {
    if (frameCount % this.switchInterval == 0) {
      this.value = String.fromCharCode(0x30A0 + round(random(0, 96)));
    }
  };

  this.rain = function() {
    this.y = (this.y >= height) ? 0 : this.y += this.speed;
  };
}

function Stream(length, speed) {
  this.symbols = [];
  this.totalSymbols = length;
  this.speed = speed;

  this.generateSymbols = function(x, y) {
    var first = true;
    for (var i = 0; i < this.totalSymbols; i++) {
      var symbol = new Symbol(x, y, this.speed, first);
      symbol.setToRandomSymbol();
      this.symbols.push(symbol);
      y -= symbolSize;
      first = false;
    }
  };

  this.render = function() {
    this.symbols.forEach(function(symbol) {
      if (symbol.first && random() < 0.5) {
        fill(180, 255, 180);
      } else {
        fill(0, 255, 70);
      }
      text(symbol.value, symbol.x, symbol.y);
      symbol.rain();
      symbol.setToRandomSymbol();
    });
  };
}
