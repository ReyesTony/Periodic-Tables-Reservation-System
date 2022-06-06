import FinishButton from "./FinishButton";

export default function Table({ table, setTables }) {
  return (
    <div  className="card">
      <div className="card-body">
        <h4 className="card-title">Table {table.table_name}</h4>
        <p className="card-text">Capacity {table.capacity}</p>
        <p className="card-text" data-table-id-status={table.table_id}>
          {table.reservation_id ? "Occupied" : "Free"}
        </p>

        {table.reservation_id ? (
          <FinishButton tableId={table.table_id} setTables={setTables} /> ) : null
        }
      </div>
    </div>
  );
}
