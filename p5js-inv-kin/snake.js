function Snake(nSegs, len) {
  this.body = [new Segment(len, 0)];
  this.len = nSegs;

  for (i = 1; i < nSegs; i++) {
    append(this.body,
      new Segment(len, 0, this.body[i - 1]));
    this.body[i].col = 255 * i / nSegs;
    this.body[i].sw = map(i, 0, this.len, 5, 1);
  }
  console.log(this.body);
}

Snake.prototype.follow = function(tx, ty) {
  this.body[0].follow(tx, ty);
  for (i = 1; i < this.len; i++) {
    this.body[i].followParent();
  }
};

Snake.prototype.update = function() {
  for (i = 0; i < this.len; i++) {
    this.body[i].update();
  }
};

Snake.prototype.show = function() {
  for (i = 0; i < this.len; i++) {
    this.body[i].show();
  }
};
