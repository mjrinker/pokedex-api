module.exports = (envVars) => {
  const { Sequelize, sequelize } = envVars.requires;

  class Type extends Sequelize.Model {}

  Type.init({
    name: Sequelize.STRING,
  }, {
    // options
    sequelize,
    modelName: 'types',
    underscored: true,
    createdAt: 'created',
    updatedAt: 'modified',
    deletedAt: 'deleted',
    paranoid: true,
  });

  return Type;
};
