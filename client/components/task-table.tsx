import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Job, Task } from "@/types/common";

const TaskTable = ({ jobData }: { jobData: Job }) => {
  return (
    <div className="space-y-4 mt-4">
      <div className="grid grid-cols-2 gap-2 text-sm">
        <span className="font-medium">ID:</span>
        <span>{jobData?.id}</span>

        <span className="font-medium">Name:</span>
        <span>{jobData?.name}</span>

        <span className="font-medium">CPU Used:</span>
        <span>{jobData?.currentCpu}</span>

        <span className="font-medium">Created:</span>
        <span>{new Date(jobData?.createdAt || "").toLocaleString()}</span>

        <span className="font-medium">Updated:</span>
        <span>{new Date(jobData?.updatedAt || "").toLocaleString()}</span>

        <span className="font-medium">Total Time:</span>
        <span>{jobData?.totalTime || ""}</span>
      </div>
      <div>
        <h3 className="font-medium mb-2">Tasks</h3>

        {jobData?.tasks && jobData.tasks.length > 0 ? (
          <Table className="border rounded-md">
            <TableHeader>
              <TableRow>
                <TableHead>SR</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {jobData?.tasks.map((t: Task, index: number) => (
                <TableRow key={t.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{t.name}</TableCell>
                  <TableCell>{t.status}</TableCell>
                  <TableCell>{t.time}s</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-2 text-sm text-muted-foreground border rounded-md">
            No tasks available
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskTable;
