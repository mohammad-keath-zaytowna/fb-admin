"use client";

import { SectionCards } from "@/components/section-cards";
import { getStats } from "@/lib/api/stats";
import { useEffect, useState } from "react";
import { DashboardStats } from "@/lib/api/stats";


export default function Page() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const statsData = await getStats();
        setStats(statsData);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards stats={stats} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
