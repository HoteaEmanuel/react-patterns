import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { Button } from "@/features/shared/components/ui/Button";
import { Experience, User } from "@advanced-react/server/database/schema";
import { useExperienceMutation } from "../hooks/useExperienceMutation";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/features/shared/components/ui/Dialog";

import { useState } from "react";

type ExperienceKickButtonProps = {
  experienceId: Experience["id"];
  userId: User["id"];
};
const ExperienceKickButton = ({
  experienceId,
  userId,
}: ExperienceKickButtonProps) => {
  const { currentUser } = useCurrentUser();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  if (!currentUser) return null;
  const { kickMutation } = useExperienceMutation({
    kick: {
      onSuccess: () => {
        setIsOpen(false);
      },
    },
  });
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"destructive-link"} className="text-sm">
          Kick
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kick attendee?</DialogTitle>
          <DialogDescription>
            Are you sure you want to kick this person? This action cannot
            be undone
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button onClick={() => setIsOpen(false)} variant={"link"}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              kickMutation.mutate({
                experienceId,
                userId,
              });

              setIsOpen(false);
            }}
            variant={"destructive-link"}
            disabled={kickMutation.isPending}
          >
            {kickMutation.isPending ? "Kicking out..." : "Kick"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default ExperienceKickButton;
