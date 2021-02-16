const Sequelize = require('sequelize');
const db = require('./../config/db')

const Pharma = db.define('pharmaceuticals', {
    title: {
        type: Sequelize.STRING
    },
    url: {
        type: Sequelize.STRING
    },
    slug: {
        type: Sequelize.STRING
    },
})

module.exports = Pharma