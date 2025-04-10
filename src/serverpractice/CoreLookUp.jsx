import React, { useEffect, useState } from "react";
import axios from "axios";
import "../serverpractice/corelookup.css";

const CoreLookupTable = () => {
  const [search, setSearch] = useState("");
  const [lookupValues, setLookupValues] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchData = () => {
    axios
      .get("http://localhost:9922/api/lookup-values", {
        params: {
          search: search,
          page: page,
          size: 10,
        },
      })
      .then((res) => {
        setLookupValues(res.data.content);
        setTotalPages(res.data.totalPages);
      });
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleSearch = () => {
    setPage(0);
    fetchData();
  };

  return (
    <div className="lookup-container">
      <h2 className="title">Search Lookup Type</h2>

      <div className="search-box">
        <input
          type="text"
          placeholder="Lookup Type"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>

      <div className="table-wrapper">
        <table className="lookup-table">
          <thead>
            <tr>
              <th>Lookup Type</th>
              <th>Lookup Code</th>
              <th>Meaning</th>
              <th>Description</th>
              <th>Editable</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            {lookupValues.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">
                  No data found.
                </td>
              </tr>
            ) : (
              lookupValues.map((val, index) => (
                <tr key={index}>
                  <td>{val.lookupType}</td>
                  <td>{val.lookupCode}</td>
                  <td>{val.meaning}</td>
                  <td>{val.description}</td>
                  <td>{val.editableFlag === "Y" ? "✔" : "❌"}</td>
                  <td>{val.lookupTypePurpose}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`page-btn ${i === page ? "active" : ""}`}
            onClick={() => setPage(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CoreLookupTable;