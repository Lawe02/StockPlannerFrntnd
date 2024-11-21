// PlansList.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
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
  const navigate = useNavigate(); // Initialize the navigate function

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
  }, []);

  const handleView = (planId: string) => {
    navigate(`/plan/${planId}`); // Navigate to the PlanDetails page with the plan's ID
  };

  if (loading) {
    return <p className="text-center text-lg">Loading plans...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
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
                    onClick={() => handleView(plan.id)}
                  >
                    View
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
