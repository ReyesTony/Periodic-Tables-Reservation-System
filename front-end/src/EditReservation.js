import ReservationForm from "./ReservationForm";
import React, { useState, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router";
import { getReservation, updateReservation } from "./utils/api";
const { phoneValidate, resValidator } = require("./utils/validationtest");
//starts the same as createreservion, setting state and handler functions
function EditReservation() {
  const history = useHistory();
  const { params } = useRouteMatch();
  const [error, setError] = useState(null);
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
  };

  //Here it calls on the API to get the data on the reservation based on the URL params then sets the exisiting data state to that
  //while allowing any errors to be caught before affecting the actual form. 
  useEffect(() => {
    const abortController = new AbortController();
    getReservation(params.reservation_id, abortController.signal)
      .then(setExistingData)
      .catch(setError);
  }, [params.reservation_id]);

  // This sets the state of the actual form data to the exisiting data that was gathered in the previous useEffect
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
      <ReservationForm
        formData={formData}
        error={error}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        type={"edit"}
      />
    </div>
  );
}

export default EditReservation;
