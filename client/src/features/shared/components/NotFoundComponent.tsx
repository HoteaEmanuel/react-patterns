import React from "react";
import Card from "./ui/Card";
import { AlertCircle } from "lucide-react";

const NotFoundComponent = () => {
  return (
    <Card className="flex flex-col items-center justify-center space-y-2">
      <AlertCircle className="size-8" />
      <p className="text-2xl font-semibold">Not found</p>
      <p className="text-sm">The page you are looking for does not exist</p>
    </Card>
  );
};

export default NotFoundComponent;
