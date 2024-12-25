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
import { AreaChart, CartesianGrid, XAxis, Area, YAxis } from "recharts";
import { TrendingUp } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";

const PlanDetails: React.FC = () => {
  const { id } = useParams();
  const { user, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<PlanResponseDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [months, setMonths] = useState<number>(6);

  React.useEffect(() => {
    const loadPlanDetails = async () => {
      try {
        if (id) {
          const response = await fetchPlanDetails(
            id,
            user?.email ? user.email : "",
            getAccessTokenSilently()
          );
          setPlan(response);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
        console.log("matriiii");
      }
    };
    loadPlanDetails();
  }, [getAccessTokenSilently, id, user?.email]);

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
    <div className="container mx-auto p-6 max-w-4xl">
      <Button onClick={() => navigate("/")} variant="outline" className="mb-4">
        Back to Plans
      </Button>

      <Card>
        {/* Header */}
        <CardHeader className="p-4">
          <CardTitle className="text-xl">{plan.name}</CardTitle>
          <CardDescription className="text-sm text-gray-600">
            {plan.description}
          </CardDescription>
        </CardHeader>

        {/* Stock Details */}
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2">Stocks</h3>
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
                  <TableCell className="font-medium">{stock.name}</TableCell>
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
        <Card>
          <CardHeader>
            <CardTitle>Projected Investment Growth</CardTitle>
            <CardDescription>
              Adjust the duration and view growth projections
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            {/* Input and Projection Section */}
            <div className="flex items-center gap-6">
              {/* Input Section */}
              <div className="flex flex-col w-1/4">
                <label
                  htmlFor="monthsInput"
                  className="text-sm font-medium mb-1"
                >
                  Months
                </label>
                <input
                  id="monthsInput"
                  type="number"
                  min="1"
                  max="60"
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg p-2 text-sm w-full"
                  placeholder="1-60"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter months between 1 and 60.
                </p>
              </div>

              {/* Projected Worth and Growth */}
              <div className="flex flex-1 items-center justify-end gap-6">
                {/* Total Growth */}
                <div className="flex flex-col items-end text-right">
                  <p className="text-sm font-medium text-gray-600">
                    Projected Growth
                  </p>
                  <p className="text-base font-semibold text-green-600">
                    {totalGrowthPercentage.toFixed(2)}%
                  </p>
                </div>
                {/* Total Worth */}
                <div className="flex flex-col items-end text-right">
                  <p className="text-sm font-medium text-gray-600">
                    Total Worth
                  </p>
                  <p className="text-base font-semibold text-gray-800">
                    ${chartData[months - 1]?.investment.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>
            </div>

            {/* Chart with Border */}
            <div
              className="border border-grey rounded-lg p-2"
              style={{ backgroundColor: "#fff" }}
            >
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
                  <YAxis
                    dataKey="investment"
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
                    fill="#1F2937" // Dark gray fill
                    fillOpacity={0.4}
                    stroke="#1F2937" // Dark gray stroke
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 font-medium leading-none">
                  Stay informed about your investment plan!
                </div>
                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                  Powered by accurate projections.
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* Footer */}
        <CardFooter className="flex flex-col items-start gap-2 text-sm p-4">
          <div className="flex gap-2 font-medium leading-none">
            Projected growth over{" "}
            <span className="text-gray-800">{months}</span> months{" "}
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PlanDetails;
