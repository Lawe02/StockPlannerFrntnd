import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PlanDetailsProps {
  plan: {
    name: string;
    description: string;
    stockPlans: { stockSymbol: string; moneyInvested: number }[];
  };
}

const PlanDetails: React.FC<PlanDetailsProps> = ({ plan }) => {
  const totalInvestment = plan.stockPlans.reduce(
    (sum, stock) => sum + stock.moneyInvested,
    0
  );

  return (
    <div>
      <h1 className="text-2xl font-bold">{plan.name}</h1>
      <p className="text-muted-foreground mb-4">{plan.description}</p>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Stock Symbol</TableHead>
            <TableHead>Money Invested</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plan.stockPlans.map((stock, index) => (
            <TableRow key={index}>
              <TableCell>{stock.stockSymbol}</TableCell>
              <TableCell>${stock.moneyInvested.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4">
        <p className="font-bold">
          Total Money Invested: ${totalInvestment.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default PlanDetails;
