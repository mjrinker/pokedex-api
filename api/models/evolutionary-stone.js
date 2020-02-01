module.exports = (envVars) => {
  const { Sequelize, sequelize } = envVars.requires;

  class EvolutionaryStone extends Sequelize.Model {}

  EvolutionaryStone.init({
    name: Sequelize.STRING,
  }, {
    // options
    sequelize,
    modelName: 'evolutionary_stones',
    underscored: true,
    createdAt: 'created',
    updatedAt: 'modified',
    deletedAt: 'deleted',
    paranoid: true,
  });

  return EvolutionaryStone;
};
