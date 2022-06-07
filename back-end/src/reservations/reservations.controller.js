/**
 * List handler for reservation resources
 */
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");

async function list(req, res, next) {
  if (req.query.date) {
    const response = await service.list(req.query.date);
    return res.json({
      data: [...response],
    });
  } else if (req.query.mobile_number) {
    const response = await service.search(req.query.mobile_number);
    return res.json({
      data: [...response],
    });
  } else {
    const response = await service.list();
    return res.json({
      data: [...response],
    });
  }
}

async function validate(req, res, next) {
  const newRes = req.body.data;
  let message;
  function setError(err) {
    if (err) message = err.message;
  }
  if (!newRes) {
    return next({
      status: 400,
      message:
        " Invalid input given. Requires {string : [first_name, last_name, mobile_number], date:reservation_date, time:reservation_time, number:people} ",
    });
  }
  if (newRes.status && newRes.status != "booked") {
    return next({
      status: 400,
      message: " Invalid status, cannot be seated or finished ",
    });
  }
  if (!resValidator(newRes, setError) || typeof newRes.people != "number") {
    if (!message) {
      message = " people must be a number ";
    }
    return next({ status: 400, message });
  } else {
    return next();
  }
}

async function create(req, res, next) {
  const newRes = await service.create(req.body.data);
  res.status(201).json({ data: newRes });
}

async function read(req, res, next) {
  const reservation = await service.read(req.params.reservationId);
  if (!reservation) {
    return next({
      status: 404,
      message: "99",
    });
  }
  res.json({ data: reservation });
}

async function update(req, res, next) {
  const reservationId = Number(req.params.reservationId);
  const newStatus = req.body.data.status;
  const updatedRes = await service.update(reservationId, newStatus);
  res.status(200).json({ data: updatedRes });
}

async function updateValidation(req, res, next) {
  const reservation = await service.read(req.params.reservationId);
  const newStatus = req.body.data.status;

  const acceptedStatus = ["finished", "booked", "seated", "cancelled"];
  if (!reservation) {
    return next({
      status: 404,
      message: "99",
    });
  }
  if (reservation.status === "finished") {
    return next({
      status: 400,
      message: " Reservation is finished ",
    });
  }
  if (!acceptedStatus.includes(newStatus)) {
    return next({
      status: 400,
      message: " Given status is unknown ",
    });
  }
  return next();
}

async function updateReservation(req, res) {
  const reservationId = Number(req.params.reservationId);
  const reservation = req.body.data;

  const updated = await service.updateReservation(reservationId, reservation);
  res.status(200).json({ data: updated });
}

async function updateResValidation(req, res, next) {
  const test2 = {
    first_name: null,
    last_name: null,
    mobile_number: null,
    reservation_date: null,
    reservation_time: null,
    people: 0,
    status: "",
  };
  let temp = {};
  for (let key in req.body.data) {
    if (Object.keys(test2).includes(key)) {
      temp[key] = req.body.data[key];
    }
  }
  req.body.data = temp;
  const reservation = await service.read(req.params.reservationId);

  if (!reservation)
    return next({
      status: 404,
      message: ` ${req.params.reservationId} does not exist `,
    });
  next();
}

function asDateString(date) {
  return `${date.getFullYear().toString(10)}-${(date.getMonth() + 1)
    .toString(10)
    .padStart(2, "0")}-${date.getDate().toString(10).padStart(2, "0")}`;
}
function today() {
  return asDateString(new Date());
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

function resValidator(formData, setError) {
  setError(null);
  const template = {
    first_name: null,
    last_name: null,
    mobile_number: null,
    reservation_date: null,
    reservation_time: null,
    people: 0,
  };

  const template2 = {
    first_name: null,
    last_name: null,
    mobile_number: null,
    reservation_date: null,
    reservation_time: null,
    people: 0,
    status: null,
  };

  let message = "";

  if (!compareKeys(formData, template) && !compareKeys(formData, template2)) {
    message =
      " Invalid input given. Requires {string : [first_name, last_name, mobile_number], date:reservation_date, time:reservation_time, number:people} ";
    setError(new Error(message));
    return false;
  }
  if (!notNull(formData)) {
    message =
      " Invalid input given. Requires {string : [first_name, last_name, mobile_number], date:reservation_date, time:reservation_time, number:people} ";
    setError(new Error(message));
    return false;
  }
  if (/\d{4}-\d{2}-\d{2}/.test(formData.reservation_date) === false) {
    message += " reservation_date must be a date ";
  } else {
    if (checkTuesday(formData.reservation_date)) {
      message += " We are closed tuesdays ";
    }
    if (checkIfPast(formData.reservation_date)) {
      message += " Date must be in the future ";
    }
  }
  if (/[0-9]{2}:[0-9]{2}/.test(formData.reservation_time) === false) {
    message += " reservation_time must be a number ";
  } else {
    if (!checkIfOpen(formData.reservation_time)) {
      message +=
        " We are closed, open 1030 AM - 1030 PM reservations closing at 930 PM ";
    }
    if (!enoughTimeCheck(formData.reservation_time)) {
      message += " Reservation must be for the future ";
    }
  }
  if (message.length) {
    setError(new Error(message));
    return false;
  } else {
    return true;
  }
}

function checkTuesday(date) {
  const checkedDate = date.split("-");
  const newDate = new Date(
    Number(checkedDate[0]),
    Number(checkedDate[1]) - 1,
    Number(checkedDate[2])
  );
  return newDate.getDay() === 2;
}

function checkIfPast(date) {
  const checkedDate = date.split("-");
  const newDate = new Date(
    Number(checkedDate[0]),
    Number(checkedDate[1]) - 1,
    Number(checkedDate[2]) + 1
  );
  return newDate.getTime() < new Date().getTime();
}

function enoughTimeCheck(time, date) {
  if (date === today()) {
    const currentDay = new Date();
    const checkedTime = time.split(":");
    const hour = Number(checkedTime[0]);
    const min = Number(checkedTime[1]);
    if (currentDay.getHours() >= hour) {
      if (currentDay.getHours() === hour) {
        if (currentDay.getMinutes() < min) {
          return true;
        }
        return false;
      }
    }
  }
  return true;
}

function checkIfOpen(time) {
  const checkedTime = time.split(":");
  const hour = Number(checkedTime[0]);
  const min = Number(checkedTime[1]);
  if (hour >= 10) {
    if (hour === 10 && min < 30) {
      return false;
    }
    if (hour >= 21) {
      if (hour === 21 && min <= 30) {
        return true;
      }
      return false;
    }
    return true;
  }
  return false;
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [asyncErrorBoundary(validate), asyncErrorBoundary(create)],
  read: asyncErrorBoundary(read),
  update: [asyncErrorBoundary(updateValidation), asyncErrorBoundary(update)],
  updateReservation: [
    asyncErrorBoundary(updateResValidation),
    asyncErrorBoundary(validate),
    asyncErrorBoundary(updateReservation),
  ],
};
