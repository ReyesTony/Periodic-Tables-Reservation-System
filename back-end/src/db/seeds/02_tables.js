const tables = require("./02_tables.json");

exports.seed = function (knex) {
  return knex
    .raw("TRUNCATE TABLE tables RESTART IDENTITY CASCADE")
    .then(() => knex("tables").insert(tables));
};
