const { envVars } = module.parent.exports; // import environment variables from parent
const { app } = envVars; // extract app from environment variables
const { models } = envVars; // extract models from environment variables
const { middleware } = envVars; // extract middleware from environment variables

// GET Pokemon endpoint
app.get('/pokemon', middleware.auth.authenticateToken, async (req, res) => {
  const pokemon = await models.Pokemon.findAll({
    include: [
      {
        model: models.Evolution,
        as: 'Evolutions',
        include: [{
          model: models.Pokemon,
          as: 'EvolutionTargetPokemon',
        }],
      },
      {
        model: models.Evolution,
        as: 'Devolutions',
        include: [{
          model: models.Pokemon,
          as: 'EvolutionSourcePokemon',
        }],
      },
      {
        model: models.Location,
        as: 'Locations',
      },
      {
        model: models.Move,
        as: 'Moves',
      },
      {
        model: models.Type,
        as: 'Types',
      },
    ],
  });

  return res.send(pokemon);
});

// POST Catch Pokemon endpoint
app.post('/trainer/:trainerId/catch/:pokemonId', middleware.auth.authenticateToken, async (req, res) => {
  // get the ids from the request path and body and query string
  const { trainerId, pokemonId } = req.params;
  const nickname = req.body.nickname || req.query.nickname || null;

  // check if trainer with trainerId exists
  const trainer = await models.Trainer.findByPk(trainerId);

  // check if pokemon with pokemonId exists
  const pokemon = await models.Pokemon.findByPk(pokemonId);

  if (trainer) {
    if (pokemon) {
      try {
        await models.PokemonTrainer.create({
          pokemonId,
          trainerId,
          nickname,
          seen: true,
          caught: true,
        });

        res.send(`${trainer.name} caught ${pokemon.name}!`);
      } catch (err) {
        res.status(500)
          .send({
            message: 'Unable to catch Pokemon',
            error: err,
          });
      }
    } else {
      res.status(404)
        .send({
          message: 'Pokemon not found',
        });
    }
  } else {
    res.status(404)
      .send({
        message: 'Trainer not found',
      });
  }
});

// DELETE Release Pokemon endpoint
app.delete('/trainer/:trainerId/release/:id', middleware.auth.authenticateToken, async (req, res) => {
  // get the ids from the request path and body and query string
  const { trainerId, id } = req.params;

  // check if trainer with trainerId exists
  const trainer = await models.Trainer.findByPk(trainerId);

  if (trainer) {
    try {
      const pokemon = await models.Pokemon.findOne({
        include: [{
          model: models.PokemonTrainer,
          as: 'PokemonTrainers',
          where: {
            id,
          },
        }],
      });

      await models.PokemonTrainer.destroy({
        where: {
          id,
          trainerId,
          caught: true,
        },
      });

      res.send(`${trainer.name} released ${pokemon.name}! Bye ${pokemon.name}!`);
    } catch (err) {
      res.status(500)
        .send({
          message: 'Unable to release Pokemon',
          error: err,
        });
    }
  } else {
    res.status(404)
      .send({
        message: 'Trainer not found',
      });
  }
});
