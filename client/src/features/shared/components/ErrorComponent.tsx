import React from "react";
import Card from "./ui/Card";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "./ui/Button";
import { useRouter } from "@tanstack/react-router";

const ErrorComponent = () => {
  const router = useRouter();
  return (
    <Card className="flex flex-col items-center justify-center space-y-4">
      <AlertTriangle className="size-8" />
      <p>Something went wrong</p>

      <div className="flex justify-center">
        <Button variant={"ghost"} onClick={() => router.invalidate()}>
          <RefreshCcw />
          Try again
        </Button>
      </div>
    </Card>
  );
};

export default ErrorComponent;
