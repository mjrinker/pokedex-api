module.exports = (envVars) => {
  const { Sequelize, sequelize } = envVars.requires;

  class MoveCategory extends Sequelize.Model {}

  MoveCategory.init({
    name: Sequelize.STRING,
  }, {
    // options
    sequelize,
    modelName: 'move_categories',
    underscored: true,
    createdAt: 'created',
    updatedAt: 'modified',
    deletedAt: 'deleted',
    paranoid: true,
  });

  return MoveCategory;
};
