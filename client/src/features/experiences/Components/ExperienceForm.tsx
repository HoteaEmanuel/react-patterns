import React from "react";
import { z } from "zod";
import { experienceValidationSchema } from "../../../../../shared/schema/experience";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Experience } from "@advanced-react/server/database/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/features/shared/components/ui/Form";
import { trpc } from "@/router";
import Input from "@/features/shared/components/ui/Input";
import Card from "@/features/shared/components/ui/Card";
import { useExperienceMutation } from "../hooks/useExperienceMutation";
import { formData } from "zod-form-data";
import { Button } from "@/features/shared/components/ui/Button";

type ExperienceFormData = z.infer<typeof experienceValidationSchema>;

type ExperienceFormProps = {
  experience: Experience;
  onSuccess: () => void;
};

const ExperienceForm = ({ experience, onSuccess }: ExperienceFormProps) => {
  const form = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceValidationSchema),
    defaultValues: {
      id: experience.id,
      title: experience.title,
      content: experience.content,
      scheduledAt: experience.scheduledAt,
      url: experience.url,
      location: experience.location
        ? JSON.parse(experience.location)
        : undefined,
    },
  });
  const { editMutation } = useExperienceMutation({
    edit: {
      onSuccess,
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    const formData = new FormData();

    for (const [key, value] of Object.entries(data)) {
      if (key === "location") formData.append(key, JSON.stringify(value));
      else formData.append(key, value as string | Blob);
    }

    editMutation.mutate(formData);
  });

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    value={field.value ?? ""}
                    defaultValue={experience.title}
                    placeholder="Experience title"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    value={field.value ?? ""}
                    defaultValue={experience.content}
                    placeholder="Experience content"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormLabel>
            <Button disabled={editMutation.isPending} type="submit" >
              {editMutation.isPending ? "Updating..." : "Edit"}
            </Button>
          </FormLabel>
        </form>
      </Form>
    </Card>
  );
};

export default ExperienceForm;
