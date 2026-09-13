"use client";

import { Search } from "lucide-react";
import type { ChangeEvent } from "react";

import Input from "../ui/Input";

interface SearchBarProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  className,
}: SearchBarProps) {
  return (
    <Input
      type="search"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      leftIcon={<Search className="h-4 w-4" />}
      className={className}
      aria-label="Search"
    />
  );
}