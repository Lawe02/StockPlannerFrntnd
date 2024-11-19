import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchStocks } from "../Api/apis"; // Import fetchStocks

const StockList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query
  const [page, setPage] = useState<number>(1); // Pagination state

  const {
    data: stocks = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["stocks", searchQuery, page],
    queryFn: () => fetchStocks(searchQuery, page),
    enabled: !!searchQuery, // Only fetch if there's a search query
  });

  const inputOnChange = (input: HTMLInputElement) => {
    setSearchQuery(input.value);
    setPage(1);
  };

  return (
    <div>
      <h1>Stock List</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search stocks..."
        value={searchQuery}
        onChange={(e) => inputOnChange(e.target)}
        style={{
          padding: "8px",
          margin: "10px 0",
          width: "300px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />

      {/* Pagination Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        <button
          style={{
            padding: "8px 12px",
            marginRight: "10px",
            backgroundColor: page > 1 ? "#007bff" : "#d6d6d6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: page > 1 ? "pointer" : "not-allowed",
          }}
          disabled={page <= 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          &#8592; Previous
        </button>
        <span>Page {page}</span>
        <button
          style={{
            padding: "8px 12px",
            marginLeft: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next &#8594;
        </button>
      </div>

      {/* Stock Table */}
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p style={{ color: "red" }}>
          Failed to fetch stocks. Please try again.
        </p>
      ) : stocks.length > 0 ? (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Symbol
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Name</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr key={stock.symbol}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {stock.symbol}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {stock.name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default StockList;
