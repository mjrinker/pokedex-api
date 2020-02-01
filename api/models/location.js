module.exports = (envVars) => {
  const { Sequelize, sequelize } = envVars.requires;

  class Location extends Sequelize.Model {}

  Location.init({
    regionId: Sequelize.INTEGER,
    typeId: Sequelize.INTEGER,
    name: Sequelize.STRING,
  }, {
    // options
    sequelize,
    modelName: 'locations',
    underscored: true,
    createdAt: 'created',
    updatedAt: 'modified',
    deletedAt: 'deleted',
    paranoid: true,
  });

  return Location;
};
