"use client";

import { RefreshCcw } from "lucide-react";
import AddJob from "@/components/add-job";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import CurrentCpu from "@/components/current-cpu";
import { toast } from "sonner";
import JobTable from "@/components/job-table";

const DashboardPage = () => {
  const { data: user, refetch, isLoading } = useUser();
  return (
    <div className="w-[80%] max-w-4xl mx-auto py-10">
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Job Dashboard
              <Button
                variant={"ghost"}
                onClick={async () => {
                  await refetch();
                  toast.success("Dashboard refreshed");
                }}
              >
                <RefreshCcw />
              </Button>
            </h1>
            <div>
              Available CPU: {user?.availableCpu ? user.availableCpu : 0}
            </div>
            <CurrentCpu
              currentCpu={user?.currentCpu || 0}
              availableCpu={user?.availableCpu ? user.availableCpu : 0}
            />
          </div>
        </div>

        <AddJob currentCpu={user?.currentCpu} />
      </div>

      <JobTable jobs={user?.jobs} isLoading={isLoading} />
    </div>
  );
};

export default DashboardPage;
