require('dotenv').config();

module.exports = {
    host: process.env.host,
    database: process.env.database,
    user: process.env.user,
    password: process.env.password
}