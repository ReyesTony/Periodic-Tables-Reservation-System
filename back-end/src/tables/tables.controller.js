const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.services");
const {
  tableValidate,
} = require("../../../front-end/src/utils/validationtest");

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

module.exports = {
  create: [asyncErrorBoundary(validate), asyncErrorBoundary(create)],
  list: asyncErrorBoundary(list),
};
