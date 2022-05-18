const knex = require("../db/connection");
const table = "reservations";

async function list(date) {
  if (date) {
    return knex(table)
      .select("*")
      .where({ "reservations.reservation_date": date })
      .orderBy("reservation_time", "asc");
  } else {
    return knex(table).select("*");
  }
}

async function create(data) {
  return knex(table)
    .insert(data, "*")
    .then((created) => created[0]);
}

module.exports = {
  list,
  create,
};
