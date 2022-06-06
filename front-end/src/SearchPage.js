import React, { useState } from "react";
const { phoneValidate } = require("./utils/validationtest");
import { searchReservation } from "./utils/api";
import Reservation from "./Reservation";
import ErrorAlert from "./layout/ErrorAlert";

function SearchPage() {
  const [search, setSearch] = useState("");
  const [found, setFound] = useState([]);
  const [error, setError] = useState(null);
  const [submit, setSubmit] = useState(false);

  const handleChange = (event) => {
    let phoneNumber = phoneValidate(event.target.value, search);
    setSearch(phoneNumber);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const abortCon = new AbortController();
    searchReservation(search, abortCon.signal)
      .then(setFound)
      .then(setSubmit(true))
      .catch(setError);
    setSearch("");
  };

  return (
    <div>
      {error ? <ErrorAlert error={error} /> : null}
      <form name="search" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="mobile_number">Search</label>
          <input
            id="mobile_number"
            type="text"
            name="mobile_number"
            onChange={handleChange}
            value={search}
            pattern="([0-9]{3}-)?[0-9]{3}-[0-9]{4}"
            required
          />
          <br />
          <button type="submit">Search</button>
        </div>
      </form>
      {submit ? (
        found.length ? (
          <div>
            {found.map((reservation) =>
              reservation.status === "finished" ? null : (
                <Reservation
                  key={reservation.reservation_id}
                  reservation={reservation}
                />
              )
            )}
          </div>
        ) : (
          <div> No reservations found </div>
        )
      ) : null}
    </div>
  );
}

export default SearchPage;
