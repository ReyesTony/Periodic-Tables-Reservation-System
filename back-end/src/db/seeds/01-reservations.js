const reservations = require("./01_reservations.json");

exports.seed = function (knex) {
  return knex
    .raw("TRUNCATE TABLE reservations RESTART IDENTITY CASCADE")
    .then(() => knex("reservations").insert(reservations));
};
