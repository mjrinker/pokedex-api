const { envVars } = module.parent.exports; // import environment variables from parent

const models = {};

// import individual models
models.Evolution = require('./evolution')(envVars);
models.EvolutionaryStone = require('./evolutionary-stone')(envVars);
models.Location = require('./location')(envVars);
models.LocationType = require('./location-type')(envVars);
models.Move = require('./move')(envVars);
models.MoveCategory = require('./move-category')(envVars);
models.Pokemon = require('./pokemon')(envVars);
models.PokemonLocation = require('./pokemon-location')(envVars);
models.PokemonMove = require('./pokemon-move')(envVars);
models.PokemonTrainer = require('./pokemon-trainer')(envVars);
models.PokemonType = require('./pokemon-type')(envVars);
models.Region = require('./region')(envVars);
models.Token = require('./token')(envVars);
models.Trainer = require('./trainer')(envVars);
models.Type = require('./type')(envVars);

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

module.exports = models;
