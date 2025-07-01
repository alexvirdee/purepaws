'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignUp() {
    const router = useRouter();
    const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check that passwords match
        if (form.password !== form.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        const res = await fetch("/api/auth/signup", {
            method: "POST",
            body: JSON.stringify(form),
            headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        if (!res.ok) {
            toast.error(data.message || "Something went wrong");
        } else {
            toast.success("Account created! Please sign in.");
            router.push("/auth/signin");
        }
    };


    return (
        <section className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <div className="w-full max-w-sm space-y-6">
                <h1 className="text-2xl font-semibold text-center">Sign Up</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="mb-4">
                        <Label className="pb-2" htmlFor="email">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            type="name"
                            placeholder="John Doe"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <Label className="pb-2" htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <Label className="pb-2" htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="********"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <Label className="pb-2" htmlFor="password">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="********"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full">
                        Create Account
                    </Button>
                </form>
            </div>
        </section>
    )
}
