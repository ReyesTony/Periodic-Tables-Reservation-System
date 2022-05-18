import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import { listTables } from "./utils/api";

export default function SeatingPage() {
  const history = useHistory();
  const [tables, setTables] = useState([]);
  const { params } = useRouteMatch();
  const { reservation_id } = params;
  useEffect(() => listTables().then(setTables), []);
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
  //handlesubmit todo
  //add requried validation
  //add assignReservation api function
  //backend, update table and reservation
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
    window.alert(formData.table_id);
  };

  return (
    <div>
      <h1>Assign Seating</h1>
      <form name="seat_form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="table_id">Table Name</label>
          <select
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
        <button type="submit">submit</button>
        <button type="button" onClick={() => history.goBack()}>
          Cancel
        </button>
      </form>
    </div>
  );
}
