var snake;

function setup() {
  createCanvas(400, 300);

  snake = new Snake(25, 10);


}

function draw() {
  background(51);

  snake.follow(mouseX, mouseY);
  snake.update();
  snake.show();

}
