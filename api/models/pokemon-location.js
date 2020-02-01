module.exports = (envVars) => {
  const { Sequelize, sequelize } = envVars.requires;

  class PokemonLocation extends Sequelize.Model {}

  PokemonLocation.init({
    pokemonId: Sequelize.INTEGER,
    locationId: Sequelize.INTEGER,
    wild: Sequelize.BOOLEAN,
    evolve: Sequelize.BOOLEAN,
  }, {
    // options
    sequelize,
    modelName: 'pokemon_locations',
    underscored: true,
    createdAt: 'created',
    updatedAt: 'modified',
    deletedAt: 'deleted',
    paranoid: true,
  });

  return PokemonLocation;
};
