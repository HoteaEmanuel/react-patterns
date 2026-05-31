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

type ExperienceFiltersProps = {
  initialFilters?: ExperienceFilterParams;
  onFiltersChange: (filters: ExperienceFilterParams) => void;
};

const ExperienceFilters = ({
  initialFilters,
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

    onFiltersChange(filters);
  });
  return (
    <Form {...form}>
      <Card>
        <form onSubmit={handleSubmit} className="flex gap-4">
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
