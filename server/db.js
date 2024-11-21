const pgp = require('pg-promise')();

const connection = {
    host: "localhost",
    port: 5432,
    database: "yellow-taxi",
    user: "postgres",
    password: "Prokontol69",
};

const db = pgp(connection);

module.exports = db;
