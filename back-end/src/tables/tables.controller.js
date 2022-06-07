const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.services");

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
      message: " Invalid input given, requires a name and capacity ",
    });
  }
  if (
    !tableValidate(newTable, setError) ||
    typeof newTable.capacity != "number"
  ) {
    if (!message) {
      message = " capacity must be a number ";
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
  await resService.update(reservation_id, "seated");
  res.status(200).json({ data: updatedTable });
}

async function updateValidation(req, res, next) {
  if (!req.body.data || !req.body.data.reservation_id) {
    return next({
      status: 400,
      message: " Invalid format, requires reservation_id ",
    });
  }
  const reservation = await resService.read(req.body.data.reservation_id);
  const table = await service.read(Number(req.params.table_id));
  if (!reservation) {
    return next({
      status: 404,
      message: " 999 ",
    });
  }
  if (reservation.status === "seated") {
    return next({
      status: 400,
      message: " reservation was seated ",
    });
  }
  if (table.capacity < reservation.people) {
    return next({
      status: 400,
      message: " Table capacity not enough for party ",
    });
  }
  if (table.reservation_id) {
    return next({
      status: 400,
      message: " Table is already occupied ",
    });
  }
  next();
}

async function finishValidator(req, res, next) {
  const table = await service.read(Number(req.params.table_id));
  if (!table) {
    return next({
      status: 404,
      message: ` Table ${req.params.table_id} doesn't exist `,
    });
  }
  if (!table.reservation_id) {
    return next({
      status: 400,
      message: " Table is not occupied ",
    });
  }
  next();
}

async function finished(req, res, next) {
  const tableId = Number(req.params.table_id);
  const table = await service.read(tableId);
  const updated = await service.update(tableId, null);
  await resService.update(table.reservation_id, "finished");
  res.status(200).json({ data: updated });
}

function tableValidate(formData, setError) {
  setError(null);
  const template = {
    table_name: null,
    capacity: 0,
  };
  const template2 = {
    table_name: null,
    capacity: 0,
    reservation_id: null,
  };
  let reserveIdTemp = { ...formData, reservation_id: 1 };
  let message = "";

  if (!compareKeys(formData, template) && !compareKeys(formData, template2)) {
    message = " Invalid input given, requires a table_name and capacity ";
    setError(new Error(message));
    return false;
  }
  if (!notNull(reserveIdTemp)) {
    message = " Invalid input given, requires a table_name and capacity ";
    setError(new Error(message));
    return false;
  }
  if (formData.table_name.length < 2) {
    message = " table_name needs at least 2 characters ";
    setError(new Error(message));
    return false;
  }
  if (formData.capacity <= 0) {
    message = " Table capacity needs to be a min of 1 ";
    setError(new Error(message));
    return false;
  }
  if (message.length) {
    setError(new Error(message));
    return false;
  } else {
    return true;
  }
}
function compareKeys(a, b) {
  const aKeys = Object.keys(a).sort();
  const bKeys = Object.keys(b).sort();
  return JSON.stringify(aKeys) === JSON.stringify(bKeys);
}

function notNull(object) {
  for (let key in object) {
    if (!object[key]) return false;
  }
  return true;
}
module.exports = {
  create: [asyncErrorBoundary(validate), asyncErrorBoundary(create)],
  list: asyncErrorBoundary(list),
  update: [asyncErrorBoundary(updateValidation), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(finishValidator), asyncErrorBoundary(finished)],
};
