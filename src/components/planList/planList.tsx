import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deletePlan, fetchPlansForUser, PlanResponseDto } from "../../Api/apis";
import { Input } from "@/components/ui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { queryClient } from "@/main";

const PlansList: React.FC = () => {
  const navigate = useNavigate();
  const { user, getAccessTokenSilently } = useAuth0();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage = 10;

  // Fetch plans using react-query
  const {
    data: plans = [],
    isLoading,
    isError,
    error,
  } = useQuery<PlanResponseDto[]>({
    queryKey: ["plans"],
    queryFn: async () => {
      const response = await fetchPlansForUser(
        user?.email || "",
        getAccessTokenSilently()
      );
      return response.plans;
    },
  });

  const deletePlanMutation = useMutation({
    mutationFn: async (planId: string) => {
      return deletePlan(
        planId,
        user?.email ? user.email : "",
        getAccessTokenSilently()
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });

  const handleDeletePlan = (planId: string) => {
    deletePlanMutation.mutate(planId);
  };

  // Filtered and paginated plans
  const filteredPlans = plans.filter((plan) =>
    plan.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when search query changes
  }, [searchQuery]);

  const paginatedPlans = filteredPlans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);

  const handleView = (planId: string) => {
    navigate(`/plan/${planId}`);
  };

  const renderPagination = () => (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationPrevious
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
        />
      </PaginationContent>
    </Pagination>
  );

  if (isLoading) {
    return <p className="text-center text-lg">Loading plans...</p>;
  }

  if (isError) {
    return (
      <p className="text-center text-red-500">
        Error: {error?.message || "An error occurred"}
      </p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center space-x-4">
        <Input
          placeholder="Search plans by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
        <Button
          size="lg"
          onClick={() => navigate("/createPlan")}
          className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
        >
          <span className="text-2xl text-white">+</span>
        </Button>
      </div>

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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <FontAwesomeIcon
                            icon={faEllipsis}
                            className="text-gray-500 hover:text-gray-700 text-xl cursor-pointer transition-transform duration-150 ease-in-out transform hover:scale-110"
                            aria-label="Actions"
                          />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-white border border-gray-200 rounded-md shadow-md w-32 p-2"
                        >
                          <DropdownMenuLabel className="text-sm font-medium text-gray-700 px-2 py-1">
                            Actions
                          </DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleView(plan.id)}
                            className="flex items-center px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded-md transition"
                          >
                            <FontAwesomeIcon icon={faEye} className="mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeletePlan(plan.id)}
                            className="flex items-center px-2 py-1 text-sm text-gray-700 hover:bg-red-100 hover:text-red-600 rounded-md transition"
                          >
                            <FontAwesomeIcon icon={faTrash} className="mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
      {filteredPlans.length > itemsPerPage && renderPagination()}
    </div>
  );
};

export default PlansList;
