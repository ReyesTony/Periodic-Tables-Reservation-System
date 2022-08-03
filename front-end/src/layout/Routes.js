import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import TableForm from "../TableForm";
import SeatingPage from "../SeatingPage";
import SearchPage from "../SearchPage";
import CreateReservations from "../CreateReservation";
import EditReservation from "../EditReservation";

/**
 * Defines all the routes for the application.
 *
 * 
 * @returns {JSX.Element}
 */

function Routes() {
  const query = useQuery();
  const date = query.get("date");
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/reservations/new">
        <CreateReservations />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={date ? date : today()} />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/edit">
        <EditReservation />
      </Route>
      <Route path="/tables/new">
        <TableForm />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <SeatingPage />
      </Route>
      <Route path="/search">
        <SearchPage />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
