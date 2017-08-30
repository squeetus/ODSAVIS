/**
* Version support
* Depends on core.js
*/
(function() {
  if (typeof JSAV === "undefined") { return; }
  var theVERSION = "v1.0.1-19-gf7c700d";

  JSAV.version = function() {
    return theVERSION;
  };
})();
