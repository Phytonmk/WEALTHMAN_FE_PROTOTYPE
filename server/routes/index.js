const fs = require('fs');
const path = require('path');

module.exports = (app) => {
  // API routes
  fs.readdirSync(__dirname + '/api/').forEach((file) => {
    const route = require(`${__dirname}/api/${file}`)
    if (typeof route === 'function')
      route(app)
    else
      console.warn(`Route ${file} has no exported function`)
  });
};
