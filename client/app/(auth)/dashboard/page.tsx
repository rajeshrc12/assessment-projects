"use client";

import { RefreshCcw } from "lucide-react";
import AddJob from "@/components/add-job";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import CurrentCpu from "@/components/current-cpu";
import { toast } from "sonner";
import JobTable from "@/components/job-table";
import api, { baseURL } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const DashboardPage = () => {
  const { data: user, refetch, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    const source = new EventSource(`${baseURL}/user/events`, {
      withCredentials: true,
    });

    source.onmessage = (event) => {
      if (event.data === "refresh") {
        refetch();
      }
    };

    return () => source.close();
  }, []);
  return (
    <div className="w-[80%] max-w-4xl mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-start gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Job Dashboard
              </h1>

              <Button
                variant="ghost"
                size="icon"
                onClick={async () => {
                  await refetch();
                  toast.success("Dashboard refreshed");
                }}
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>

            <div>Available CPU: {user?.availableCpu ?? 0}</div>

            <CurrentCpu
              currentCpu={user?.currentCpu || 0}
              availableCpu={user?.availableCpu ?? 0}
            />
          </div>
        </div>

        <div className="flex flex-col items-end justify-end gap-4">
          <div className="flex items-center gap-2">
            <div className="text-xl font-medium">Welcome, {user?.name}</div>

            <Button
              onClick={async () => {
                const response = await api.post("/auth/logout");
                if (response.status === 200) {
                  router.push("/");
                  toast.success("logged out successfully");
                }
              }}
            >
              Logout
            </Button>
          </div>

          <AddJob currentCpu={user?.currentCpu} />
        </div>
      </div>

      <JobTable jobs={user?.jobs} isLoading={isLoading} refetch={refetch} />
    </div>
  );
};

export default DashboardPage;
