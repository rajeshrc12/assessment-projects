"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddJob from "@/components/add-job";
import { useJobs } from "@/hooks/useJobs";
import { LoaderCircle, RefreshCcw } from "lucide-react";
import { Job } from "@/types/common";
import { fromNow } from "@/lib/date";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const DashboardPage = () => {
  const { data: jobs, isLoading, refetch } = useJobs();
  const [tick, setTick] = useState(0);
  return (
    <div className="w-[80%] max-w-4xl mx-auto py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Job Dashboard
          </h1>
          <Button
            variant={"ghost"}
            onClick={async () => {
              await refetch();
              setTick((prev) => prev + 1);
            }}
          >
            <RefreshCcw />
          </Button>
        </div>

        <AddJob />
      </div>

      {/* Table Wrapper */}
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="h-10 px-4 text-left text-sm font-medium">
                SR
              </TableHead>
              <TableHead className="h-10 px-4 text-left text-sm font-medium">
                Name
              </TableHead>
              <TableHead className="h-10 px-4 text-left text-sm font-medium">
                Tasks
              </TableHead>
              <TableHead className="h-10 px-4 text-left text-sm font-medium">
                Status
              </TableHead>
              <TableHead className="h-10 px-4 text-left text-sm font-medium">
                Percentage
              </TableHead>
              <TableHead className="h-10 px-4 text-left text-sm font-medium">
                Created At
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <LoaderCircle className="h-6 w-6 animate-spin" />
                    <span>Loading jobs...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : jobs && jobs.length > 0 ? (
              jobs.map((job: Job, index: number) => {
                const totalTasks = job.tasks.length;
                const completedTasks = job.tasks.filter(
                  (t) => t.status === "success"
                ).length;
                const percentage =
                  totalTasks > 0
                    ? Math.round((completedTasks / totalTasks) * 100)
                    : 0;
                const status =
                  completedTasks === totalTasks && totalTasks > 0
                    ? "Completed"
                    : "In Progress";

                return (
                  <TableRow
                    key={job.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="px-4 py-3">{index + 1}</TableCell>
                    <TableCell className="px-4 py-3 font-medium text-foreground">
                      {job.name}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {job.tasks.length}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          status === "Completed"
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                        }`}
                      >
                        {status}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span
                        className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium min-w-[45px] text-center
                        ${
                          percentage === 100
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : percentage >= 50
                            ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                            : "bg-red-100 text-red-700 border border-red-300"
                        }`}
                      >
                        {percentage}%
                      </span>
                    </TableCell>
                    <TableCell
                      key={tick}
                      className="px-4 py-3 text-muted-foreground"
                    >
                      {fromNow(job.createdAt)}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No jobs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DashboardPage;
