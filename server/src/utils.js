"use strict";

module.exports.generate_id = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
};

module.exports.split_path = function (str) {
    return str.split('\\').pop().split('/').pop();
}

module.exports.circularIterator = function*(iterable) {
  while (iterable.size>0) {
    yield* iterable;
  }
}



module.exports.shuffle = function(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
