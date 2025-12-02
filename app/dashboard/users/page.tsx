"use client";

import { columns } from "./columns";
import { UsersDataTable } from "./users-data-table";
import { getUsers, GetUsersParams } from "@/lib/api/users";
import { User, UserListResponse } from "@/types";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function UsersPageContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<User[]>([]);
  const [meta, setMeta] = useState<UserListResponse["meta"]>();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [rowsPerPage, setRowsPerPage] = useState(Number(searchParams.get("rowsPerPage")) || 10);
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const fetchUsers = useCallback(async (params?: GetUsersParams) => {
    try {
      setIsLoading(true);
      const response = await getUsers({
        page: params?.page || page,
        rowsPerPage: params?.rowsPerPage || rowsPerPage,
        search: params?.search !== undefined ? params.search : search || undefined,
      });
      setData(response.users || []);
      setMeta(response.meta);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setData([]);
      setMeta(undefined);
    } finally {
      setIsLoading(false);
    }
  }, [page, rowsPerPage, search]);

  useEffect(() => {
    fetchUsers({ page, rowsPerPage, search });
  }, [page, rowsPerPage, search, fetchUsers]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    window.history.pushState({}, "", `?${params.toString()}`);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(1);
    const params = new URLSearchParams(searchParams.toString());
    params.set("rowsPerPage", newRowsPerPage.toString());
    params.set("page", "1");
    window.history.pushState({}, "", `?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-muted-foreground">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (newSearch) {
      params.set("search", newSearch);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    window.history.pushState({}, "", `?${params.toString()}`);
  };

  return (
    <div className="container mx-auto py-10">
      <UsersDataTable
        columns={columns}
        data={data}
        meta={meta}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onSearchChange={handleSearchChange}
        searchValue={search}
      />
    </div>
  );
}

export default function UsersPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto py-10">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4 text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <UsersPageContent />
    </Suspense>
  );
}
