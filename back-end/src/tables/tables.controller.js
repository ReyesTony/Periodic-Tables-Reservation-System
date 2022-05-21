const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.services");
const {
  tableValidate,
} = require("../../../front-end/src/utils/validationtest");
const resService = require("../reservations/reservations.service");
const knex = require("../db/connection");

async function list(req, res) {
  const response = await service.list();
  res.json({
    data: [...response],
  });
}

async function validate(req, res, next) {
  const newTable = req.body.data;
  let message;
  function setError(err) {
    if (err) message = err.message;
  }

  if (!newTable) {
    return next({
      status: 400,
      message: "Invalid input given, requires a name and capacity",
    });
  }
  if (
    !tableValidate(newTable, setError) ||
    typeof newTable.capacity != "number"
  ) {
    if (!message) {
      message = "capacity must be a number";
    }
    return next({ status: 400, message });
  } else {
    return next();
  }
}

async function create(req, res, next) {
  const newTable = await service.create(req.body.data);
  res.status(201).json({ data: newTable });
}

async function update(req, res, next) {
  const table_id = Number(req.params.table_id);
  const reservation_id = Number(req.body.data.reservation_id);
  const updatedTable = await service.update(table_id, reservation_id);
  res.status(200).json({ data: updatedTable });
}

async function updateValidation(req, res, next) {
  if (!req.body.data || !req.body.data.reservation_id) {
    return next({
      status: 400,
      message: "Invalid format, requires reservation_id",
    });
  }
  const reservation = await resService.read(req.body.data.reservation_id);
  const table = await service.read(Number(req.params.table_id));
  if (!reservation) {
    return next({
      status: 404,
      message: "999",
    });
  }
  if (reservation.status === "seated"){
    return next({
      status : 400,
      message : "reservation was seated"
    })
  }
  if (table.capacity < reservation.people) {
    return next({
      status: 400,
      message: "Table capacity not enough for party",
    });
  }
  if (table.reservation_id) {
    return next({
      status: 400,
      message: "Table is already occupied",
    });
  }
  next();
}

module.exports = {
  create: [asyncErrorBoundary(validate), asyncErrorBoundary(create)],
  list: asyncErrorBoundary(list),
  update: [asyncErrorBoundary(updateValidation), asyncErrorBoundary(update)],
};
