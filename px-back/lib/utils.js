module.exports.objToFlattenArray = function (obj) {
  var flatten = require('flat');

  var keysAndValues = [];
  var flattened = flatten(obj);
  for (var property in flattened) {
      if (flattened.hasOwnProperty(property)) {
          keysAndValues.push(property);
          keysAndValues.push(flattened[property]);
      }
  }

  return keysAndValues;
}
