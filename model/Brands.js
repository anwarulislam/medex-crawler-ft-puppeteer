const Sequelize = require('sequelize');
const db = require('./../config/db')

const Brands = db.define('brands', {
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

module.exports = Brands