const knex = require("../db/connection");
const table = "reservations";

async function list(date) {
  if (date) {
    return knex(table)
      .select("*")
      .where({ "reservations.reservation_date": date })
      .whereNot({ status: "finished" })
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

function read(id) {
  return knex(table)
    .where({ "reservations.reservation_id": id })
    .returning("*")
    .then((created) => created[0]);
}

function update(id, status) {
  return knex(table)
    .where({ reservation_id: id })
    .update("status", status)
    .returning("*")
    .then((created) => created[0]);
}

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

module.exports = {
  list,
  create,
  read,
  update,
  search,
};
