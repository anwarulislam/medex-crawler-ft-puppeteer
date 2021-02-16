const { Sequelize, Model, DataTypes } = require('sequelize');
// Option 2: Passing parameters separately (sqlite)
// const sequelize = new Sequelize({
//     dialect: 'sqlite',
//     storage: 'db.sqlite'
// });

// Option 2: Passing parameters separately (other dialects)
const sequelize = new Sequelize('medex', 'root', '', {
    logging: false,
    host: 'localhost',
    dialect: 'mysql' /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
});

sequelize.authenticate().then(() => {
    console.log('\n Connection has been established successfully. \n');
}).catch((err) => {
    console.error('\n Unable to connect to the database: \n ', error);
})

module.exports = sequelize