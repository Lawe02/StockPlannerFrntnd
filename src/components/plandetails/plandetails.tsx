"use client";

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPlanDetails, PlanResponseDto } from "../../Api/apis";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AreaChart, CartesianGrid, XAxis, Area } from "recharts";
import { TrendingUp } from "lucide-react";

const PlanDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<PlanResponseDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [months, setMonths] = useState<number>(6);

  React.useEffect(() => {
    const loadPlanDetails = async () => {
      try {
        if (id) {
          const response = await fetchPlanDetails(id, "johndoe");
          setPlan(response);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    loadPlanDetails();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!plan) {
    return <p>Plan not found.</p>;
  }

  // Calculate chart data and overall stats
  const chartData = Array.from({ length: months }, (_, index) => ({
    month: `Month ${index + 1}`,
    investment:
      plan.stockPlans[0].moneyInvested *
      (1 + plan.stockPlans[0].monthlyPercentageDevelopment / 100) ** index,
  }));

  const previousInvestment = plan.stockPlans[0].moneyInvested;
  const totalGrowthPercentage = previousInvestment
    ? (((chartData[months - 1]?.investment || 0) - previousInvestment) /
        previousInvestment) *
      100
    : 0;

  const chartConfig: ChartConfig = {
    investment: {
      label: "Investment Value",
      color: "#1F2937", // Dark gray color
    },
  };

  return (
    <div className="container mx-auto p-8">
      <Button onClick={() => navigate("/")} variant="outline" className="mb-6">
        Back to Plans
      </Button>

      <Card>
        {/* Header */}
        <CardHeader>
          <CardTitle>{plan.name}</CardTitle>
          <CardDescription>{plan.description}</CardDescription>
        </CardHeader>

        {/* Stock Details */}

        <CardContent>
          <h3 className="text-lg font-semibold mb-4">Stocks</h3>
          <Table>
            <TableCaption>A list of stocks in this plan.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Stock Name</TableHead>
                <TableHead>Investment ($)</TableHead>
                <TableHead>Monthly Growth (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plan.stockPlans.map((stock, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {stock.stockName}
                  </TableCell>
                  <TableCell>{stock.moneyInvested.toFixed(2)}</TableCell>
                  <TableCell>
                    {stock.monthlyPercentageDevelopment.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>

        {/* Chart Section */}
        <CardContent>
          <div className="relative">
            {/* Growth and Total Worth Overlay */}
            <CardHeader className="absolute top-4 left-4 bg-white/80 p-3 rounded-lg shadow-md">
              <CardTitle className="text-xl font-bold text-gray-800">
                Total Growth:{" "}
                <span className="text-green-600">
                  {totalGrowthPercentage.toFixed(2)}%
                </span>
              </CardTitle>
              <CardDescription className="text-lg font-medium text-gray-600">
                Total Worth:{" "}
                <span className="text-gray-800">
                  ${chartData[months - 1]?.investment.toFixed(2) || "0.00"}
                </span>
              </CardDescription>
            </CardHeader>

            {/* Chart */}
            <ChartContainer config={chartConfig}>
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                  top: 50, // Added top margin to accommodate the overlay
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                  dataKey="investment"
                  type="natural"
                  fill="#1F2937" // Dark gray for fill
                  fillOpacity={0.4} // Slight transparency for the area
                  stroke="#1F2937" // Dark gray for stroke
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Projected growth over{" "}
            <span className="text-gray-800">{months}</span> months{" "}
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <input
            type="number"
            min="1"
            max="60"
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="border border-gray-300 rounded-lg p-2 mt-4 w-full"
            placeholder="Enter months"
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default PlanDetails;
