import ReservationForm from "./ReservationForm";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { createReservations } from "./utils/api";
const { phoneValidate, resValidator } = require("./utils/validationtest");

function CreateReservations() {
  const history = useHistory();
  const [error, setError] = useState(null);
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
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
      <ReservationForm
        formData={formData}
        error={error}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        type={"new"}
      />
    </div>
  );
}

export default CreateReservations;
