import React, { useEffect, useState } from "react";
import {
  fetchPlansForUser,
  UserPlansResponseDto,
  PlanResponseDto,
} from "../../Api/apis";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PlansList: React.FC = () => {
  const [plans, setPlans] = useState<PlanResponseDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const response: UserPlansResponseDto = await fetchPlansForUser(
          "johndoe"
        );
        setPlans(response.plans);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, ["johndoe"]);

  const handleDelete = (planName: string) => {
    console.log(`Deleting plan: ${planName}`);
  };

  const handleView = (planName: string) => {
    console.log(`Viewing plan: ${planName}`);
  };

  if (loading) {
    return <p className="text-center text-lg">Loading plans...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  if (plans.length === 0) {
    return (
      <p className="text-center text-lg">No plans found for {"johndoe"}.</p>
    );
  }

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Plan Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Total Money Invested</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans.map((plan, index) => {
            const stockPlans = plan.stockPlans || [];
            const totalInvestment = stockPlans.reduce(
              (sum, stock) => sum + stock.moneyInvested,
              0
            );

            return (
              <TableRow key={index}>
                <TableCell>
                  <span className="font-medium">{plan.name}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {plan.description}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">${totalInvestment.toFixed(2)}</span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mr-2"
                    onClick={() => handleView(plan.name)}
                  >
                    View
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(plan.name)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default PlansList;
