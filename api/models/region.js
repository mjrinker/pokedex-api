module.exports = (envVars) => {
  const { Sequelize, sequelize } = envVars.requires;

  class Region extends Sequelize.Model {}

  Region.init({
    name: Sequelize.STRING,
  }, {
    // options
    sequelize,
    modelName: 'regions',
    underscored: true,
    createdAt: 'created',
    updatedAt: 'modified',
    deletedAt: 'deleted',
    paranoid: true,
  });

  return Region;
};
