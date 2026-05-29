import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/features/shared/components/ui/Form";
import Input from "@/features/shared/components/ui/Input";
import { useToast } from "@/features/shared/hooks/useToast";
import { trpc } from "@/router";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/features/shared/components/ui/Dialog";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { changePasswordSchema } from "../../../../../shared/schema/auth";
import { z } from "zod";
import { Button } from "@/features/shared/components/ui/Button";

type ChangePasswordData = z.infer<typeof changePasswordSchema>;

const ChangePasswordDialog = () => {
  const [showChangePasswordDialog, setShowChangePasswordDialog] =
    useState<boolean>(false);
  const form = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const changePasswordMutation = trpc.auth.changePassword.useMutation({
    onError: (err) => {
      toast({
        title: "Failed to change password",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess: async () => {
      await utils.auth.currentUser.invalidate();
      toast({
        title: "Password was changed succesfully!",
        variant: "success",
      });

      setShowChangePasswordDialog(false);
    },
  });
  const [showCurrentPassword, setShowCurrentPassword] =
    useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const handleSubmit = form.handleSubmit((data) =>
    changePasswordMutation.mutate(data),
  );

  return (
    <Dialog
      open={showChangePasswordDialog}
      onOpenChange={setShowChangePasswordDialog}
    >
      <DialogTrigger asChild>
        <Button
          onClick={() => setShowChangePasswordDialog(true)}
          variant={"ghost"}
        >
          Change password
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-5 font-semibold">
            Change password
          </DialogTitle>

          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <div className="relative">
                    <FormItem className="flex-1">
                      <FormLabel> Current password </FormLabel>

                      <FormControl>
                        <div className="relative flex items-center">
                          <Input
                            {...field}
                            type={showCurrentPassword ? "text" : "password"}
                            value={field.value ?? ""}
                            placeholder="********"
                            className="pr-5"
                          />

                          <Button
                            type="button"
                            variant="ghost"
                            className="absolute right-2 h-0 p-0 text-inherit"
                            onClick={() =>
                              setShowCurrentPassword((prev) => !prev)
                            }
                          >
                            {!showCurrentPassword ? (
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

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <div className="relative">
                    <FormItem className="flex-1">
                      <FormLabel> New password </FormLabel>

                      <FormControl>
                        <div className="relative flex items-center">
                          <Input
                            {...field}
                            type={showNewPassword ? "text" : "password"}
                            value={field.value ?? ""}
                            placeholder="********"
                            className="pr-5"
                          />

                          <Button
                            type="button"
                            variant="ghost"
                            className="absolute right-2 h-0 p-0 text-inherit"
                            onClick={() => setShowNewPassword((prev) => !prev)}
                          >
                            {!showNewPassword ? (
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
              <DialogFooter>
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={changePasswordMutation.isPending}
                  >
                    {changePasswordMutation.isPending ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowChangePasswordDialog(false)}
                    variant={"link"}
                  >
                    Cancel
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
