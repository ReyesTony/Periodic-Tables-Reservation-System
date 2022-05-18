export default function Table({ table }) {
  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title">Table {table.table_name}</h4>
        <p className="card-text">Capacity {table.capacity}</p>
        <p className="card-text" data-table-id-status={table.table_id}>
          Free/Occupied placeholder
        </p>
      </div>
    </div>
  );
}
