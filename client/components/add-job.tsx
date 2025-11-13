"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import React, { useState } from "react";
import { Delete, Loader } from "lucide-react";
import api from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";

const AddJob = () => {
  const [tasks, setTasks] = useState<{
    [key: string]: { name: string; time: string };
  }>({});
  const [error, setError] = useState<string>("");
  const [jobName, setJobName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  // Add new empty task
  const handleAddTask = () => {
    const id = Date.now().toString();
    setTasks((prev) => ({
      ...prev,
      [id]: { name: "", time: "" },
    }));
  };
  // Update task dynamically
  const handleTaskChange = (
    id: string,
    field: "name" | "time",
    value: string
  ) => {
    setTasks((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  // Delete task
  const handleDeleteTask = (id: string) => {
    setTasks((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  // When user confirms “Continue”
  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!jobName.trim()) {
      setError("Please enter job name");
      return;
    }

    // Check if there is at least one task
    const taskList = Object.values(tasks);
    if (taskList.length === 0) {
      setError("Please add at least one task.");
      return;
    }

    // Check if every task has both name and time filled
    const invalid = taskList.some((t) => !t.name.trim() || !t.time.trim());
    if (invalid) {
      setError("Please fill in both name and time for all tasks.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/job", {
        name: jobName,
        tasks: Object.values(tasks).map((task) => ({
          ...task,
          time: Number(task.time),
        })),
      });
      console.log("Job created:", response);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      cleanup();
    } catch (error: any) {
      console.error("Error creating job:", error);
      setError(
        error.response?.data?.message ||
          "Failed to create job. Please try again."
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const cleanup = () => {
    setTasks({});
    setError("");
    setJobName("");
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Add Job</Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add Job</AlertDialogTitle>
          <AlertDialogDescription>
            Add one or more tasks with name and time.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-3">
          <Input
            placeholder="Enter Job Name"
            value={jobName}
            onChange={(e) => setJobName(e.target.value)}
          />
          {error == "Please enter job name" && (
            <div className="text-red-500 text-sm font-medium">{error}</div>
          )}
          <div className="flex justify-end">
            <Button variant="secondary" onClick={handleAddTask}>
              + Add Task
            </Button>
          </div>

          {/* Render all tasks */}
          {Object.entries(tasks).length > 0 && (
            <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-2 py-2">
              {Object.entries(tasks).map(([id, task], index) => (
                <div key={id} className="flex items-center gap-2">
                  <div className="w-5 text-right">{index + 1}.</div>
                  <Input
                    type="text"
                    placeholder="Name"
                    value={task.name}
                    onChange={(e) =>
                      handleTaskChange(id, "name", e.target.value)
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Time (sec)"
                    value={task.time}
                    onChange={(e) =>
                      handleTaskChange(id, "time", e.target.value)
                    }
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTask(id)}
                  >
                    <Delete />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {error != "Please enter job name" && (
            <div className="text-red-500 text-sm font-medium mt-1">{error}</div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={cleanup}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>
            {loading ? <Loader className="animate-spin" /> : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddJob;
