export type TaskStatus = "pending" | "success" | "failed" | "terminated";

export interface Task {
  id: number;
  jobId: number;
  name: string;
  time: number;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

// Job-level status (derived)
export type JobStatus = "Completed" | "In Progress";

export interface Job {
  id: number;
  name: string;
  currentCpu: number;
  createdAt: string;
  updatedAt: string;
  totalTime: number;
  tasks: Task[];
}
