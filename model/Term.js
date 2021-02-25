const Sequelize = require('sequelize');
const Generic = require('./Generic')
const db = require('./../config/db')

const Term = db.define('term_and_taxanomy', {
    term: {
        type: Sequelize.STRING
    },
    taxanomy: {
        type: Sequelize.STRING
    },
    slug: {
        type: Sequelize.STRING,
        unique: true
    },
    type: {
        type: Sequelize.STRING
    }
}, { timestamps: false })

module.exports = Term