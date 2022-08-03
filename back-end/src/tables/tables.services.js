//Service page to allow knex to connect and communicate with the postgreSQL database for the table data

const knex = require("../db/connection");
const table = "tables";

function list() {
  return knex(table).select("*").orderBy("table_name", "asc");
}

function create(data) {
  return knex(table)
    .insert(data, "*")
    .then((created) => created[0]);
}

function update(table_id, reservation_id) {
  return knex(table)
    .where({ table_id })
    .update("reservation_id", reservation_id)
    .returning("*")
    .then((created) => created[0]);
}
function read(table_id) {
  return knex(table)
    .where({ table_id })
    .returning("*")
    .then((created) => created[0]);
}

module.exports = {
  list,
  create,
  update,
  read,
};
