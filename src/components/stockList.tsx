import React, { useState, useCallback } from "react";
import { debounce } from "../utils/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchStocks, StockResponseDto } from "../Api/apis";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth0 } from "@auth0/auth0-react";

interface StockListProps {
  onAddStock: (symbol: string) => void; // Callback to add a stock to the plan
}

const StockList: React.FC<StockListProps> = ({ onAddStock }) => {
  const { getAccessTokenSilently } = useAuth0();
  const [inputValue, setInputValue] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query
  const [page, setPage] = useState<number>(1); // Pagination state

  const {
    data: stocks = [],
    isLoading,
    isError,
  } = useQuery<StockResponseDto[]>({
    queryKey: ["stocks", searchQuery, page],
    queryFn: () => fetchStocks(searchQuery, page, getAccessTokenSilently()),
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
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Stock List</h1>

      {/* Search Bar */}
      <Input
        type="text"
        placeholder="Search stocks..."
        value={inputValue}
        onChange={inputOnChange}
        className="w-full sm:w-80"
      />

      {/* Stock Table */}
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p className="text-red-500">
          Failed to fetch stocks. Please try again.
        </p>
      ) : stocks.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stocks.map((stock) => (
              <TableRow key={stock.symbol}>
                <TableCell>{stock.symbol}</TableCell>
                <TableCell>{stock.name}</TableCell>
                <TableCell>
                  <Button size="sm" onClick={() => onAddStock(stock.symbol)}>
                    Add
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No results found.</p>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center items-center space-x-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page <= 1}
        >
          &#8592; Previous
        </Button>
        <span>Page {page}</span>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next &#8594;
        </Button>
      </div>
    </div>
  );
};

export default StockList;
