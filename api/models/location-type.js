module.exports = (envVars) => {
  const { Sequelize, sequelize } = envVars.requires;

  class LocationType extends Sequelize.Model {}

  LocationType.init({
    name: Sequelize.STRING,
  }, {
    // options
    sequelize,
    modelName: 'location_types',
    underscored: true,
    createdAt: 'created',
    updatedAt: 'modified',
    deletedAt: 'deleted',
    paranoid: true,
  });

  return LocationType;
};
