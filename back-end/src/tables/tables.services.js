const knex = require("../db/connection");
const table = "tables";

async function list() {
  return knex(table).select("*").orderBy("table_name", "asc");
}

async function create(data) {
  return knex(table)
    .insert(data, "*")
    .then((created) => created[0]);
}

async function update(table_id, reservation_id) {
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
