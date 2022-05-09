import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import { useHistory } from "react-router";
import Reservation from "../Reservation";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const query = useQuery();
  const queryDate = query.get("date");
  const history = useHistory();

  useEffect(() => {
    if (!queryDate) history.push(`/dashboard?date=${date}`);
  }, [query, history, queryDate, date]);

  useEffect(loadDashboard, [date, history, queryDate]);

  function loadDashboard() {
    if (queryDate !== date) {
      history.push(`/dashboard?date=${date}`);
    }
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function dateChanger(change) {
    const temp = date.split("-");
    const newDate = new Date(
      Number(temp[0]),
      Number(temp[1]) - 1,
      Number(temp[2]) + change
    )
      .toISOString()
      .split("T")[0];
    history.push(`/dashboard?date=${newDate}`);
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      {reservations.map((reservation) => (
        <Reservation
          reservation={reservation}
          setReservations={setReservations}
          date={date}
        />
      ))}
      <div className="m2-3">
        <button
          onClick={() => {
            dateChanger(1);
          }}
          className="btn btn-primary"
        >
          Next day
        </button>
        <button
          onClick={() => {
            history.push("/dashboard");
          }}
          className="btn btn-primary"
        >
          Today
        </button>
        <button
          onClick={() => {
            dateChanger(-1);
          }}
          className="btn btn-primary"
        >
          Previous day
        </button>
      </div>
    </main>
  );
}

export default Dashboard;
