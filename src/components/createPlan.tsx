import React, { useState } from "react";
import {
  createPlan,
  CreatePlanRequestDto,
  PlanStockRequestDto,
} from "../Api/apis";
import StockList from "./stockList";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const PlanCreationForm: React.FC = () => {
  const { user } = useAuth0();
  const navigate = useNavigate();
  const [planName, setPlanName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [userName] = useState<string>(user?.email ? user.email : "");
  const [stockPlans, setStockPlans] = useState<PlanStockRequestDto[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [months, setMonths] = useState<number>(0); // Months input by user
  const [totalValue, setTotalValue] = useState<number | null>(null); // Total future value of all stocks
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);

  // Handle adding a stock to the stockPlans array
  const addStockToPlan = (stockSymbol: string) => {
    if (stockPlans.some((stock) => stock.stockSymbol === stockSymbol)) return;

    const newStock: PlanStockRequestDto = {
      stockSymbol,
      priceWhenAdded: 0, // Placeholder
      moneyInvested: 0,
      monthlyPercentageProgress: 0,
    };

    setStockPlans([...stockPlans, newStock]);
  };

  // Handle removing a stock from the stockPlans array
  const removeStockFromPlan = (stockSymbol: string) => {
    const updatedStocks = stockPlans.filter(
      (stock) => stock.stockSymbol !== stockSymbol
    );
    setStockPlans(updatedStocks);
  };

  const calculateTotalFutureValue = () => {
    if (months <= 0) {
      setMessage("Please enter a valid number of months.");
      return;
    }
    const totalInitialValue = stockPlans.reduce(
      (acc, stock) => acc + stock.moneyInvested,
      0
    );
    // Calculate the total future value considering all stocks' progress
    const totalEndValue = stockPlans.reduce((acc, stock) => {
      const { moneyInvested, monthlyPercentageProgress } = stock;

      // Apply the formula to each stock's future value, then sum
      const futureValue =
        moneyInvested * Math.pow(1 + monthlyPercentageProgress / 100, months);

      return acc + futureValue;
    }, 0);

    setTotalValue(totalEndValue);
    setTotalRevenue(
      () => ((totalEndValue - totalInitialValue) / totalInitialValue) * 100
    );
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
      setStockPlans([]);
      navigate("/");
    } catch (error) {
      setMessage(`Error: ${error}`);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 px-4 lg:px-16 mx-auto max-w-screen-xl mt-6">
      {/* Stock List (Left Section) */}
      <div className="flex-1 lg:w-1/4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Search and Add Stocks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StockList onAddStock={addStockToPlan} />
          </CardContent>
        </Card>
      </div>

      {/* Plan Creation Form (Right Section) */}
      <div className="flex-1 lg:w-3/4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Create a New Investment Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Plan Details */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="planName">Plan Name</Label>
                <Input
                  id="planName"
                  placeholder="Enter plan name"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your plan"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="months">Months</Label>
                <Input
                  id="months"
                  type="number"
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  placeholder="Enter number of months"
                />
              </div>
            </div>

            {/* Display Added Stocks */}
            <h3 className="mt-6 text-lg font-medium">Stocks in Plan</h3>
            {stockPlans.length > 0 ? (
              <Table className="mt-4">
                <TableHeader>
                  <TableRow>
                    <TableHead>Stock Symbol</TableHead>
                    <TableHead>Money Invested</TableHead>
                    <TableHead>Progress (%)</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockPlans.map((stock, index) => (
                    <TableRow key={index}>
                      <TableCell>{stock.stockSymbol}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={stock.moneyInvested}
                          onChange={(e) =>
                            updateStockDetails(
                              index,
                              "moneyInvested",
                              +e.target.value
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
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
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          onClick={() => removeStockFromPlan(stock.stockSymbol)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground mt-4">No stocks added yet.</p>
            )}
          </CardContent>

          <CardFooter className="flex justify-between items-center">
            {/* Display Total Future Value */}
            {totalValue !== null && (
              <div className="mt-4 text-lg font-semibold">
                <h4>Total Future Value: </h4>
                <p className="text-green-600">${totalValue.toFixed(2)}</p>
              </div>
            )}
            {totalRevenue != null && (
              <div className="mt-4 text-lg font-semibold">
                <h4>Total Revenue: </h4>
                <p className="text-green-600">%{totalRevenue.toFixed(2)}</p>
              </div>
            )}
            {/* Display API Response */}
            {message && (
              <p className="text-sm text-muted-foreground">{message}</p>
            )}

            {/* Submit Plan */}
            <Button variant="outline" onClick={calculateTotalFutureValue}>
              Calculate Total Future Value
            </Button>
            <Button onClick={handleSubmit}>Create Plan</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PlanCreationForm;
