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
import { LocationPicker } from "@/features/shared/components/ui/LocationPicker";
import { DateTimePicker } from "@/features/shared/components/ui/DateTimePicker";

type ExperienceFormData = z.infer<typeof experienceValidationSchema>;

type ExperienceFormProps = {
  experience?: Experience;
  onSuccess: (id: number) => void;
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
      id: experience?.id ?? undefined,
      title: experience?.title ?? "",
      content: experience?.content ?? "",
      scheduledAt: experience?.scheduledAt ? experience.scheduledAt : "",
      url: experience?.url ?? "",
      location: experience?.location
        ? JSON.parse(experience.location)
        : undefined,
    },
  });

  const { editMutation, addMutation } = useExperienceMutation({
    edit: {
      onSuccess,
    },
    add: {
      onSuccess,
    },
  });
  const mutation = experience ? editMutation : addMutation;
  const handleSubmit = form.handleSubmit((data) => {
    const formData = new FormData();

    for (const [key, value] of Object.entries(data)) {
      if (value == null) continue;

      if (key === "location") {
        formData.append(key, JSON.stringify(value));
      } else if (key === "id") {
        formData.append(key, String(value));
      } else {
        formData.append(key, value as string | Blob);
      }
    }

    mutation.mutate(formData);
  });
  return (
    // <Card>
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
                  defaultValue={experience?.title ?? ""}
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
                  defaultValue={experience?.content ?? ""}
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
                  defaultValue={experience?.url ?? ""}
                  placeholder="Experience link"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="scheduledAt"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Scheduled At</FormLabel>
              <FormControl>
                <DateTimePicker {...field} />
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
              <FormLabel>Image</FormLabel>
              <FormControl>
                <FileInput
                  previewUrl={experience?.imageUrl ?? ""}
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

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <LocationPicker value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button
            disabled={mutation.isPending}
            type="button"
            onClick={handleSubmit}
            className="btn"
          >
            {mutation.isPending ? "Updating..." : "Save"}
          </Button>
          <Button type="button" onClick={onClose} variant={"ghost"}>
            Close
          </Button>
        </div>
      </form>
    </Form>
    //  </Card>
  );
};

export default ExperienceForm;
