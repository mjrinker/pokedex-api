module.exports = (envVars) => {
  const { Sequelize, sequelize } = envVars.requires;

  class Trainer extends Sequelize.Model {}

  Trainer.init({
    name: Sequelize.STRING,
    username: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    picture: Sequelize.STRING,
    hometownId: Sequelize.INTEGER,
    gender: Sequelize.STRING,
    birthday: Sequelize.DATE,
  }, {
    // options
    sequelize,
    modelName: 'trainers',
    underscored: true,
    createdAt: 'created',
    updatedAt: 'modified',
    deletedAt: 'deleted',
    paranoid: true,
  });

  return Trainer;
};
