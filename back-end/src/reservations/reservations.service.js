const knex = require("../db/connection");

async function list(){
    return knex("reservations").select("*")
}

module.exports = {
    list, 
}