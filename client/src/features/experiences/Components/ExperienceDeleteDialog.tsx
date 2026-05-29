import { Button } from "@/features/shared/components/ui/Button";
import {
  DialogHeader,
  DialogFooter,
  DialogDescription,
  DialogTrigger,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/features/shared/components/ui/Dialog";
import { Experience } from "@advanced-react/server/database/schema";
import { useState } from "react";
import { useExperienceMutation } from "../hooks/useExperienceMutation";

type ExperienceDeleteDialogProps = {
  experienceId: Experience["id"];
  onSuccess?: (id: Experience["id"]) => void;
};

const ExperienceDeleteDialog = ({
  experienceId,
  onSuccess,
}: ExperienceDeleteDialogProps) => {
  const [showDeleteExperienceDialog, setShowDeleteExperienceDialog] =
    useState<boolean>(false);

  const { deleteMutation } = useExperienceMutation({
    remove: {
      onSuccess: (id) => {
        setShowDeleteExperienceDialog(false);
        onSuccess?.(id);
      },
    },
  });
  return (
    <Dialog
      open={showDeleteExperienceDialog}
      onOpenChange={setShowDeleteExperienceDialog}
    >
      <DialogTrigger asChild>
        <Button variant={"destructive-link"} className="text-sm">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Experience</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this experience? This action cannot
            be undone
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            onClick={() => setShowDeleteExperienceDialog(false)}
            variant={"link"}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              deleteMutation.mutate({
                id: experienceId,
              });

              setShowDeleteExperienceDialog(false);
            }}
            variant={"destructive-link"}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExperienceDeleteDialog;
