"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const router = useRouter();
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="flex flex-col gap-2 w-[300px] p-4 border shadow rounded-lg">
        <div className="font-bold text-xl">Register</div>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Enter a name"
        />
        <Button
          className="w-full"
          onClick={async () => {
            const user = await api.post("/auth/login", { name });
            if (user.status === 200) router.push("/dashboard");
          }}
        >
          Login
        </Button>
      </div>
    </div>
  );
}
