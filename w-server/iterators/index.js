const fs = require('fs');
const path = require('path');

module.exports = (app) => {
  // Workers
  fs.readdirSync(__dirname + '/workers/').forEach((file) => {
    require(`${__dirname}/workers/${file.substr(0, file.indexOf('.'))}`);
  });
};
