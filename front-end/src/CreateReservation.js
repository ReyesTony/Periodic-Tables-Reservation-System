import ReservationForm from "./ReservationForm";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { createReservations } from "./utils/api";
const { phoneValidate, resValidator } = require("./utils/validationtest");

//Parent component to create a new reservation, passing down the needed states and functions to the ReservationForm component

function CreateReservations() {
  const history = useHistory();
  const [error, setError] = useState(null);
  //default state for a blank res form
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  };

  const [formData, setFormData] = useState({ ...initialFormState });

  //handles the input of data into the form, with specfic validation if its a phone number to make sure it matches the xxx-xxx-xxxx format
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
  //handles the submit event, with it validating the form to make sure it meets all reqs for a reservation then creates it if it passes.

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
