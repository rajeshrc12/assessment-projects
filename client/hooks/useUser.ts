"use client";

import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function fetchUser() {
  const res = await api.get(`/user`);
  return res.data;
}

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });
}
