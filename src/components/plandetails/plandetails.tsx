import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPlanDetails, PlanResponseDto } from "../../Api/apis";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const PlanDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<PlanResponseDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [months, setMonths] = useState<number>(12); // Default to 12 months
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const loadPlanDetails = async () => {
      try {
        if (id) {
          const response = await fetchPlanDetails(id, "johndoe");
          setPlan(response);
          console.log(response);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    loadPlanDetails();
  }, [id]);

  useEffect(() => {
    if (plan) {
      // Calculate chart data when months or plan changes
      const data = calculateChartData(plan, months);
      setChartData(data);
    }
  }, [plan, months]);

  const calculateChartData = (plan: PlanResponseDto, months: number) => {
    // Generate chart data for each stock
    const data = [];
    for (let month = 1; month <= months; month++) {
      const totalValue = plan.stockPlans.reduce((sum, stock) => {
        const growthFactor = 1 + stock.monthlyPercentageDevelopment / 100;
        const value = stock.moneyInvested * Math.pow(growthFactor, month);
        return sum + value;
      }, 0);
      data.push({ month, value: totalValue.toFixed(2) });
    }
    return data;
  };

  if (loading) {
    return (
      <div className="p-8">
        <Skeleton className="h-12 w-1/2 mb-4" />
        <Skeleton className="h-10 w-1/4 mb-4" />
        <Skeleton className="h-8 w-full mb-4" />
        <Skeleton className="h-8 w-2/3 mb-4" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  if (!plan) {
    return <p className="text-center">Plan not found.</p>;
  }

  const totalInvestment = plan.stockPlans.reduce(
    (sum, stock) => sum + stock.moneyInvested,
    0
  );

  return (
    <div className="container mx-auto p-8">
      <Button onClick={() => navigate("/")} variant="outline" className="mb-6">
        Back to Plans
      </Button>

      <Card>
        <CardHeader>
          <h1 className="text-3xl font-semibold text-gray-800">{plan.name}</h1>
          <p className="text-muted-foreground">{plan.description}</p>
        </CardHeader>

        <CardContent>
          <Table className="mb-4">
            <TableHeader>
              <TableRow>
                <TableHead>Stock Name</TableHead>
                <TableHead>Stock Symbol</TableHead>
                <TableHead>Monthly % Dev</TableHead>
                <TableHead>Price When Added</TableHead>
                <TableHead>Money Invested</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plan.stockPlans.map((stock, index) => (
                <TableRow key={index}>
                  <TableCell>{stock.name}</TableCell>
                  <TableCell>{stock.symbol}</TableCell>
                  <TableCell className="text-right">
                    {stock.monthlyPercentageDevelopment}%
                  </TableCell>
                  <TableCell className="text-right">
                    ${stock.priceWhenAdded.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    ${stock.moneyInvested.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-6 flex items-center justify-between">
            <p className="font-semibold text-lg">Total Money Invested:</p>
            <p className="font-bold text-xl text-green-600">
              ${totalInvestment.toFixed(2)}
            </p>
          </div>

          <div className="mt-6">
            <div className="flex items-center mb-4">
              <label htmlFor="months" className="mr-4 font-medium">
                Enter Number of Months:
              </label>
              <Input
                id="months"
                type="number"
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                className="w-20"
              />
            </div>

            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  label={{ value: "Months", position: "insideBottom" }}
                />
                <YAxis
                  label={{
                    value: "Value ($)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full sm:w-auto"
          >
            Back to Plans
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PlanDetails;
