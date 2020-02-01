module.exports = (envVars) => {
  const { Sequelize, sequelize } = envVars.requires;

  class PokemonMove extends Sequelize.Model {}

  PokemonMove.init({
    pokemonId: Sequelize.INTEGER,
    moveId: Sequelize.INTEGER,
    level: Sequelize.INTEGER,
    tmHm: Sequelize.INTEGER,
  }, {
    // options
    sequelize,
    modelName: 'pokemon_moves',
    underscored: true,
    createdAt: 'created',
    updatedAt: 'modified',
    deletedAt: 'deleted',
    paranoid: true,
  });

  return PokemonMove;
};
