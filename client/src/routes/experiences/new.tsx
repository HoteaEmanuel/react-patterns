import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import ExperienceForm from "@/features/experiences/components/ExperienceForm";
import Card from "@/features/shared/components/ui/Card";
import { router } from "@/router";

export const Route = createFileRoute("/experiences/new")({
  component: NewExperiencePage,
});

function NewExperiencePage() {
  const navigate = Route.useNavigate();
  function handleSuccess(id: number) {
    navigate({
      to: "/experiences/$experienceId",
      params: { experienceId: id },
    });
  }
  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold">Create Experience</h1>
      <Card>
        <ExperienceForm
          onClose={() => router.history.back()}
          onSuccess={handleSuccess}
        />
      </Card>
    </main>
  );
}
