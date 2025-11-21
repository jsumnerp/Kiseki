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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { supabase } from "@/lib/supabase";

const otpFormSchema = z.object({
  token: z.string().regex(/^\d{6}$/, "Code must be exactly 6 digits"),
});

interface OTPFormProps {
  email: string;
  handleGoBack: () => void;
}

export const OTPForm = ({ email, handleGoBack }: OTPFormProps) => {
  const form = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      token: "",
    },
  });

  async function onSubmit(values: z.infer<typeof otpFormSchema>) {
    const { error } = await supabase.auth.verifyOtp({
      email: email,
      token: values.token,
      type: "email",
    });

    if (error) {
      alert(error.message);
    }
  }

  const handleResendCode = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      alert(error.message);
    }
  };

  return (
    <div className="size-full flex items-center justify-center flex-col gap-4">
      <Form {...form}>
        <div className="w-10/12 max-w-lg gap-4 min-h-full flex flex-col">
          <h2 className="text-lg font-bold text-left w-full">OTP Password</h2>
          <p>Please enter your one-time password for {email}</p>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 w-full"
          >
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button type="button" variant="outline" onClick={handleResendCode}>
              Resend Code
            </Button>
            <Button type="button" variant="destructive" onClick={handleGoBack}>
              Back
            </Button>
          </form>
        </div>
      </Form>
    </div>
  );
};
