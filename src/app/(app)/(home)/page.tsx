import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

export const metadata: Metadata = {
  title: "Dabro | Home",
  description: "Dabro's homepage",
};

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center p-10 gap-y-8">
      <div>
        <Button variant={"elevated"}>Click Me</Button>
      </div>
      <div>
        <Input placeholder="Please type your input here" />
      </div>

      <Progress value={33} />

      <div>
        <Textarea placeholder="Please type your information here" />
      </div>
    </div>
  );
}
