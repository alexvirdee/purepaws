'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';

export default function SignIn() {
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
        <section className="flex flex-col items-center justify-center min-h-[40vh] px-4">
            <div className="w-full max-w-sm space-y-6">
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
        </section>
    )
}