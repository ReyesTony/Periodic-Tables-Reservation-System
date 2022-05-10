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

  let message = "";

  if (!compareKeys(formData, template) || !notNull(formData)) {
    message =
      "Invalid input given. Requires {string : [first_name, last_name, mobile_number], date:reservation_date, time:reservation_time, number:people}";
    setError(new Error(message));
    return false;
  }
  if (/\d{4}-\d{2}-\d{2}/.test(formData.reservation_date) === false) {
    message += "reservation_date must be a date";
  } else {
    if (checkTuesday(formData.reservation_date)) {
      message += "We are closed tuesdays";
    }
    if (checkIfPast(formData.reservation_date)) {
      message += "Date must be in the future";
    }
  }
  if (/[0-9]{2}:[0-9]{2}/.test(formData.reservation_time) === false) {
    message += "reservation_time must be a number";
  } else {
    if (!checkIfOpen(formData.reservation_time)) {
      message +=
        "We are closed, open 1030 AM - 1030 PM reservations closing at 930 PM";
    }
    if (!enoughTimeCheck(formData.reservation_time)) {
      message += "Reservation must be for the future";
    }
  }
  if (message.length) {
    setError(new Error(message));
    return false;
  } else {
    return true;
  }
}
function phoneValidate(phoneNumber, currentLength) {
  if (phoneNumber[phoneNumber.length - 1] === "-") {
    phoneNumber = phoneNumber.slice(0, phoneNumber.length - 1);
  }
  if (phoneNumber.length === 3) {
    if (currentLength < phoneNumber.length) {
      phoneNumber += "-";
    }
  }

  if (phoneNumber.length >= 9) {
    if (!phoneNumber.includes("-")) {
      const temp1 = phoneNumber.substr(0, 3);
      const temp2 = phoneNumber.substr(3, 3);
      const temp3 = phoneNumber.substr(6, 4);
      phoneNumber = `${temp1}-${temp2}-${temp3}`;
    } else if (phoneNumber[7] !== "-") {
      const temp1 = phoneNumber.substr(0, 3);
      const temp2 = phoneNumber.substr(4, 3);
      const temp3 = phoneNumber.substr(7, 4);
      phoneNumber = `${temp1}-${temp2}-${temp3}`;
    }
  }
  if (phoneNumber.length > 12) {
    phoneNumber = phoneNumber.slice(0, 12);
  }
  return phoneNumber;
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
      if (currentDay.getHours() == hour) {
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
  resValidator,
  phoneValidate,
};
