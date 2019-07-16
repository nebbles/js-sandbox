// Based on work from D.Shiffman written in Java
// https://www.youtube.com/watch?v=hbgDqyy8bIw
//
// Translated to Javascript by B.Greenberg

class Segment {
  constructor(length, angle) {
    this.len = length;
    this.angle = angle;
    // set defaults
    this.a = createVector();
    this.b = createVector();
    this.colour = color(255);
    this.weight = 5;
  }

  follow(target) {
    let dir = p5.Vector.sub(target, this.a); // set vector from a to target
    this.angle = dir.heading(); // get angle for new vector
    dir.setMag(this.len); // distance of 'a' from target is length of segment
    dir.mult(-1); // make position negative
    this.a = p5.Vector.add(target, dir); // add to find 'a'
  }

  update() {
    // Calculate the position of 'b'
    var dx = this.len * cos(this.angle);
    var dy = this.len * sin(this.angle);
    this.b.set(this.a.x + dx, this.a.y + dy);
  }

  render() {
    stroke(this.colour);
    strokeWeight(this.weight);
    line(this.a.x, this.a.y, this.b.x, this.b.y);
  }
}