import React from "react";
import {
  ExperienceFilterParams,
  experienceFiltersSchema,
} from "../../../../../shared/schema/experience";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/features/shared/components/ui/Form";
import Card from "@/features/shared/components/ui/Card";
import Input from "@/features/shared/components/ui/Input";
import { Search } from "lucide-react";
import { Button } from "@/features/shared/components/ui/Button";
import { Tag } from "@advanced-react/server/database/schema";
import { MultiSelect } from "@/features/shared/components/ui/MultiSelect";
import { DateTimePicker } from "@/features/shared/components/ui/DateTimePicker";
import { file } from "zod-form-data";

type ExperienceFiltersProps = {
  initialFilters?: ExperienceFilterParams;
  tags: Tag[];
  onFiltersChange: (filters: ExperienceFilterParams) => void;
};

const ExperienceFilters = ({
  initialFilters,
  tags,
  onFiltersChange,
}: ExperienceFiltersProps) => {
  const form = useForm<ExperienceFilterParams>({
    resolver: zodResolver(experienceFiltersSchema),
    defaultValues: initialFilters,
  });
  const handleSubmit = form.handleSubmit((data) => {
    const filters: ExperienceFilterParams = {};
    if (data?.q?.trim()) {
      filters.q = data.q;
    }

    if (data.tags) {
      filters.tags = data.tags;
    }

    if (data.scheduledAt) filters.scheduledAt = data.scheduledAt;

    onFiltersChange(filters);
  });
  return (
    <Form {...form}>
      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="q"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      {...field}
                      type="search"
                      value={field.value ?? ""}
                      placeholder="Search experiences..."
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
                  <FormControl>
                    <DateTimePicker {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <MultiSelect
                options={tags.map((t) => ({
                  value: t.id.toString(),
                  label: t.name,
                }))}
                onValueChange={(tags) => {
                  field.onChange(tags.map(Number));
                }}
                defaultValue={field.value?.map((tag) => tag.toString())}
                placeholder="Select tags"
              />
            )}
          />

          <Button type="submit" disabled={form.formState.isSubmitting}>
            <Search className="size-6" />
            Search
          </Button>
        </form>
      </Card>
    </Form>
  );
};

export default ExperienceFilters;
