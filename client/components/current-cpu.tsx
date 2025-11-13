import { useEffect, useState } from "react";
import { Check, Loader, Pencil, X } from "lucide-react";
import api from "@/lib/api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const CurrentCpu = ({
  currentCpu: initialCpu,
  availableCpu,
}: {
  currentCpu: number;
  availableCpu: number;
}) => {
  const [editing, setEditing] = useState(false);
  const [currentCpu, setCurrentCpu] = useState(0);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    setCurrentCpu(initialCpu);
  }, [initialCpu]);

  const handleSave = async () => {
    if (Number(currentCpu) == Number(initialCpu)) {
      toast.error("Enter a new value");
      return;
    }

    if (currentCpu > availableCpu) {
      toast.error(`You can use up to ${availableCpu} CPU cores only`);
      return;
    }

    if (currentCpu < 1) {
      toast.error("Enter a CPU value of at least 1");
      return;
    }

    setLoading(true);
    try {
      const cpu = await api.post("/cpu", { count: Number(currentCpu) });
      if (cpu.status === 200) {
        toast.success("CPU Max limit updated");
        queryClient.invalidateQueries({ queryKey: ["user"] });
      }

      setEditing(false);
    } catch (err) {
      console.error("Failed to update CPU", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div>Max Parallel Execution per Job: </div>

      {editing ? (
        <>
          <Input
            value={currentCpu}
            type="number"
            onChange={(e) => setCurrentCpu(Number(e.target.value))}
            className="w-14"
          />
          <Button onClick={handleSave} variant={"outline"} disabled={loading}>
            {loading ? <Loader className="animate-spin" /> : <Check />}
          </Button>
          <Button
            onClick={() => {
              setEditing(false);
              setCurrentCpu(initialCpu);
            }}
            variant={"outline"}
          >
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
