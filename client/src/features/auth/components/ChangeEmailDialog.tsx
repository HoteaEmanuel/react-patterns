import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  changeEmailSchema,
} from "../../../../../shared/schema/auth";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/features/shared/components/ui/Dialog";
import { Button } from "@/features/shared/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/features/shared/components/ui/Form";
import { trpc } from "@/router";
import { useToast } from "@/features/shared/hooks/useToast";
import Input from "@/features/shared/components/ui/Input";
import { Eye, EyeOff } from "lucide-react";

type EmailDialogData = z.infer<typeof changeEmailSchema>;

const ChangeEmailDialog = () => {
  const [showEmailChangeDialog, setShowEmailChangeDialog] =
    useState<boolean>(false);
  const form = useForm<EmailDialogData>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const changeEmailMutation = trpc.auth.changeEmail.useMutation({
    onError: (err) => {
      toast({
        title: "Failed to change email",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess: async () => {
      await utils.auth.currentUser.invalidate();
      toast({
        title: "Email was changed succesfully!",
        variant: "success",
      });

      setShowEmailChangeDialog(false);
    },
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const handleSubmit = form.handleSubmit((data) =>
    changeEmailMutation.mutate(data),
  );

  return (
    <Dialog
      open={showEmailChangeDialog}
      onOpenChange={setShowEmailChangeDialog}
    >
      <DialogTrigger asChild>
        <Button
          onClick={() => setShowEmailChangeDialog(true)}
          variant={"ghost"}
        >
          Change email
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-5 font-semibold">Change email</DialogTitle>

          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder={"Your new email "}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <div className="relative">
                    <FormItem className="flex-1">
                      <FormLabel> Password </FormLabel>

                      <FormControl>
                        <div className="relative flex items-center">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            value={field.value ?? ""}
                            placeholder="********"
                            className="pr-5"
                          />

                          <Button
                            type="button"
                            variant="ghost"
                            className="absolute right-2 h-0 p-0 text-inherit"
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {!showPassword ? (
                              <Eye className="size-4" />
                            ) : (
                              <EyeOff className="size-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                )}
              />
              <div className="flex gap-4">
                <Button type="submit" disabled={changeEmailMutation.isPending}>
                  {changeEmailMutation.isPending ? "Saving..." : "Save"}
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowEmailChangeDialog(false)}
                  variant={"link"}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeEmailDialog;
