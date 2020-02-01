module.exports = (envVars) => {
  const { Sequelize, sequelize } = envVars.requires;

  class Evolution extends Sequelize.Model {}

  Evolution.init({
    pokemonId: Sequelize.INTEGER,
    evolutionId: Sequelize.INTEGER,
    level: Sequelize.INTEGER,
    stoneId: Sequelize.INTEGER,
    trade: Sequelize.BOOLEAN,
  }, {
    // options
    sequelize,
    modelName: 'evolutions',
    underscored: true,
    createdAt: 'created',
    updatedAt: 'modified',
    deletedAt: 'deleted',
    paranoid: true,
  });

  return Evolution;
};
