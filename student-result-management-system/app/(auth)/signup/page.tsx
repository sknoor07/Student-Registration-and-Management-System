"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const router = useRouter();

    // 🧠 This is where React stores form data in memory
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "student",
    });

    // 🧠 This updates state when user types
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // 🧠 This runs when form is submitted
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log("Signup Data:", formData);

        // 🚦 Later this will call Express
        // await fetch("http://localhost:5000/api/auth/signup", {...})

        router.push("/signin");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <form
                onSubmit={handleSubmit}
                className="bg-zinc-900 p-8 rounded-xl w-full max-w-md space-y-4"
            >
                <h2 className="text-2xl font-bold text-center">Sign Up</h2>

                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    className="w-full p-2 rounded bg-zinc-800"
                    onChange={handleChange}
                />

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

                <select
                    name="role"
                    className="w-full p-2 rounded bg-zinc-800"
                    onChange={handleChange}
                >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                </select>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 p-2 rounded hover:bg-indigo-700"
                >
                    Create Account
                </button>
            </form>
        </div>
    );
}
