import { Button } from "@/features/shared/components/ui/Button";
import { useToast } from "@/features/shared/hooks/useToast";
import { trpc } from "@/router";
import { Experience } from "@advanced-react/server/database/schema";
import { utimesSync } from "fs";
import { useExperienceMutation } from "../hooks/useExperienceMutation";
import { Heart, HeartCrack } from "lucide-react";

type ExperienceFavoriteButtonProps = {
  experienceId: Experience["id"];
  isFavorited: boolean;
  favoritesCount: number;
};

const ExperienceFavoriteButton = ({
  experienceId,
  favoritesCount,
  isFavorited,
}: ExperienceFavoriteButtonProps) => {
  const { favoriteMutation, unfavoriteMutation } = useExperienceMutation({});
  return (
    <Button
      variant={"ghost"}
      onClick={() => {
        if (isFavorited) unfavoriteMutation.mutate({ id: experienceId });
        else favoriteMutation.mutate({ id: experienceId });
      }}
      disabled={favoriteMutation.isPending || unfavoriteMutation.isPending}
    >
      <Heart
        className={isFavorited ? "size-4 fill-red-500 text-red-500" : "size-4"}
      />
      {favoritesCount}
    </Button>
  );
};

export default ExperienceFavoriteButton;
