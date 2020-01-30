const { envVars } = module.parent.exports; // import environment variables from parent
const { app } = envVars; // extract app from environment variables

// create a test route/endpoint with the GET method
// http://localhost:3000/hello
app.get('/hello', (req, res) => res.send('Hello World!'));
