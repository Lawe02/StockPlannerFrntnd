import React, { useState } from "react";
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
import PlanDetails from "../plandetails/plandetails"; // Assume PlanDetails is the view component

const PlansList: React.FC = () => {
  const [plans, setPlans] = useState<PlanResponseDto[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<PlanResponseDto | null>(
    null
  ); // State to hold the selected plan
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  React.useEffect(() => {
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

  const handleView = (plan: PlanResponseDto) => {
    setSelectedPlan(plan); // Set the selected plan for viewing
  };

  const handleBack = () => {
    setSelectedPlan(null); // Return to the plans list
  };

  if (loading) {
    return <p className="text-center text-lg">Loading plans...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  if (selectedPlan) {
    return (
      <div>
        <Button onClick={handleBack} variant="outline" className="mb-4">
          Back to Plans
        </Button>
        <PlanDetails plan={selectedPlan} /> {/* Render the selected plan */}
      </div>
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
                    onClick={() => handleView(plan)}
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
