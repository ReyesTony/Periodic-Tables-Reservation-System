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

module.exports = {
  list,
  create,
};
