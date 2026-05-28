import ChangeEmailDialog from "@/features/auth/components/ChangeEmailDialog";
import ChangePasswordDialog from "@/features/auth/components/ChangePasswordDialog";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { Button } from "@/features/shared/components/ui/Button";
import Card from "@/features/shared/components/ui/Card";
import { useToast } from "@/features/shared/hooks/useToast";
import { router, trpc } from "@/router";
import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  loader: async ({ context: { trpcQueryUtils } }) => {
    const { currentUser } = await trpcQueryUtils.auth.currentUser.ensureData();

    if (!currentUser) {
      return redirect({ to: "/login" });
    }
  },
});

function SettingsPage() {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const { currentUser } = useCurrentUser();

  const logOutMutation = trpc.auth.logout.useMutation({
    onError: (err) => {
      toast({
        title: "Failed to sign out",
        description: err?.message || "Signing out failed",
        variant: "destructive",
      });
    },
    onSuccess: async () => {
      await utils.auth.currentUser.invalidate();
      toast({
        title: "Signed out successfully",
        variant: "success",
      });

      router.navigate({ to: "/login" });
    },
  });

  const settings = [
    {
      label: currentUser?.email,
      component: <ChangeEmailDialog />,
    },
    {
      label: "********",
      component: <ChangePasswordDialog />,
    },
    {
      label: "Sign out",
      component: (
        <Button
          onClick={() => logOutMutation.mutate()}
          disabled={logOutMutation.isPending}
          variant="destructive"
        >
          {logOutMutation.isPending ? "Signing out" : "Sign out"}
        </Button>
      ),
    },
  ];

  return (
    <main className="space-y-4">
      {settings.map((setting) => (
        <Card key={setting.label} className="flex items-center justify-between">
          <span className="text-neutral-600 dark:text-neutral-300">
            {setting.label}
          </span>

          {setting.component}
        </Card>
      ))}
    </main>
  );
}
