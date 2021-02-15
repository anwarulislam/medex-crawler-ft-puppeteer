const { Sequelize, Model, DataTypes } = require('sequelize');
// Option 2: Passing parameters separately (sqlite)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db.sqlite'
});

// Option 2: Passing parameters separately (other dialects)
// const sequelize = new Sequelize('database', 'username', 'password', {
//     host: 'localhost',
//     dialect: /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
//   });

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((err) => {
    console.error('Unable to connect to the database:', error);
})

module.exports = db