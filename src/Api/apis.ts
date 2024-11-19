// Define the StockResponseDto interface
export interface StockResponseDto {
  symbol: string;
  name: string;
}

export const fetchStocks = async (
  query: string,
  page: number
): Promise<StockResponseDto[]> => {
  const url = `http://localhost:8080/api/stocks/search?name=${query}&page=${
    page - 1
  }`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`Failed to fetch stocks: ${response.statusText}`);
  }

  return response.json();
};
