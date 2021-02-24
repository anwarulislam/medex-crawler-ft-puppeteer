const Sequelize = require('sequelize');
const db = require('../config/db')

const Brands = db.define('brands', {
    title: {
        type: Sequelize.STRING
    },
    dosage_form: {
        type: Sequelize.STRING
    },
    strength: {
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
    prices: {
        type: Sequelize.STRING
    },
    pharma_name: {
        type: Sequelize.STRING
    },
    pharma_url: {
        type: Sequelize.STRING
    },
    pharma_slug: {
        type: Sequelize.STRING
    },
    generic_name: {
        type: Sequelize.STRING
    },
    generic_url: {
        type: Sequelize.STRING
    },
    generic_slug: {
        type: Sequelize.STRING
    },
})

module.exports = Brands