require('dotenv').config();

const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');
const Sequelize = require('sequelize');

const authServer = express();
const port = 4000;

module.exports.envVars = {
  authServer,
  middleware: {},
  requires: {
    bcrypt,
    bodyParser,
    express,
    fs,
    jwt,
    path,
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

// use middleware
authServer.use(bodyParser.json());
authServer.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  return next();
});

// include auth routes
require('./routes/auth');

// start the authServer listening on the specified port
authServer.listen(port, () => console.log(`Auth Server listening on port ${port}!`));
