import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import { assignReservation, getReservation, listTables } from "./utils/api";
import ErrorAlert from "./layout/ErrorAlert";

const { updateValidator } = require("./utils/validationtest");

export default function SeatingPage() {
  const history = useHistory();
  const [error, setError] = useState(null);
  const [tables, setTables] = useState([]);
  const [reservation, setReservation] = useState({});
  const { params } = useRouteMatch();
  const { reservation_id } = params;

  const [formData, setFormData] = useState({
    table_name: "",
    capactiy: null,
    table_id: null,
  });

  const handleChange = (event) => {
    const change = event.target.value;
    const changeArray = change.split(",");
    setFormData({
      table_name: changeArray[0],
      capacity: changeArray[1],
      table_id: changeArray[2],
    });
  };

  useEffect(
    () =>
      listTables()
        .then(setTables)
        .then(getReservation(reservation_id).then(setReservation)),
    [reservation_id]
  );

  
  const handleSubmit = (event) => {
    event.preventDefault();
    const abortCon = new AbortController();
    if (updateValidator(formData, reservation, setError)) {
      assignReservation(formData.table_id, reservation_id, abortCon.signal)
        .then(() => history.push("/dashboard"))
        .catch((err) => setError(err));
    }
  };

  return (
    <div>
      {error ? <ErrorAlert error={error} /> : null}
      <h1>Assign Seating</h1>
      <form name="seat_form" onSubmit={handleSubmit}>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <label className="input-group-text" htmlFor="table_id">
              Table Name
            </label>
          </div>
          <select
            className="custom-select"
            id="table_id"
            type="text"
            name="table_id"
            onChange={handleChange}
            required
          >
            <option value={[null, null]}>Select Table</option>
            {tables.map((table) => {
              return (
                <option
                  key={table.table_id}
                  value={[table.table_name, table.capacity, table.table_id]}
                >
                  {table.table_name} - {table.capacity}
                </option>
              );
            })}
          </select>
        </div>
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
      </form>
    </div>
  );
}
