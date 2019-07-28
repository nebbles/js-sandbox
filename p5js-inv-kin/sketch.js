var snake;

function setup() {
  // Set up canvas - fill screen with grid
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.elt.style.position = 'fixed';
  canvas.style('top', '0');
  canvas.style('left', '0');
  canvas.style('z-index', '-1');

  snake = new Snake(25, 10);
}

function touchMoved(event) {
  return false; // return false to block page scrolling
}

function draw() {
  background(51);

  snake.follow(mouseX, mouseY);
  snake.update();
  snake.show();

}
