const Sequelize = require('sequelize');
const db = require('./../config/db')

const Pharma = db.define('generics', {
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

module.exports = Pharma