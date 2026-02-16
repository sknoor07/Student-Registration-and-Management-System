"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

export default function Signin() {
    const router = useRouter();
    const { refreshUser } = useAuth();
    const { signin, user } = useAuth();
    const [error, setError] = useState<string | null>(null);


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

        try {
            const user = await signin(formData.email, formData.password);

            if (user?.role === "admin") {
                router.push("/dashboard/admin");
            } else {
                router.push("/dashboard/student");
            }

        } catch (error: any) {
            const message = error.response?.data?.message;
            setError(message);
        }
        console.error("Login failed");
    }



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

                {error && (
                    <p className="text-red-500 text-sm text-center">
                        {error}
                    </p>
                )}

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
