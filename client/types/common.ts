export type TaskStatus = "pending" | "success" | "failed";

export interface Task {
  id: number;
  jobId: number;
  name: string;
  time: number;
  status: TaskStatus;
  createdAt: string;
}

// Job-level status (derived)
export type JobStatus = "Completed" | "In Progress";

export interface Job {
  id: number;
  name: string;
  createdAt: string;
  totalTime: number;
  tasks: Task[];
}
