import { userCredentialsSchema } from "../../../../../shared/schema/auth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/features/shared/components/ui/Form";
import Input from "@/features/shared/components/ui/Input";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/features/shared/components/ui/Button";
import { router, trpc } from "@/router";
import { useToast } from "@/features/shared/hooks/useToast";
import { useState } from "react";
import Link from "@/features/shared/components/ui/Link";
type RegisterData = z.infer<typeof userCredentialsSchema>;
const RegisterForm = () => {
  const utils = trpc.useUtils();
  const { toast } = useToast();
  const form = useForm<RegisterData>({
    resolver: zodResolver(userCredentialsSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const registerMutation = trpc.auth.register.useMutation({
    onError: (err) => {
      toast({
        title: "Failed to register",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess: async () => {
      await utils.auth.currentUser.invalidate();
      toast({
        title: "Signed up succesfully",
        description: "Your account was created!",
        variant: "success",
      });

      return router.navigate({ to: "/" });
    },
  });

  const handleSubmit = form.handleSubmit((data) =>
    registerMutation.mutate(data),
  );
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h2 className="text-center text-2xl font-bold">Create a new account</h2>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  value={field.value ?? ""}
                  placeholder="Your name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  value={field.value ?? ""}
                  placeholder="Email"
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
                      className="pr-6"
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      className="absolute right-2 h-0 p-0"
                      onClick={() => setShowPassword((prev: boolean) => !prev)}
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

        <Button type="submit" disabled={registerMutation.isPending}>
          {registerMutation.isPending ? "Creating account..." : "Register"}
        </Button>
      </form>

      <span className="mt-5 flex justify-center gap-2">
        Already have an account ? -{" "}
        <Link to="/login" variant={"secondary"}>
          Log in
        </Link>
      </span>
    </Form>
  );
};

export default RegisterForm;
