// var xoff1 = 0;
// var xoff2 = 1000;
//
var inc = 0.02;
var start = 0;

function setup() {
  createCanvas(300, 300);

}

function draw() {
  background(51);

  stroke(255);
  noFill();
  beginShape();
  var xoff = start;
  for (var x = 0; x < width; x++) {
    var y = noise(xoff)*height;
    vertex(x, y);

    xoff += inc;
  }
  endShape();

  start += inc;


  // noLoop();

  // var x = map(noise(xoff1),0,1,0,width);
  // var y = map(noise(xoff2),0,1,0,height);
  //
  // xoff1 += 0.01;
  // xoff2 += 0.01;

  // ellipse(x,y,24);
}
