module.exports = (envVars) => {
  const { Sequelize, sequelize } = envVars.requires;

  class Move extends Sequelize.Model {}

  Move.init({
    name: Sequelize.STRING,
    typeId: Sequelize.INTEGER,
    categoryId: Sequelize.INTEGER,
    basePp: Sequelize.INTEGER,
    maxPp: Sequelize.INTEGER,
    accuracy: Sequelize.INTEGER,
    tm: Sequelize.INTEGER,
    hm: Sequelize.INTEGER,
  }, {
    // options
    sequelize,
    modelName: 'moves',
    underscored: true,
    createdAt: 'created',
    updatedAt: 'modified',
    deletedAt: 'deleted',
    paranoid: true,
  });

  return Move;
};
