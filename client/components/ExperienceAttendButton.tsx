import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { Button } from "@/features/shared/components/ui/Button";
import { Experience } from "@advanced-react/server/database/schema";
import { useExperienceMutation } from "../hooks/useExperienceMutation";

type ExperienceAttendButtonProps = {
  experienceId: Experience["id"];
  isAttending: boolean;
};

const ExperienceAttendButton = ({
  experienceId,
  isAttending,
}: ExperienceAttendButtonProps) => {
  const { currentUser } = useCurrentUser();
  if (!currentUser) return null;
  if (currentUser.id === experienceId) return null;
  const { attendMutation, unattendMutation } = useExperienceMutation({});
  return (
    <Button
      variant={isAttending ? "outline" : "default"}
      onClick={() => {
        if (isAttending) {
          // Cancel attendance
          unattendMutation.mutate({ id: experienceId });
        } else {
          // Attend experience
          attendMutation.mutate({ id: experienceId });
        }
      }}
      disabled={attendMutation.isPending}
    >
      {isAttending ? "Cancel Attendance" : "Attend"}
    </Button>
  );
};

export default ExperienceAttendButton;
