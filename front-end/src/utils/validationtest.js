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
    if (checkTuesday(formData.reservation_date)){
      message += "We are closed tuesdays"
    }
    if (checkIfPast(formData.reservation_date)){
      message += "Date must be in the future"
    }
  }
  if (/[0-9]{2}:[0-9]{2}/.test(formData.reservation_time) === false) {
    message += "reservation_time must be a number";
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

module.exports = {
  resValidator,
  phoneValidate,
};
