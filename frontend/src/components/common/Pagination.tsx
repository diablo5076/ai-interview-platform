"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "../ui/Button";
import Tooltip from "../ui/Tooltip";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;


  const pages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-2", className)}>
        <Tooltip content="Previous page">
      <div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page">
        <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    </Tooltip>

      {pages.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "primary" : "ghost"}
          size="sm"
          onClick={() => onPageChange(page)}
          aria-current={page === currentPage ? "page" : undefined}>
          {page}
        </Button>
      ))}

      <Tooltip content="Next page">
      <div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page">
        <ChevronRight className="h-4 w-4" />
          </Button>
      </div>
    </Tooltip>
    </nav>
  );
}