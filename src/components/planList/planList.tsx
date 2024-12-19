import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchPlansForUser,
  UserPlansResponseDto,
  PlanResponseDto,
} from "../../Api/apis";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useAuth0 } from "@auth0/auth0-react";

const PlansList: React.FC = () => {
  const navigate = useNavigate();
  const { user, getAccessTokenSilently } = useAuth0();
  const [plans, setPlans] = useState<PlanResponseDto[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<PlanResponseDto[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Constants for pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const response: UserPlansResponseDto = await fetchPlansForUser(
          user?.email ? user?.email : ""
        );
        setPlans(response.plans);
        console.log(response.plans);
        setFilteredPlans(response.plans); // Initialize filtered plans
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
        console.log(getAccessTokenSilently());
      }
    };

    loadPlans();
  }, []);

  // Search filter logic
  useEffect(() => {
    const filtered = plans.filter((plan) =>
      plan.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPlans(filtered);
    setCurrentPage(1); // Reset to first page on new search
  }, [searchQuery, plans]);

  const handleView = (planId: string) => {
    navigate(`/plan/${planId}`);
  };

  const paginatedPlans = filteredPlans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderPagination = () => (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationPrevious
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        />
        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1;

          if (
            totalPages > 5 &&
            Math.abs(currentPage - page) > 2 &&
            page !== 1 &&
            page !== totalPages
          ) {
            return (
              <PaginationEllipsis key={`ellipsis-${page}`} aria-hidden={true} />
            );
          }

          return (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={currentPage === page}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationNext
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        />
      </PaginationContent>
    </Pagination>
  );

  if (loading) {
    return <p className="text-center text-lg">Loading plans...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      {/* Search and Filters */}
      <div className="flex justify-between items-center space-x-4">
        <Input
          placeholder="Search plans by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />

        {/* Floating Button */}
        <Button
          size="lg"
          onClick={() => navigate("/createPlan")}
          className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
        >
          <span className="text-2xl text-white">+</span>
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-lg border shadow-sm">
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
            {paginatedPlans.length > 0 ? (
              paginatedPlans.map((plan, index) => {
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
                      <span className="text-sm">
                        ${totalInvestment.toFixed(2)}
                      </span>
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
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No plans found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredPlans.length > itemsPerPage && renderPagination()}
    </div>
  );
};

export default PlansList;
