import React, { useState, useCallback } from "react";
import { debounce } from "../utils/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchStocks, StockResponseDto } from "../Api/apis";

interface StockListProps {
  onAddStock: (symbol: string) => void; // Callback to add a stock to the plan
}

const StockList: React.FC<StockListProps> = ({ onAddStock }) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query
  const [page, setPage] = useState<number>(1); // Pagination state

  const {
    data: stocks = [],
    isLoading,
    isError,
  } = useQuery<StockResponseDto[]>({
    queryKey: ["stocks", searchQuery, page],
    queryFn: () => fetchStocks(searchQuery, page),
    enabled: !!searchQuery, // Only fetch if there's a search query
  });

  const updateSearchQuery = useCallback(
    debounce((value: string) => {
      setSearchQuery(value);
      setPage(1);
    }, 500),
    []
  );

  const inputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    updateSearchQuery(value);
  };

  return (
    <div>
      <h1>Stock List</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search stocks..."
        value={inputValue}
        onChange={inputOnChange}
        style={{
          padding: "8px",
          margin: "10px 0",
          width: "300px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />

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
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Actions
              </th>
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
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <button
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => onAddStock(stock.symbol)}
                  >
                    Add
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No results found.</p>
      )}

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
    </div>
  );
};

export default StockList;
