Array.prototype.contains = function (item) {
    return this.indexOf(item) > 0;
};

Array.prototype.remove = function (item) {
    let index = this.indexOf(item);
    if (index > -1) {
        this.splice(index, 1);
        return true; // successfully removed
    }
    return false; // item was not in list
};