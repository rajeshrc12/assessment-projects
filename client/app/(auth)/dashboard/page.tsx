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
import { LoaderCircle } from "lucide-react";

const DashboardPage = () => {
  const { data: jobs, isLoading } = useJobs();
  console.log(jobs);
  return (
    <div className="w-[60%] mx-auto">
      <div className="flex justify-between p-2">
        <div className="font-bold text-xl">Jobs</div>
        <AddJob />
      </div>
      <div className="overflow-hidden rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="h-9 py-2">SR</TableHead>
              <TableHead className="h-9 py-2">Name</TableHead>
              <TableHead className="h-9 py-2">Tasks</TableHead>
              <TableHead className="h-9 py-2">Created At</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <LoaderCircle className="h-6 w-6 animate-spin" />
                    <span>Loading Jobs...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : jobs && jobs.length > 0 ? (
              jobs.map(
                (
                  job: {
                    name: string;
                    createdAt: string;
                    id: string;
                    tasks: [];
                  },
                  index: number
                ) => (
                  <TableRow key={job?.id}>
                    <TableCell className="py-2">{index + 1}</TableCell>
                    <TableCell className="py-2 font-medium">
                      {job?.name}
                    </TableCell>
                    <TableCell className="py-2 font-medium">
                      {job?.tasks.length}
                    </TableCell>
                    <TableCell className="py-2">
                      {new Date(job?.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                )
              )
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-4 text-muted-foreground"
                >
                  No Jobs found
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
