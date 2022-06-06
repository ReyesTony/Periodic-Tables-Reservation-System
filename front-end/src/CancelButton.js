import { listReservations, assignStatus } from "./utils/api";

export default function CancelButton({ reservation, setReservations, date }) {
  function cancelReservation() {
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      const abortController = new AbortController();
      assignStatus(reservation.reservation_id, "cancelled")
        .then(listReservations({ date }, abortController.signal))
        .then(setReservations)
        .catch((err) => {});
    }
  }
  return (
    <button
      onClick={cancelReservation}
      data-reservation-id-cancel={reservation.reservation_id}
    >
      Cancel
    </button>
  );
}
