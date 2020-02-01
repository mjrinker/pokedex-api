module.exports = (envVars) => {
  const { Sequelize, sequelize } = envVars.requires;

  class PokemonType extends Sequelize.Model {}

  PokemonType.init({
    pokemonId: Sequelize.INTEGER,
    typeId: Sequelize.INTEGER,
  }, {
    // options
    sequelize,
    modelName: 'pokemon_types',
    underscored: true,
    createdAt: 'created',
    updatedAt: 'modified',
    deletedAt: 'deleted',
    paranoid: true,
  });

  return PokemonType;
};
