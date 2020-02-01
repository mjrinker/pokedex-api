module.exports = (envVars) => {
  const { Sequelize, sequelize } = envVars.requires;

  class Pokemon extends Sequelize.Model {}

  Pokemon.init({
    // attributes (like columns in the table)
    // do not include id or created, modified, or deleted date columns
    name: Sequelize.STRING,
    picture: Sequelize.STRING,
    heightInches: Sequelize.INTEGER,
    weightLbs: Sequelize.FLOAT,
    description: Sequelize.STRING,
    baseHp: Sequelize.INTEGER,
    baseAttack: Sequelize.INTEGER,
    baseDefense: Sequelize.INTEGER,
    baseSpecialAttack: Sequelize.INTEGER,
    baseSpecialDefense: Sequelize.INTEGER,
    baseSpeed: Sequelize.INTEGER,
  }, {
    // options
    sequelize,
    modelName: 'pokemon', // the table name
    freezeTableName: true, // use pokemon instead of pokemons
    underscored: true, // convert table and column names to snake case when querying
    createdAt: 'created', // the created date column name
    updatedAt: 'modified', // the modified date column name
    deletedAt: 'deleted', // the deleted date column name
    paranoid: true, // soft-delete only
  });

  return Pokemon;
};
