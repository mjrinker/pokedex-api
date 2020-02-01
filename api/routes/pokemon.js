const { envVars } = module.parent.exports; // import environment variables from parent
const { app } = envVars; // extract app from environment variables
const { models } = envVars; // extract app from environment variables

// GET Pokemon endpoint
app.get('/pokemon', async (req, res) => {
  const pokemon = await models.Pokemon.findAll({
    include: [
      {
        model: models.Move,
        as: 'Moves',
      },
    ],
  });

  return res.send(pokemon);
});

