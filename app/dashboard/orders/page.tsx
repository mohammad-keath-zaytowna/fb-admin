"use client";

import { useOrderColumns } from "./columns";
import { OrdersDataTable } from "./orders-data-table";
import { getOrders, GetOrdersParams } from "@/lib/api/orders";
import { Order, OrderListResponse } from "@/types";
import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";

function OrdersPageContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<Order[]>([]);
  const [meta, setMeta] = useState<OrderListResponse["meta"]>();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [rowsPerPage, setRowsPerPage] = useState(Number(searchParams.get("rowsPerPage")) || 10);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [searchDebounced] = useDebounce(search, 200);

  const columns = useOrderColumns()

  const fetchOrders = useCallback(async (params?: GetOrdersParams) => {
    try {
      setIsLoading(true);
      const response = await getOrders({
        page: params?.page || page,
        rowsPerPage: params?.rowsPerPage || rowsPerPage,
        search: params?.search !== undefined ? params.search : searchDebounced || undefined,
      });
      setData(response.orders || []);
      setMeta(response.meta);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setData([]);
      setMeta(undefined);
    } finally {
      setIsLoading(false);
    }
  }, [page, rowsPerPage, searchDebounced]);

  useEffect(() => {
    fetchOrders({ page, rowsPerPage, search: searchDebounced });
  }, [page, rowsPerPage, searchDebounced, fetchOrders]);

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

  if (isLoading && !searchDebounced) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-muted-foreground">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <OrdersDataTable
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

export default function OrdersPage() {
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
      <OrdersPageContent />
    </Suspense>
  );
}

