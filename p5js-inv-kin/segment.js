function Segment(length_, angle_, parent) {
  this.a = createVector();
  this.angle = angle_;
  this.len = length_;
  this.b = createVector();
  this.parent = parent;
  this.col = 255;
  this.sw = 5;
  if (parent) {
    this.follow(this.parent.a.x, this.parent.a.y);
  }
}

Segment.prototype.followParent = function() {
  this.follow(this.parent.a.x, this.parent.a.y);
};

Segment.prototype.follow = function(tx, ty) {
  var target = createVector(tx, ty);
  var dir = p5.Vector.sub(target, this.a);
  this.angle = dir.heading();

  dir.setMag(this.len);
  dir.mult(-1);

  this.a = p5.Vector.add(target, dir);
};

Segment.prototype.calcB = function() {
  var dx = this.len * cos(this.angle);
  var dy = this.len * sin(this.angle);
  this.b.set(this.a.x + dx, this.a.y + dy);
};

Segment.prototype.update = function() {
  this.calcB();
};

Segment.prototype.show = function() {
  stroke(this.col, 0, 255 - this.col);
  strokeWeight(this.sw);
  line(this.a.x, this.a.y, this.b.x, this.b.y);
};
