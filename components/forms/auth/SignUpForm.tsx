'use client';

import { useState } from "react";
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import Link from 'next/link';
import { cn } from "@/lib/utils"
import { LoaderIcon } from "lucide-react";


export function SignUpForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [signingUp, setSigningUp] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setSigningUp(true);

        // Check that passwords match
        if (form.password !== form.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                body: JSON.stringify(form),
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message || "Something went wrong");
            } else {
                toast.success("Account created! Logging you in...");

                // Immediately log in the user after signup
                const result = await signIn("credentials", {
                    redirect: true,
                    email: form.email,
                    password: form.password,
                    callbackUrl: "/",
                });
            }
        } catch (error) {
            console.error("Error signing up:", error);
            toast.error("An error occurred while signing up. Please try again.");
        } finally {
            setSigningUp(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Sign up</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    Sign up to find your future best friend with PurePaws
                </p>
            </div>
            <div className="grid gap-6">
                <div className="grid gap-3">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" type="name" placeholder="Jax" value={form.name} onChange={handleChange} required />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="bark@youhooman.com" value={form.email} onChange={handleChange} required />
                </div>
                <div className="grid gap-3">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                    </div>
                    <Input id="password" name="password" type="password" placeholder="********" value={form.password} onChange={handleChange} required />
                </div>
                <div className="grid gap-3">
                    <div className="flex items-center">
                        <Label htmlFor="password">Confirm Password</Label>
                    </div>
                    <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="********" value={form.confirmPassword} onChange={handleChange} required />
                </div>

                <Button disabled={signingUp} type="submit" className="w-full">
                    {signingUp ? (
                        <>
                            <LoaderIcon /> Signing up...
                        </>
                    ) : (
                        <>
                            Sign up
                        </>
                    )}
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
                Already have an account?
                <Link href="/auth/signin" className="ml-2 underline underline-offset-4">
                    Sign in
                </Link>
            </div>
        </form>
    )
}
