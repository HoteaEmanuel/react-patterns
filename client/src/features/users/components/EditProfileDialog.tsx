import { Button } from "@/features/shared/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { userEditSchema } from "../../../../../shared/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/router";
import { useToast } from "@/features/shared/hooks/useToast";
import { User } from "@advanced-react/server/database/schema";

type UserEditData = z.infer<typeof userEditSchema>;

type EditProfileDialogProps = {
  user: User;
};

const EditProfileDialog = ({ user }: EditProfileDialogProps) => {
  const utils = trpc.useUtils();
  const { toast } = useToast();

  const form = useForm<UserEditData>({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      id: user.id,
      name: user.name,
      bio: user.bio ?? "",
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
    onSuccess: async ({ id }) => {
      await Promise.all([
        utils.users.byId.invalidate({ id }),
        utils.auth.currentUser.invalidate(),
      ]);
      toast({
        title: "Profile updated successfully!",
        variant: "success",
      });

      setShowEditProfileDialog(false);
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    const formData = new FormData();

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null)
        formData.append(key, value as string | Blob);
    }
    profileEditMutation.mutate(formData);
  });

  return (
    <Dialog
      open={showEditProfileDialog}
      onOpenChange={setShowEditProfileDialog}
    >
      <DialogTrigger asChild>
        <Button
          onClick={() => setShowEditProfileDialog(true)}
          variant={"ghost"}
          className="mx-auto"
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
                name="bio"
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
              <DialogFooter>
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={profileEditMutation.isPending}
                  >
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
              </DialogFooter>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
