/**
 * Main application routes
 */

'use strict';

var path = require('path');

module.exports = function(app) {

  // Insert routes below
  app.get('/', function(req, res) {
      res.sendFile(path.join(__dirname + '/public/index.html'));
  });

};
