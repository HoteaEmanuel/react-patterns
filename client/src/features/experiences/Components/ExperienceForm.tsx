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
import Input from "@/features/shared/components/ui/Input";
import Card from "@/features/shared/components/ui/Card";
import { useExperienceMutation } from "../hooks/useExperienceMutation";
import { Button } from "@/features/shared/components/ui/Button";
import FileInput from "@/features/shared/components/ui/FileInput";

type ExperienceFormData = z.infer<typeof experienceValidationSchema>;

type ExperienceFormProps = {
  experience: Experience;
  onSuccess: () => void;
  onClose: () => void;
};

const ExperienceForm = ({
  experience,
  onSuccess,
  onClose,
}: ExperienceFormProps) => {
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

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Link</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    value={field.value ?? ""}
                    defaultValue={experience.content}
                    placeholder="Experience link"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Link</FormLabel>
                <FormControl>
                  <FileInput
                    previewUrl={experience.imageUrl ?? ""}
                    accept="image/*"
                    onChange={(event) =>
                      field.onChange(event?.target?.files?.[0])
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormLabel className="flex justify-end gap-2">
            <Button disabled={editMutation.isPending} type="submit">
              {editMutation.isPending ? "Updating..." : "Edit"}
            </Button>

            <Button onClick={onClose} variant={"ghost"}>
              Close
            </Button>
          </FormLabel>
        </form>
      </Form>
    </Card>
  );
};

export default ExperienceForm;
