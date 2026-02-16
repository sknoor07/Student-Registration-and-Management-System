"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ChangePassword() {
    const [form, setForm] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (form.newPassword !== form.confirmPassword) {
            return alert("Passwords do not match");
        }

        try {
            setLoading(true);

            await api.put("/auth/change-password", {
                oldPassword: form.oldPassword,
                newPassword: form.newPassword,
            });

            alert("Password changed successfully");

            setForm({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (err: any) {
            alert(err.response?.data?.message || "Change failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-md">
            <h1 className="text-2xl font-bold mb-6">Change Password</h1>

            <div className="space-y-4">
                <Input
                    type="password"
                    placeholder="Current Password"
                    value={form.oldPassword}
                    onChange={(e) =>
                        setForm({ ...form, oldPassword: e.target.value })
                    }
                />

                <Input
                    type="password"
                    placeholder="New Password"
                    value={form.newPassword}
                    onChange={(e) =>
                        setForm({ ...form, newPassword: e.target.value })
                    }
                />

                <Input
                    type="password"
                    placeholder="Confirm New Password"
                    value={form.confirmPassword}
                    onChange={(e) =>
                        setForm({ ...form, confirmPassword: e.target.value })
                    }
                />

                <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                    {loading ? "Updating..." : "Change Password"}
                </Button>
            </div>
        </div>
    );
}
