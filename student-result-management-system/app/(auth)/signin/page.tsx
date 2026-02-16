"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signin() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log("Signin Data:", formData);

        // Later:
        // Send to backend → get JWT cookie

        router.push("/dashboard/student"); // temporary
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <form
                onSubmit={handleSubmit}
                className="bg-zinc-900 p-8 rounded-xl w-full max-w-md space-y-4"
            >
                <h2 className="text-2xl font-bold text-center">Sign In</h2>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full p-2 rounded bg-zinc-800"
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full p-2 rounded bg-zinc-800"
                    onChange={handleChange}
                />

                <button
                    type="submit"
                    className="w-full bg-indigo-600 p-2 rounded hover:bg-indigo-700"
                >
                    Login
                </button>
            </form>
        </div>
    );
}
