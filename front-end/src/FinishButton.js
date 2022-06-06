import { finishTable, listTables } from "./utils/api";
export default function FinishButton({ tableId, setTables }) {
  const clickHandler = (event) => {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      const abortCon = new AbortController();
      finishTable(tableId, abortCon.signal)
        .then(() => listTables().then(setTables))
        .catch(listTables().then(setTables));
    }
  };
  return (
    <button className="btn btn-danger" onClick={clickHandler} data-table-id-finish={tableId}>
      Finish
    </button>
  );
}
