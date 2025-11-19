import { Job, Task } from "@/types/common";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Loader, LoaderCircle, Pause } from "lucide-react";
import { fromNow } from "@/lib/date";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Button } from "./ui/button";
import TaskTable from "./task-table";
import api from "@/lib/api";
import { toast } from "sonner";

const headers = [
  "Name",
  "Tasks",
  "CPU Used",
  "Status",
  "Percentage",
  "Total Time",
  "Created At",
  "Actions",
];

const JobTable = ({
  jobs,
  isLoading,
  refetch,
}: {
  jobs: Job[];
  isLoading: boolean;
  refetch: () => {};
}) => {
  const [open, setOpen] = useState(false);
  const [jobData, setJobData] = useState<Job>();
  const [openDelete, setOpenDelete] = useState(0);
  const handleTerminateJob = async () => {
    await api.post("/job/terminate", {
      jobId: openDelete,
    });
    toast.success("Job terminated");
    refetch();
  };
  return (
    <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            {headers.map((h) => (
              <TableHead
                key={h}
                className="h-10 px-4 text-left text-sm font-medium"
              >
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={9} className="py-10 text-center">
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

              const hasTerminated = job.tasks.some(
                (t) => t.status === "terminated"
              );

              const percentage =
                totalTasks > 0
                  ? Math.round((completedTasks / totalTasks) * 100)
                  : 0;

              let status;

              if (hasTerminated) {
                status = "Terminated";
              } else if (completedTasks === totalTasks && totalTasks > 0) {
                status = "Completed";
              } else {
                status = "In Progress";
              }

              return (
                <TableRow
                  key={job.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="px-4 py-3 font-medium text-foreground">
                    {job.name}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {job.tasks.length}
                  </TableCell>
                  <TableCell className="px-4 py-3">{job.currentCpu}</TableCell>
                  <TableCell className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium">
                      <span
                        className={
                          `h-2.5 w-2.5 rounded-full ` +
                          (status === "Terminated"
                            ? "bg-red-500"
                            : status === "Completed"
                            ? "bg-green-500"
                            : "bg-yellow-500")
                        }
                      />
                      {status}
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    {hasTerminated ? (
                      "-"
                    ) : (
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
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground">
                    {hasTerminated ? "-" : Number(job.totalTime) + "s"}
                  </TableCell>
                  <TableCell
                    key={job.updatedAt}
                    className="px-4 py-3 text-muted-foreground"
                  >
                    {fromNow(job.createdAt)}
                  </TableCell>
                  <TableCell className="flex gap-2 px-4 py-3 text-muted-foreground">
                    <Button
                      className="h-8 w-8"
                      variant={"outline"}
                      onClick={() => {
                        setOpen(true);
                        setJobData(job);
                      }}
                    >
                      <Eye />
                    </Button>
                    {!hasTerminated && percentage !== 100 && (
                      <Button
                        className="h-8 w-8"
                        variant={"destructive"}
                        onClick={() => setOpenDelete(job.id)}
                      >
                        <Pause />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={9}
                className="text-center py-8 text-muted-foreground"
              >
                No jobs found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Job Details</AlertDialogTitle>
            <AlertDialogDescription>
              Below is the information related to this job.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <TaskTable jobData={jobData as Job} />
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={!!openDelete}
        onOpenChange={() => {
          setOpenDelete(0);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will terminate your job
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleTerminateJob}>
              Terminate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default JobTable;
