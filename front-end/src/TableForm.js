import React, { useState } from "react";
import { useHistory } from "react-router";
import ErrorAlert from "./layout/ErrorAlert";
import { createTable } from "./utils/api";
const { tableValidate } = require("./utils/validationtest");

//Form the add tables to the list 
function TableForm() {
  const history = useHistory();
  const [error, setError] = useState(null);
  const initialFormState = {
    table_name: "",
    capacity: 0,
  };
  const [formData, setFormData] = useState({ ...initialFormState });
  const handleChange = (event) => {
    const change = { ...formData };
    change[event.target.id] = event.target.value;
    change.capacity = Number(change.capacity);
    setFormData(change);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const abortCon = new AbortController();
    console.log(formData);
    setFormData({ ...initialFormState });
    if (tableValidate(formData, setError)) {
      createTable(formData, abortCon.signal)
        .then(() => history.push("/dashboard"))
        .catch((err) => {
          setError(err);
        });
    }
  };

  return (
    <div>
      {error ? <ErrorAlert error={error} /> : null}
      <h1>New Table Form</h1>
      <form name="table" onSubmit={handleSubmit}>
        <div className="form-floating mb-3">
          <label htmlFor="table_name">
            Table name
            <input
              id="table_name"
              className="form-control"
              type="text"
              placeholder="Name"
              name="table_name"
              onChange={handleChange}
              value={formData.table_name}
              minLength="2"
              required
            />
          </label>
          <br />
          <label htmlFor="capacity">
            Table capacity
            <input
              id="capacity"
              className="form-control"
              type="number"
              name="capacity"
              onChange={handleChange}
              value={formData.capacity}
              min="1"
              required
            />
          </label>
          <br />
          <button className="btn btn-primary mr-1" type="submit">
            Submit
          </button>
          <button
            className="btn btn-danger mr-1"
            type="button"
            onClick={() => history.goBack()}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default TableForm;
