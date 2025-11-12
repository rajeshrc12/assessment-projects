import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="flex flex-col gap-2 w-[200px]">
        <div className="font-bold text-xl">Job Scheduler</div>
        <Input type="text" placeholder="username" />
        <Link href={"/dashboard"}>
          <Button className="w-full">Login</Button>
        </Link>
      </div>
    </div>
  );
}
