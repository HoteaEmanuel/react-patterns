import { Button } from "@/features/shared/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/features/shared/components/ui/Dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/features/shared/components/ui/Form";
import Input from "@/features/shared/components/ui/Input";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { UserForDetails } from "./types";
import { z } from "zod";
import { userEditSchema } from "../../../../../shared/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/router";
import { useToast } from "@/features/shared/hooks/useToast";

type UserEditData = z.infer<typeof userEditSchema>;

type EditProfileDialogProps = {
  user: UserForDetails;
};

const EditProfileDialog = ({ user }: EditProfileDialogProps) => {
  const utils = trpc.useUtils();
  const { toast } = useToast();

  const form = useForm<UserEditData>({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      name: user.name,
      bio: user?.bio || "",
      photo: undefined,
    },
  });

  const [showEditProfileDialog, setShowEditProfileDialog] =
    useState<boolean>(false);

  const profileEditMutation = trpc.users.edit.useMutation({
    onError: (err) => {
      toast({
        title: "Failed to update profile",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess: async () => {
      await utils.auth.currentUser.invalidate();
      toast({
        title: "Profile updated successfully!",
        variant: "success",
      });

      setShowEditProfileDialog(false);
    },
  });

  const handleSubmit = form.handleSubmit((data) =>
    profileEditMutation.mutate(data),
  );

  return (
    <Dialog
      open={showEditProfileDialog}
      onOpenChange={setShowEditProfileDialog}
    >
      <DialogTrigger asChild>
        <Button
          onClick={() => setShowEditProfileDialog(true)}
          variant={"ghost"}
        >
          Edit profile
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-5 font-semibold">Edit Profile</DialogTitle>

          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder={"Your new name "}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" placeholder={"Bio "} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button type="submit" disabled={profileEditMutation.isPending}>
                  {profileEditMutation.isPending ? "Saving..." : "Save"}
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowEditProfileDialog(false)}
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

export default EditProfileDialog;
