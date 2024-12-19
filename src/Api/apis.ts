// Response
export interface StockResponseDto {
  symbol: string;
  name: string;
}

export interface StockPlanResponseDto {
  stockSymbol: string;
  stockName: string;
  monthlyPercentageDevelopment: number;
  priceWhenAdded: number;
  moneyInvested: number;
}

export interface PlanResponseDto {
  stockPlans: StockPlanResponseDto[];
  id: string;
  name: string;
  description: string;
  stocks: StockPlanResponseDto[];
}

export interface UserPlansResponseDto {
  plans: PlanResponseDto[];
}

//Request
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

export const fetchPlansForUser = async (
  userName: string
): Promise<UserPlansResponseDto> => {
  const url = `http://localhost:8080/api/stocks/plans?userName=${userName}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const response = await fetch(url, { headers });

  if (!response.ok) {
    console.log(response);
    throw new Error(
      `Failed to fetch plans for user ${userName}: ${response.statusText}`
    );
  }

  return response.json();
};

export const fetchPlanDetails = async (id: string, userName: string) => {
  const response = await fetch(
    `http://localhost:8080/api/stocks/plans/${id}?userName=${userName}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch plan details");
  }
  return await response.json();
};
