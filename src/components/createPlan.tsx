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

const PlanCreationForm: React.FC = () => {
  const [planName, setPlanName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [stockPlans, setStockPlans] = useState<PlanStockRequestDto[]>([]);
  const [message, setMessage] = useState<string | null>(null);

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
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Stock List (Left Section) */}
      <div className="flex-1">
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
      <div className="flex-1">
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
                <Label htmlFor="userName">User Name</Label>
                <Input
                  id="userName"
                  placeholder="Enter your username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground mt-4">No stocks added yet.</p>
            )}
          </CardContent>

          <CardFooter className="flex justify-between items-center">
            {/* Display API Response */}
            {message && (
              <p className="text-sm text-muted-foreground">{message}</p>
            )}

            {/* Submit Plan */}
            <Button onClick={handleSubmit}>Create Plan</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PlanCreationForm;
