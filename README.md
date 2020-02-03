# Pokedex REST API

## Step 0: Install Dependencies and Set Up Repo

* [Sublime Text 3](https://www.sublimetext.com/3) or other code text editor
* [Postman](https://www.getpostman.com/downloads/) or other HTTP request client
* [DB Browser for SQLite](https://sqlitebrowser.org/dl/) or other SQLite database browser
* [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
* [Sourcetree](https://www.sourcetreeapp.com/) or other git GUI
* [GitHub Account](https://github.com/)
* [NodeJS (version 10 or higher)](https://nodejs.org/en/download/)

Once you have the above installed and have created a GitHub account, [fork](https://help.github.com/en/github/getting-started-with-github/fork-a-repo) this [repository](https://github.com/mjrinker/pokedex-api).
Then in your [forked version](https://help.github.com/en/github/getting-started-with-github/fork-a-repo) of this [repository](https://github.com/mjrinker/pokedex-api), [clone](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository) your repository to your computer.

Check out the branch `1_init`, which starts from the end of step 1. You can also just create a new repository on your computer and start following from step 1 below.

## Step 1: Initialize the API

Create a new folder where you will store this project or navigate to the directory where you cloned the repository.

In terminal, navigate to this directory:

`cd /path/to/your/project`

Start a new Node project by typing this into terminal:

`npm init`

It will prompt you to enter different values. You can use the defaults for most of them except for this one:

`entry point: (index.js)` `app.js`

Install Express.JS in terminal:

`npm install express --save`

Create app.js:

```javascript
const express = require('express'); // import express (rest api package)

const app = express(); // initialize the express app
const port = 3000; // set the http port number

// create a test route/endpoint with the GET method
// http://localhost:3000/hello
app.get('/hello', (req, res) => res.send('Hello World!'));

// start the app listening on the specified port
app.listen(port, () => console.log(`Pokedex API listening on port ${port}!`));

```

Run your app in terminal:

`node app.js`

(You can press Ctrl+C anytime to stop the app)

Send GET request to http://localhost:3000/hello in Postman


## Step 2: Move routes into routes folder

Create routes dir

Create routes/test.js

Move hello world route into test.js

Add environment variables export to app.js (just after where `port` is declared):

```javascript
// export environment variables
module.exports.envVars = {
  app,
};
```

Import environment variables into routes/test.js (at the top):

```javascript
const { envVars } = module.parent.exports; // import environment variables from parent
const { app } = envVars; // extract app from environment variables
```

Use the routes from routes/test.js in app.js (just after where you declared `module.exports.envVars`):

```javascript
// include all the routes in routes/test.js
require('./routes/test');
```

Restart the app and test the hello world route again to make sure it still works.


## Step 3: Get data from data source

`npm install sequelize sqlite3 --save`

Import Sequelize into app.js (at the top, after the express import):

```javascript
const Sequelize = require('sequelize'); // import sequelize (database ORM)

```

Add a `requires` key on `envVars` in app.js:

```javascript
module.exports.envVars = {
  app,
  requires: {
  	Sequelize,
  }
};
```

Initialize Sequelize for use with SQLite database (just after where you declared `module.exports.envVars`):

```javascript
// initialize sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: '../pokedex.db',
});

// add sequelize to envVars
module.exports.envVars.requires.sequelize = sequelize;
```

Create models directory

Create models/models.js:

```javascript
const { envVars } = module.parent.exports; // import environment variables from parent

const models = {};

module.exports = models;

```

Create models/pokemon.js:

```javascript
module.exports = (envVars) => {
  const { Sequelize, sequelize } = envVars.requires;

  class Pokemon extends Sequelize.Model {}

  Pokemon.init({
    // attributes (like columns in the table)
    // do not include id or created, modified, or deleted date columns
    name: Sequelize.STRING,
    picture: Sequelize.STRING,
    heightInches: Sequelize.INTEGER,
    weightLbs: Sequelize.FLOAT,
    description: Sequelize.STRING,
    baseHp: Sequelize.INTEGER,
    baseAttack: Sequelize.INTEGER,
    baseDefense: Sequelize.INTEGER,
    baseSpecialAttack: Sequelize.INTEGER,
    baseSpecialDefense: Sequelize.INTEGER,
    baseSpeed: Sequelize.INTEGER,
  }, {
    // options
    sequelize,
    modelName: 'pokemon', // the table name
    freezeTableName: true, // use pokemon instead of pokemons
    underscored: true, // convert table and column names to snake case when querying
    createdAt: 'created', // the created date column name
    updatedAt: 'modified', // the modified date column name
    deletedAt: 'deleted', // the deleted date column name
    paranoid: true, // soft-delete only
  });
  
  return Pokemon;
};

```

Import the Pokemon model into models/models.js (just after the export):

```javascript
// import individual models
models.Pokemon = require('./pokemon')(envVars);
```

Create models classes for the rest of the tables in the database and import them into models/models.js

Add model associations (entity relationships) to models/models.js (right after the individual model imports):

```javascript
// create model associations
models.Evolution.belongsTo(models.EvolutionaryStone, { as: 'EvolutionaryStone', foreignKey: 'stoneId' });
models.Evolution.belongsTo(models.Pokemon, { as: 'EvolutionSourcePokemon', foreignKey: 'pokemonId' });
models.Evolution.belongsTo(models.Pokemon, { as: 'EvolutionTargetPokemon', foreignKey: 'evolutionId' });
models.Location.belongsTo(models.LocationType, { as: 'LocationType', foreignKey: 'typeId' });
models.Location.belongsTo(models.Region, { as: 'Region', foreignKey: 'regionId' });
models.Location.belongsToMany(models.Pokemon, { as: 'Pokemon', through: 'pokemon_locations', foreignKey: 'locationId' });
models.Move.belongsTo(models.Type, { as: 'MoveType', foreignKey: 'typeId' });
models.Move.belongsTo(models.MoveCategory, { as: 'MoveCategory', foreignKey: 'categoryId' });
models.Pokemon.hasMany(models.Evolution, { as: 'Evolutions', foreignKey: 'pokemonId' });
models.Pokemon.hasMany(models.Evolution, { as: 'Devolutions', foreignKey: 'evolutionId' });
models.Pokemon.belongsToMany(models.Location, { as: 'Locations', through: 'pokemon_locations', foreignKey: 'pokemonId' });
models.Pokemon.belongsToMany(models.Move, { as: 'Moves', through: 'pokemon_moves', foreignKey: 'pokemonId' });
models.Pokemon.hasMany(models.PokemonTrainer, { as: 'PokemonTrainers', foreignKey: 'pokemonId' });
models.Pokemon.belongsToMany(models.Type, { as: 'Types', through: 'pokemon_types', foreignKey: 'pokemonId' });
models.Trainer.belongsToMany(models.Pokemon, { as: 'Pokemon', through: 'pokemon_trainers', foreignKey: 'trainerId' });
models.Trainer.belongsTo(models.Location, { as: 'Hometown', foreignKey: 'hometownId' });
```

Import the models into app.js (after the sequelize init function):

```javascript
const models = require('./models/models');

module.exports.envVars.models = models;
```

Create routes/pokemon.js:

```javascript
const { envVars } = module.parent.exports; // import environment variables from parent
const { app } = envVars; // extract app from environment variables
const { models } = envVars; // extract app from environment variables

```

Add test pokemon route to routes/pokemon.js:

```javascript
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

```

Import this file into app.js (after the test route import):

```javascript
require('./routes/pokemon');
```

Send a request to this endpoint:
http://localhost:3000/pokemon/


## Step 4: Build more routes

Install body-parser

`npm install body-parser --save`

Add body-parser to app.js imports (at the top):

```javascript
const bodyParser = require('body-parser'); // import body-parser
```

Use body-parser in app.js (before the routes imports):

```javascript
// use middleware
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  return next();
});
```

### GET Pokemon

In the GET Pokemon endpoint in routes/pokemon.js, add a few more includes to the query:

```javascript
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
```

### POST Catch Pokemon

Add a POST route for catching Pokemon:

```javascript
// POST Catch Pokemon endpoint
app.post('/trainer/:trainerId/catch/:pokemonId', async (req, res) => {

});
```

The `:trainerId` and `:pokemonId` are path placeholders that the requester can replace with an actual value.
In this case, `trainerId` is the ID of the trainer who is catching the pokemon, and `pokemonId` is the ID of the Pokemon to catch.

Parse the request path, body, and query string params in the POST Catch Pokemon endpoint:

```javascript
// get the ids from the request path and body and query string
const { trainerId, pokemonId } = req.params;
const nickname = req.body.nickname || req.query.nickname || null;
```

Find the trainer in the database using its [primary key] ID:

```javascript
// check if trainer with trainerId exists
const trainer = await models.Trainer.findByPk(trainerId);
```

Do the same with the Pokemon:

```javascript
// check if pokemon with pokemonId exists
const pokemon = await models.Pokemon.findByPk(pokemonId);
```

Add and if-else to check if the trainer with that ID exists, and another one for the Pokemon inside it:

```javascript
if (trainer) {
  if (pokemon) {

	} else {

	}
} else {

}
```

Inside the `if (pokemon) {}`, create a new record linking that Pokemon to the trainer:

```javascript
await models.PokemonTrainer.create({
  pokemonId,
  trainerId,
  nickname,
  seen: true,
  caught: true,
});
```

Send a response saying that the trainer caught the Pokemon:

```javascript
res.send(`${trainer.name} caught ${pokemon.name}!`);
```

In the else block of the `if (pokemon) {}`, send an error response that the Pokemon was not found:

```javascript
res.status(404)
  .send({
    message: 'Pokemon not found',
  });
```

Do the same for the `if (trainer) {}` else block:

```javascript
res.status(404)
  .send({
    message: 'Trainer not found',
  });
```

Add a try-catch around the create PokemonTrainer call to catch any errors that might occur:

```javascript
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
```

Test it and check the database to see if the data was added!


### DELETE Release Pokemon

This route is very similar to the POST Catch Pokemon route, but we need to change a few things.

Change `post` to `delete` and `catch` to `release` in the route path, and `:pokemonId` to `:id`:

```javascript
// DELETE Release Pokemon endpoint
app.delete('/trainer/:trainerId/release/:id', async (req, res) => {

});
```

Change `pokemonId` to `id`, as we will be using the primary key id on the pokemon_trainers table:

```javascript
const { trainerId, id } = req.params;
```

You can remove the `nickname` variable:

```diff
- const nickname = req.body.nickname || req.query.nickname || null;
```

As well as the query to the Pokemon model:

```diff
- // check if pokemon with pokemonId exists
- const pokemon = await models.Pokemon.findByPk(id);
```

Also delete the `if (pokemon) {} else {}` statement:

```diff
- if (pokemon) {
```
```javascript
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
```
```diff
- } else {
-   res.status(404)
-    .send({
-       message: 'Pokemon not found',
-     });
- }
```

OPTIONAL:
If you still want to send the Pokemon's name as part of the response, you will need to get that data by querying the database.

To do so, put this query just before the `await models.PokemonTrainer.create({ ... });`:

```javascript
const pokemon = await models.Pokemon.findOne({
  include: [{
    model: models.PokemonTrainer,
    as: 'PokemonTrainers',
    where: {
      id,
    },
  }],
});
```

Change `create` to `destroy` in the query call. This will soft-delete the record because we have `paranoid` set to `true` on the Model definition.

```javascript
await models.PokemonTrainer.destroy({
```

Wrap your query params in a `where` object and change the `pokemonId` param in the query call to `id`, remove `nickname` and `seen`:

```javascript
await models.PokemonTrainer.destroy({
  where: {
    id,
    trainerId,
    caught: true,
  },
});
```

Change you response messages to be more relevant to releasing a Pokemon:

```javascript
res.send(`${trainer.name} released ${pokemon.name}! Bye ${pokemon.name}!`);

// OR

res.send(`${trainer.name} released a Pokemon! Bye!`);
```

```javascript
res.status(500)
  .send({
    message: 'Unable to release Pokemon',
    error: err,
  });
```

Test it and check the database to see if the data was updated!


## Step 5: Authentication

Install dependencies:

`npm install bcrypt dotenv jsonwebtoken --save`

Add `.env` to .gitignore file.

Create .env file:

```
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
MIN_PASSWORD_LENGTH=

```

Set the value for `MIN_PASSWORD_LENGTH` to a number that you want to represent the minimum-allowed length of a password.

For `ACCESS_TOKEN_SECRET`, run the following in terminal:
`node`
`require('crypto').pseudoRandomBytes(64).toString('hex');`

Copy the result in the value of `ACCESS_TOKEN_SECRET`

Do the same for `REFRESH_TOKEN_SECRET`

Type `.exit` in terminal to exit node.

Create authServer.js:

```javascript
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

```

Create routes/auth.js:

```javascript
const { envVars } = module.parent.exports; // import environment variables from parent
const { authServer } = envVars; // extract app from environment variables
const { models } = envVars; // extract app from environment variables
const { bcrypt } = envVars.requires;
const { jwt } = envVars.requires;
const { Sequelize } = envVars.requires;
const { Op } = Sequelize;

const generateAccessToken = (payload) => jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });

authServer.post('/login', async (req, res, next) => {
  let message = 'There was a problem logging in.';
  const additionalMessage = 'Please check to make sure your email and password is correct and try again.';

  const trainer = await models.Trainer.findOne({
    where: {
      [Op.and]: {
        ...(req.body.email ? { email: req.body.email } : {}),
        ...(req.body.username ? { username: req.body.username } : {}),
      },
    },
    raw: true,
  });

  if (!trainer) {
    message += ` ${additionalMessage}`;
    res.status(404).send({
      message,
    });
  }

  try {
    if (!(await bcrypt.compare(req.body.password, trainer.password))) {
      message += ` ${additionalMessage}`;
      res.status(401).send({
        message,
      });

      return next();
    }
  } catch (err) {
    res.status(500).send({
      message,
    });

    return next();
  }

  const accessToken = generateAccessToken(trainer);
  const refreshToken = jwt.sign(trainer, process.env.REFRESH_TOKEN_SECRET);

  const salt = await bcrypt.genSalt();
  const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);

  await models.Token.create({
    trainerId: trainer.id,
    refreshToken: hashedRefreshToken,
  });

  res.json({
    expiresInSeconds: 1800,
    accessToken,
    refreshToken,
  });

  return next();
});

authServer.delete('/logout', async (req, res, next) => {
  const { refreshToken } = req.body;

  const message = 'There was a problem logging out.';

  if (!refreshToken) {
    return res.status(401)
      .send({
        message,
      });
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, trainer) => {
    if (err) {
      return res.status(403)
        .send({
          message,
        });
    }

    return models.Token.findAll({
      where: {
        trainerId: trainer.id,
      },
    })
      .then(async (tokens) => {
        if (tokens.length === 0) {
          res.status(200)
            .send({
              message: 'You have successfully logged out.',
            });
          return next();
        }

        let tokenToDelete = null;
        for (const token of tokens) {
          if (await bcrypt.compare(refreshToken, token.refreshToken)) {
            tokenToDelete = token;
            break;
          }
        }

        if (!tokenToDelete) {
          return res.status(403)
            .send({
              message,
            });
        }

        await models.Token.destroy({
          where: {
            id: tokenToDelete.id,
          },
        });

        res.status(200)
          .send({
            message: 'You have successfully logged out.',
          });
        return next();
      });
  });
});

authServer.put('/refresh_token', async (req, res, next) => {
  const { refreshToken } = req.body;

  const message = 'There was a problem refreshing your access token.';

  if (!refreshToken) {
    return res.status(401).send({
      message,
    });
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, trainer) => {
    if (err) {
      return res.status(403).send({
        message,
      });
    }

    return models.Token.findAll({
      where: {
        user_id: trainer.id,
      },
    }).then(async (tokens) => {
      let tokenFound = false;
      for (const token of tokens) {
        if (await bcrypt.compare(refreshToken, token.refreshToken)) {
          tokenFound = true;
          break;
        }
      }

      if (!tokenFound) {
        return res.status(403).send({
          message,
        });
      }

      const accessToken = generateAccessToken({ email: trainer.email });
      res.send({
        expiresInSeconds: 1800,
        accessToken,
      });
      return next();
    });
  });
});

authServer.post('/register', async (req, res) => {
  let message = 'There was a problem registering.';

  const { password } = req.body;
  if (!password
    || password.length < parseInt(process.env.MIN_PASSWORD_LENGTH, 10)) {
    message += ' Make sure your password follows the guidelines.';
    return res.status(400).send({
      message,
    });
  }

  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    await models.Trainer.create({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      picture: req.body.picture || null,
      hometownId: req.body.hometownId || null,
      gender: req.body.gender || null,
      birthday: req.body.birthday ? new Date(req.body.birthday) : null,
    });

    return res.status(201).send({
      message: 'Thank you for registering!',
    });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      message += ' A trainer with that email and/or username already exists.';
      return res.status(409).send({
        message,
      });
    }
    return res.status(500).send({
      message,
    });
  }
});

```

Create middleware directory.

Create middleware/auth.js:

```javascript
const { envVars } = module.parent.exports;
const { jwt } = envVars.requires;

module.exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).send({
      message: 'There was a problem logging in.',
    });
  }

  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, trainer) => {
    if (err) {
      return res.status(403).send({
        message: 'There was a problem logging in.',
      });
    }

    req.trainer = trainer;
    return next();
  });
};

```

Import middleware/auth.js into app.js (after the other middleware `app.use` statements):

```javascript
module.exports.envVars.middleware = { auth: require('./middleware/auth') };
```

Import dotenv and jwt packages into app.js (at the top):

```javascript
require('dotenv').config();

const jwt = require('jsonwebtoken'); // import jwt
```

Add jwt to envVars.requires in app.js:

```javascript
module.exports.envVars = {
  app,
  requires: {
    jwt,
    Sequelize,
  },
};
```

To require authentication on an endpoint, first import middleware into the corresponding routes file (at the top):

```javascript
const { middleware } = envVars; // extract middleware from environment variables
```

Then, add `middleware.auth.authenticateToken` as the second param on the route definition:

```javascript
app.get('/pokemon', middleware.auth.authenticateToken, async (req, res) => {});
```

Run the authServer through app.js (at the bottom just before `app.listen`):

```javascript
require('./authServer');
```

Now you can register, login, logout, and refresh your token by hitting the different auth routes. Remember to use port 4000 for these routes because that is what port the auth server is running on.

The sample trainers in the pokedex.db database have the same password: `iWannaB3teHV3ry3est`

Once you log in, copy the access token from the response and use the following header on any request that requires authentication:

`Authorization`: `Bearer {{accessToken}}` (replace {{accessToken}} with your accessToken)
