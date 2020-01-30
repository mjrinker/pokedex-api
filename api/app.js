const express = require('express'); // import express (rest api package)
const app = express(); // initialize the express app
const port = 3000; // set the http port number

// create a test route/endpoint with the GET method
// http://localhost:3000/hello
app.get('/hello', (req, res) => res.send('Hello World!'));

// start the app listening on the specified port
app.listen(port, () => console.log(`Pokedex API listening on port ${port}!`));
