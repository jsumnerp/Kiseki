import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

const loginFormSchema = z.object({
  email: z.email(),
});

interface LoginFormProps {
  onLogin: (email: string) => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    const { error } = await supabase.auth.signInWithOtp({
      email: values.email,
    });

    if (error) {
      alert(error.message);
    } else {
      onLogin(values.email);
    }
  }

  return (
    <div className="size-full flex items-center justify-center flex-col gap-4">
      <Form {...form}>
        <div className="w-10/12 max-w-lg gap-4 min-h-full flex flex-col">
          <h2 className="text-lg font-bold text-left w-full">Login</h2>
          <p>Please enter your email to receive a one time password.</p>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 w-full"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </div>
      </Form>
    </div>
  );
};
