"use client";

import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function fetchJobs() {
  const res = await api.get(`/job`);
  return res.data;
}

export function useJobs() {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: fetchJobs,
  });
}
