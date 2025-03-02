import axios from "axios";

// Response
export interface StockResponseDto {
  symbol: string;
  name: string;
}

export interface StockPlanResponseDto {
  stockSymbol: string;
  name: string;
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

const apiUrl = "https://stock-api-722895024234.us-central1.run.app/api/stocks";

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

  const response = await axios.get<UserPlansResponseDto>(url, {
    headers: {
      Authorization: `Bearer ${tokenResult}`, // Add the token to the Authorization header
    },
  });

  return response.data;
};

export const deletePlan = async (
  id: string,
  userName: string,
  token: Promise<string>
) => {
  const tokenResult = await token;

  console.log("id: " + id + " userName: " + userName);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${tokenResult}`,
  };

  try {
    // Using axios for making the DELETE request
    const response = await axios.delete(
      `${apiUrl}/plans/delete`, // Replace with your actual API URL if needed
      {
        headers,
        params: {
          planId: id,
          userName: userName,
        },
      }
    );

    // Handle successful response
    return response.data;
  } catch (error) {
    // Handle error
    console.error("Error deleting plan: ", error);
    throw new Error("Failed to delete plan");
  }
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
