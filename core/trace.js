/**
 * Created by danrumney on 5/27/16.
 */

var Fiber = require('fibers');

module.exports = function(message) {
  if(global.trace) {
    if (Fiber.current) {
      var proc = Fiber.current.fbpProc || {name: "no-proc"};
      console.log("<"+proc.name+">" + ' ' + message);
    } else {
      console.log("<no-fiber>: " + message);
    }
  }

};
