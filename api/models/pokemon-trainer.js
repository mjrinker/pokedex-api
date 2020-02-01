module.exports = (envVars) => {
  const { Sequelize, sequelize } = envVars.requires;

  class PokemonTrainer extends Sequelize.Model {}

  PokemonTrainer.init({
    pokemonId: Sequelize.INTEGER,
    trainerId: Sequelize.INTEGER,
    traderId: Sequelize.INTEGER,
    nickname: Sequelize.STRING,
    seen: Sequelize.BOOLEAN,
    caught: Sequelize.BOOLEAN,
  }, {
    // options
    sequelize,
    modelName: 'pokemon_trainers',
    underscored: true,
    createdAt: 'created',
    updatedAt: 'modified',
    deletedAt: 'deleted',
    paranoid: true,
  });

  return PokemonTrainer;
};
