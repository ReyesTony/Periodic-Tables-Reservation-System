import React from "react";
import { useHistory } from "react-router";

import ErrorAlert from "./layout/ErrorAlert";

function ReservationForm({
  formData,
  error,
  handleSubmit,
  handleChange,
  type,
}) {
  const history = useHistory();

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
