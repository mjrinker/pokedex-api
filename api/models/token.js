module.exports = (envVars) => {
  const { Sequelize, sequelize } = envVars.requires;

  class Token extends Sequelize.Model {}

  Token.init({
    trainerId: Sequelize.INTEGER,
    refreshToken: Sequelize.STRING,
  }, {
    // options
    sequelize,
    modelName: 'tokens',
    underscored: true,
    createdAt: 'created',
    updatedAt: 'modified',
    deletedAt: 'deleted',
    paranoid: true,
  });

  return Token;
};
