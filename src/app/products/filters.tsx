"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { SORT_OPTIONS } from "@/lib/constants";

export default function ProductsFilters({
  search,
  sort,
}: {
  search: string;
  sort: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(search);

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (val) params.set(key, val);
      else params.delete(key);
    });
    params.delete("page"); // reset to page 1 on filter change
    startTransition(() => router.push(`/products?${params.toString()}`));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: searchValue });
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        mb: 4,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSearchSubmit}
        sx={{ flexGrow: 1, minWidth: 220 }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search products..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onBlur={() => updateParams({ search: searchValue })}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  {isPending ? (
                    <CircularProgress size={16} />
                  ) : (
                    <SearchIcon fontSize="small" />
                  )}
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Sort by</InputLabel>
        <Select
          label="Sort by"
          value={sort}
          onChange={(e) => updateParams({ sort: e.target.value })}
        >
          {SORT_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
