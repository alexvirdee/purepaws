'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import Link from 'next/link';
import { cn } from "@/lib/utils"


  /* <div className="w-full max-w-sm space-y-6">
            <h1 className="text-xl font-semibold text-center mb-4">Sign In</h1>
            <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
                <div className="mb-4">
                    <Label className="pb-2" htmlFor="email">Email</Label>
                    <Input name="email" type="email" placeholder="you@example.com" required className="border mb-2 p-2 w-full" />
                </div>
                <div className="mb-4">
                    <Label className="pb-2" htmlFor="password">Password</Label>
                    <Input name="password" type="password" placeholder="********" required className="border mb-2 p-2 w-full" />
                </div>
                <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">Sign In</Button>
            </form>
        </div>
        <p className="mt-4 text-sm text-center">
            Don&apos;t have an account yet?{" "}
            <Link href="/auth/signup" className="text-blue-600 hover:underline">
                Sign up here
            </Link>
        </p> */

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = new FormData(e.currentTarget);
        const email = form.get('email') as string;
        const password = form.get('password') as string;

        const result = await signIn('credentials', {
            email,
            password,
            redirect: false, // Prevent automatic redirect
            callbackUrl: '/', // Specify the callback URL
        });

        if (result?.error) {
            toast.error(`Error signing in please try again.`);
        } else {
            localStorage.setItem('signin-success', "true");
            // Redirect to the home page or any other page
            window.location.href = "/";
        }
    };

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your details below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="bark@youhooman.com" required />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input id="password" name="password" type="password" placeholder="********" required />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
        {/* TODO: Uncomment below code when working on Google social login */}
        {/* <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <Button variant="outline" className="w-full">
          Login with Google
        </Button> */}
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </form>
  )
}
