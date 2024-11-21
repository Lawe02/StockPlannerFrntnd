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

  const totalInvestment = plan.stockPlans.reduce(
    (acc, stock) => acc + stock.moneyInvested,
    0
  );

  const totalRevenuePercentage =
    plan.stockPlans.reduce(
      (acc, stock) => acc + stock.monthlyPercentageDevelopment,
      0
    ) / plan.stockPlans.length;

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

        <CardContent>
          <div className="relative">
            {/* Overlay for total investment and revenue */}
            <div className="absolute top-4 left-4 bg-gray-800 text-white rounded-md p-4 shadow-md">
              <div className="text-lg font-bold">
                ${totalInvestment.toFixed(2)}
              </div>
              <div className="text-sm text-green-400">
                {totalRevenuePercentage.toFixed(2)}% Revenue Growth
              </div>
            </div>

            {/* Chart */}
            <ChartContainer config={chartConfig}>
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
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
            Projected growth over {months} months{" "}
            <TrendingUp className="h-4 w-4" />
          </div>
          <input
            type="number"
            min="1"
            max="60"
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="border p-2 mt-4"
            placeholder="Enter months"
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default PlanDetails;
