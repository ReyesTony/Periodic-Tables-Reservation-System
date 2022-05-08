import { useState } from "react";
import { useHistory } from "react-router";

function ReservationForm() {
  const history = useHistory();
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  };

  const [formData, setFormData] = useState({ ...initialFormState });
  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
    setFormData({ ...initialFormState });
  };

  return (
    <form onSubmit={handleSubmit}>
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
          type="tel"
          name="mobile_number"
          onChange={handleChange}
          value={formData.mobile_number}
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
          required
        />
      </label>
      <br />
      <button type="submit"> Submit </button>
      <button type="button" onClick={() => history.goBack()}>
        Cancel
      </button>
    </form>
  );
}

export default ReservationForm;
