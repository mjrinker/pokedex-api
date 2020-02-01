const express = require('express'); // import express (rest api package)
const Sequelize = require('sequelize'); // import sequelize (database ORM)

const app = express(); // initialize the express app
const port = 3000; // set the http port number

// export environment variables
module.exports.envVars = {
  app,
  requires: {
    Sequelize,
  },
};

// initialize sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: '../pokedex.db',
});

// add sequelize to envVars
module.exports.envVars.requires.sequelize = sequelize;

const models = require('./models/models');

module.exports.envVars.models = models;

// include all the routes in routes/test.js
require('./routes/test');
require('./routes/pokemon');

// start the app listening on the specified port
app.listen(port, () => console.log(`Pokedex API listening on port ${port}!`));
