const Sequelize = require('sequelize');
const db = require('./../config/db')

const Pharma = db.define('generics', {
    title: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    },
    url: {
        type: Sequelize.STRING
    },
    slug: {
        type: Sequelize.STRING
    },
    type: {
        type: Sequelize.STRING
    },
})

module.exports = Pharma