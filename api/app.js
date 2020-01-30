const express = require('express'); // import express (rest api package)
const app = express(); // initialize the express app
const port = 3000; // set the http port number

// export environment variables
module.exports.envVars = {
  app
};

// include all the routes in routes/test.js
require('./routes/test');

// start the app listening on the specified port
app.listen(port, () => console.log(`Pokedex API listening on port ${port}!`));
