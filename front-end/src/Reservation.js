export default function Reservation({ reservation, setReservations, date }) {
  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title">
          Reservation for {`${reservation.first_name} ${reservation.last_name}`}
        </h4>
        <p className="card-text">Phone Number: {reservation.mobile_number}</p>
        <p className="card-text">Time: {reservation.reservation_time}</p>
        <p className="card-text">Party Size: {reservation.people}</p>
        <a href={`/reservations/${reservation.reservation_id}/seat`}>Seat</a>
      </div>
    </div>
  );
}
