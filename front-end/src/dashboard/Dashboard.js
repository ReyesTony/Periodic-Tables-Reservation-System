import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import { useHistory } from "react-router";
import Reservation from "../Reservation";
import Table from "../Tables";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const query = useQuery();
  const queryDate = query.get("date");
  const history = useHistory();

  //if no date is given loads up the current date by default
  useEffect(() => {
    if (!queryDate) history.push(`/dashboard?date=${date}`);
  }, [query, history, queryDate, date]);

  /**loads all information needed for the dashboard,
   * Current day reservations
   * tables and their status. Name, seating capacity, booked status    * 
   * */
  useEffect(loadDashboard, [date, history, queryDate]);

  //seperating the tables dependency to update reservations from loadDashboard function to avoid infinite loop, while
  //maintaining functionallty of loading dashboard again when date changes, to load both tables and reservations
  useEffect(() => {
    const abortController = new AbortController();
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
  }, [tables, date]);

  function loadDashboard() {
    if (queryDate !== date) {
      history.push(`/dashboard?date=${date}`);
    }
    const abortController = new AbortController();
    const abortCon = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortCon.signal).then(setTables);
    return () => abortController.abort();
  }

  //function attached to date changer buttons to correctly format given date to match required format by the API.
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
      {reservations.map((reservation) =>
        reservation.status === "finished" ||
        reservation.status === "cancelled" ? null : (
          <Reservation
            key={reservation.reservation_id}
            reservation={reservation}
            setReservations={setReservations}
            date={date}
          />
        )
      )}
      <div className="m2-3">
        <button
          onClick={() => {
            dateChanger(-1);
          }}
          className="btn btn-primary mr-2"
        >
          Previous day
        </button>
        <button
          onClick={() => {
            history.push("/dashboard");
          }}
          className="btn btn-primary mr-2"
        >
          Today
        </button>

        <button
          onClick={() => {
            dateChanger(1);
          }}
          className="btn btn-primary mr-2"
        >
          Next day
        </button>
      </div>
      <br />
      {tables.map((table) => (
        <Table key={table.table_id} table={table} setTables={setTables} />
      ))}
    </main>
  );
}

export default Dashboard;
