"use client";

import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function fetchCpu() {
  const res = await api.get(`/cpu`);
  return res.data;
}

export function useCpu() {
  return useQuery({
    queryKey: ["cpu"],
    queryFn: fetchCpu,
  });
}
