// Define the StockResponseDto interface
export interface StockResponseDto {
  symbol: string;
  name: string;
}

export interface PlanStockRequestDto {
  stockSymbol: string;
  priceWhenAdded: number;
  moneyInvested: number;
  monthlyPercentageProgress: number;
}

export interface CreatePlanRequestDto {
  name: string;
  description: string;
  userName: string;
  stockPlans: PlanStockRequestDto[];
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

export const createPlan = async (
  createPlanRequest: CreatePlanRequestDto
): Promise<string> => {
  const url = "http://localhost:8080/api/stocks";
 
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(createPlanRequest),
  });

  if (!response.ok) {
    throw new Error(`Failed to create plan: ${response.statusText}`);
  }

  return response.text();
};
