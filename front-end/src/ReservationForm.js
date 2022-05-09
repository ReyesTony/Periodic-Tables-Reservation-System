import React, { useState } from "react";
import { useHistory } from "react-router";
import { createReservations } from "./utils/api";
import ErrorAlert from "./layout/ErrorAlert";
import { phoneValidate, resValidator } from "./utils/validationtest";

function ReservationForm() {
  const history = useHistory();
  const [error, setError] = useState(null);
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  };

  const [formData, setFormData] = useState({ ...initialFormState });
  const handleChange = (event) => {
    const change = { ...formData };
    if (event.target.id === "mobile_number") {
      let phoneNumber = event.target.value;
      phoneNumber = phoneValidate(phoneNumber, formData.mobile_number);
      event.target.value = phoneNumber;
    }

    change[event.target.id] = event.target.value;
    change.people = Number(change.people);
    setFormData(change);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const abortCon = new AbortController();
    setFormData({ ...initialFormState });
    if (resValidator(formData, setError)) {
      createReservations(formData, abortCon.signal)
        .then(() =>
          history.push(`/dashboard?date=${formData.reservation_date}`)
        )
        .catch((err) => {
          setError(err);
        });
    }
  };

  return (
    <div>
      {error ? <ErrorAlert error={error} /> : null}
      New reservation Form
      <form name="reservation" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="first_name">
            First name
            <input
              id="first_name"
              type="text"
              name="first_name"
              onChange={handleChange}
              value={formData.first_name}
              required
            />
          </label>
          <br />
          <label htmlFor="last_name">
            Last name
            <input
              id="last_name"
              type="text"
              name="last_name"
              onChange={handleChange}
              value={formData.last_name}
              required
            />
          </label>
          <br />
          <lable htmlFor="mobile_number">
            Mobile Number
            <input
              id="mobile_number"
              type="text"
              name="mobile_number"
              onChange={handleChange}
              value={formData.mobile_number}
              pattern="([0-9]{3}-)?[0-9]{3}-[0-9]{4}"
              required
            />
            <br />
          </lable>
          <lable htmlFor="reservation_date">
            Date
            <input
              id="reservation_date"
              type="date"
              name="reservation_date"
              onChange={handleChange}
              value={formData.reservation_date}
              pattern="\d{4}-\d{2}-\d{2}"
              required
            />
            <br />
          </lable>
          <lable htmlFor="reservation_time">
            Time of Reserve
            <input
              id="reservation_time"
              type="time"
              name="reservation_time"
              onChange={handleChange}
              value={formData.reservation_time}
              pattern="[0-9]{2}:[0-9]{2}"
              required
            />
            <br />
          </lable>
          <label htmlFor="people">
            Party Size
            <input
              id="people"
              type="number"
              name="people"
              onChange={handleChange}
              value={formData.people}
              min="1"
              required
            />
          </label>
          <br />
          <button type="submit"> Submit </button>
          <button type="button" onClick={() => history.goBack()}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
