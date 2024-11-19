import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface StockResponseDto {
  symbol: string;
  name: string;
}

// Fetcher function
const fetchStocks = async (name: string): Promise<StockResponseDto[]> => {
  const response = await axios.get<StockResponseDto[]>("/search", {
    params: { name, page: 1 }, // Page is hardcoded to 1 for simplicity
  });
  return response.data;
};

const StockList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const {
    data: stocks = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["stocks", searchQuery],
    queryFn: () => fetchStocks(searchQuery),
    enabled: !!searchQuery, // Only fetch if there's a search query
  });

  return (
    <div>
      <h1>Stock List</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search stocks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
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
