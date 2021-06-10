const Sequelize = require("sequelize");

const connection = new Sequelize('blogpress', 'root', '',{
    dialect: 'sqlite',

    storage: 'database/database.sqlite', 
    dialectOptions: {
        timezone: "-03:00"
    }
})


module.exports = connection;