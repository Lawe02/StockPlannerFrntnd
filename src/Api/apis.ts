import axios from "axios";

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

const apiUrl = "http://localhost:8080/api/stocks";

export const fetchStocks = async (
  query: string,
  page: number,
  token: Promise<string>
): Promise<StockResponseDto[]> => {
  const url = `${apiUrl}/search?name=${query}&page=${page - 1}`;

  const tokenResult = await token;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${tokenResult}`,
  };
  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`Failed to fetch stocks: ${response.statusText}`);
  }

  return response.json();
};

export const createPlan = async (
  createPlanRequest: CreatePlanRequestDto,
  token: Promise<string>
): Promise<string> => {
  const url = apiUrl;

  const tokenResult = await token;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${tokenResult}`,
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
  userName: string,
  token: Promise<string>
): Promise<UserPlansResponseDto> => {
  const url = `${apiUrl}/plans?userName=${userName}`;

  const tokenResult = await token;

  console.log(tokenResult);

  const response = await axios.get<UserPlansResponseDto>(url, {
    headers: {
      Authorization: `Bearer ${tokenResult}`, // Add the token to the Authorization header
    },
  });

  return response.data;
};

export const fetchPlanDetails = async (
  id: string,
  userName: string,
  token: Promise<string>
) => {
  const tokenResult = await token;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${tokenResult}`,
  };

  const response = await fetch(`${apiUrl}/plans/${id}?userName=${userName}`, {
    headers,
  });
  if (!response.ok) {
    throw new Error("Failed to fetch plan details");
  }
  return await response.json();
};
