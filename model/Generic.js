const { Sequelize, DataTypes } = require('sequelize');
const Term = require('./Term')
const db = require('./../config/db')

const Generic = db.define('generics', {
    title: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    },
    bn_link: {
        type: Sequelize.STRING
    },
    url: {
        type: Sequelize.STRING
    },
    slug: {
        type: Sequelize.STRING,
        unique: true
    },
    type: {
        type: Sequelize.STRING
    },
    monograph: {
        type: Sequelize.STRING
    },
    combinations: {
        type: Sequelize.STRING
    },
})

module.exports = Generic