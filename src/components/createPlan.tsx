import React, { useState } from "react";
import {
  createPlan,
  CreatePlanRequestDto,
  PlanStockRequestDto,
} from "../Api/apis";
import StockList from "./stockList"; // Import StockList component

const PlanCreationForm: React.FC = () => {
  const [planName, setPlanName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [stockPlans, setStockPlans] = useState<PlanStockRequestDto[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  // Handle adding a stock to the stockPlans array
  const addStockToPlan = (stockSymbol: string) => {
    // Ensure stock is not already in the plan
    if (stockPlans.some((stock) => stock.stockSymbol === stockSymbol)) return;

    const newStock: PlanStockRequestDto = {
      stockSymbol,
      priceWhenAdded: 0, // Placeholder, can be fetched or updated later
      moneyInvested: 0,
      monthlyPercentageProgress: 0,
    };

    setStockPlans([...stockPlans, newStock]);
  };

  // Handle updating stock details
  const updateStockDetails = (
    index: number,
    field: keyof PlanStockRequestDto,
    value: number
  ) => {
    const updatedStocks = [...stockPlans];
    updatedStocks[index] = { ...updatedStocks[index], [field]: value };
    setStockPlans(updatedStocks);
  };

  // Handle form submission
  const handleSubmit = async () => {
    const newPlan: CreatePlanRequestDto = {
      name: planName,
      description,
      userName,
      stockPlans,
    };

    try {
      const response = await createPlan(newPlan);
      setMessage(`Success: ${response}`);
      setPlanName("");
      setDescription("");
      setUserName("");
      setStockPlans([]);
    } catch (error) {
      setMessage(`Error: ${error}`);
    }
  };

  return (
    <div>
      <h1>Create a New Plan</h1>

      {/* Plan Details */}
      <div>
        <label>
          Plan Name:
          <input
            type="text"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          User Name:
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </label>
      </div>

      {/* Display Added Stocks */}
      <h3>Stocks in Plan</h3>
      {stockPlans.length > 0 ? (
        <ul>
          {stockPlans.map((stock, index) => (
            <li key={index}>
              <span>
                {stock.stockSymbol} - Money Invested:
                <input
                  type="number"
                  value={stock.moneyInvested}
                  onChange={(e) =>
                    updateStockDetails(index, "moneyInvested", +e.target.value)
                  }
                />
                , Progress:
                <input
                  type="number"
                  value={stock.monthlyPercentageProgress}
                  onChange={(e) =>
                    updateStockDetails(
                      index,
                      "monthlyPercentageProgress",
                      +e.target.value
                    )
                  }
                />
                %
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No stocks added yet.</p>
      )}

      {/* Submit Plan */}
      <button onClick={handleSubmit}>Create Plan</button>

      {/* Stock List Component */}
      <h2>Search and Add Stocks</h2>
      <StockList onAddStock={addStockToPlan} />

      {/* Display API Response */}
      {message && <p>{message}</p>}
    </div>
  );
};

export default PlanCreationForm;
