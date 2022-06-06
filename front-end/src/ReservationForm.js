import React, { useState, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router";
import {
  createReservations,
  getReservation,
  updateReservation,
} from "./utils/api";
import ErrorAlert from "./layout/ErrorAlert";
const { phoneValidate, resValidator } = require("./utils/validationtest");

function ReservationForm() {
  const history = useHistory();
  const { params, url } = useRouteMatch();
  const [error, setError] = useState(null);
  const [type, setType] = useState("new");
  const [existingData, setExistingData] = useState({});
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
    if (type === "new") {
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
    } else {
      if (existingData.status === "booked") {
        if (resValidator(formData, setError)) {
          updateReservation(formData, abortCon.signal, params.reservation_id)
            .then(() =>
              history.push(`/dashboard?date=${formData.reservation_date}`)
            )
            .catch((err) => {
              setError(err);
            });
        }
      }
    }
  };

  useEffect(() => {
    Object.keys(params).length ? setType("edit") : setType("new");
  }, [history, params, url]);

  useEffect(() => {
    if (type === "edit") {
      const abortController = new AbortController();
      getReservation(params.reservation_id, abortController.signal)
        .then(setExistingData)
        .catch(setError);
    } else {
      setExistingData({
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 1,
      });
    }
  }, [type, params.reservation_id]);

  useEffect(() => {
    if (Object.keys(existingData).length) {
      setFormData({
        first_name: existingData.first_name,
        last_name: existingData.last_name,
        mobile_number: existingData.mobile_number,
        reservation_date: existingData.reservation_date,
        reservation_time: existingData.reservation_time,
        people: existingData.people,
      });
    }
  }, [existingData]);

  return (
    <div>
      {error ? <ErrorAlert error={error} /> : null}
      {type === "edit" ? (
        <h2>Edit Reservation Form </h2>
      ) : (
        <h2>New Reservation Form</h2>
      )}{" "}
      <form name="reservation" onSubmit={handleSubmit}>
        <div className="form-floating mb-3">
          <label htmlFor="first_name">
            First Name
            <input
              className="form-control"
              id="first_name"
              type="text"
              name="first_name"
              onChange={handleChange}
              value={formData.first_name}
              placeholder="First Name"
              required
            />
          </label>
        </div>
        <div className="form-floating mb-3">
          <label htmlFor="last_name">
            Last Name
            <input
              className="form-control"
              placeholder="Last Name"
              id="last_name"
              type="text"
              name="last_name"
              onChange={handleChange}
              value={formData.last_name}
              required
            />
          </label>
        </div>
        <div className="form-floating mb-3">
          <label htmlFor="mobile_number">
            Mobile Number
            <input
              className="form-control"
              id="mobile_number"
              type="text"
              name="mobile_number"
              placeholder="xxx-xxx-xxxx"
              onChange={handleChange}
              value={formData.mobile_number}
              pattern="([0-9]{3}-)?[0-9]{3}-[0-9]{4}"
              required
            />
          </label>
        </div>

        <div className="form-floating mb-3">
          <label htmlFor="date">
            Date
            <input
              className="form-control"
              placeholder="Date"
              id="reservation_date"
              type="date"
              name="reservation_date"
              onChange={handleChange}
              value={formData.reservation_date}
              pattern="\d{4}-\d{2}-\d{2}"
              required
            />
          </label>
        </div>

        <div className="form-floating mb-3">
          <label htmlFor="Time">
            {" "}
            Time
            <input
              className="form-control"
              placeholder="Time"
              id="reservation_time"
              type="time"
              name="reservation_time"
              onChange={handleChange}
              value={formData.reservation_time}
              pattern="[0-9]{2}:[0-9]{2}"
              required
            />
          </label>
        </div>
        <div className="form-floating mb-3">
          <label htmlFor="people">
            People
            <input
              className="form-control"
              id="people"
              type="number"
              name="people"
              onChange={handleChange}
              value={formData.people}
              min="1"
              required
            />
          </label>
        </div>
        <button className="btn btn-primary mr-1" type="submit">
          {" "}
          Submit{" "}
        </button>
        <button
          className="btn btn-danger mr-1"
          type="button"
          onClick={() => history.goBack()}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default ReservationForm;
