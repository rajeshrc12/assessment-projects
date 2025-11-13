import { useEffect, useState } from "react";
import { Check, Loader, Pencil, X } from "lucide-react";
import api from "@/lib/api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useQueryClient } from "@tanstack/react-query";

const CurrentCpu = ({ currentCpu: initialCpu }: { currentCpu: number }) => {
  const [editing, setEditing] = useState(false);
  const [currentCpu, setCurrentCpu] = useState(0);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    setCurrentCpu(initialCpu);
  }, [initialCpu]);

  const handleSave = async () => {
    setLoading(true);
    try {
      // your API call
      await api.post("/cpu", { count: Number(currentCpu) });
      queryClient.invalidateQueries({ queryKey: ["user"] });

      setEditing(false);
    } catch (err) {
      console.error("Failed to update CPU", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div>Max Parallel Execution: </div>

      {editing ? (
        <>
          <Input
            value={currentCpu || ""}
            onChange={(e) => setCurrentCpu(Number(e.target.value))}
            className="w-10"
          />
          <Button onClick={handleSave} variant={"outline"} disabled={loading}>
            {loading ? <Loader className="animate-spin" /> : <Check />}
          </Button>
          <Button onClick={() => setEditing(false)} variant={"outline"}>
            <X />
          </Button>
        </>
      ) : (
        <>
          {currentCpu}
          <Pencil
            size={15}
            className="cursor-pointer"
            onClick={() => setEditing(true)}
          />
        </>
      )}
    </div>
  );
};

export default CurrentCpu;
