"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EditProfile() {
    const { user, setUser } = useAuth();

    const [form, setForm] = useState({
        name: "",
        email: "",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name ?? "",
                email: user.email ?? "",
            });
        }
    }, [user]);


    const handleSubmit = async () => {
        try {
            setLoading(true);

            const res = await api.put("/auth/update-profile", form);

            setUser(res.data.user); // update context
            alert("Profile updated successfully");
        } catch (err: any) {
            alert(err.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-md">
            <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

            <div className="space-y-4">
                <Input
                    placeholder="Full Name"
                    value={form.name || ""}
                    onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                    }
                />

                <Input
                    type="email"
                    placeholder="Email"
                    value={form.email || ""}
                    onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                    }
                />


                <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                    {loading ? "Updating..." : "Save Changes"}
                </Button>
            </div>
        </div>
    );
}
