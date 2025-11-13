"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      setLoading(true);
      const user = await api.post("/auth/login", { name });
      if (user.status === 200) {
        router.push("/dashboard");
      }
    } catch (e) {
      toast.error("Login failed try again");
    }
  };

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="flex flex-col gap-5 w-[300px] p-4 border shadow rounded-lg">
        <div className="font-bold text-xl">Register</div>

        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Enter a name"
        />

        <Button className="w-full" onClick={handleLogin} disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
              Logging in...
            </span>
          ) : (
            "Login"
          )}
        </Button>
      </div>
    </div>
  );
}
