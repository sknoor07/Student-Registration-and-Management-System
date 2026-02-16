"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    const firstLetter = user?.name?.charAt(0).toUpperCase();

    return (
        <div className="flex items-center justify-between px-6 py-4 bg-zinc-900 border-b border-zinc-800">
            {/* Left Side */}
            <h1 className="text-lg font-bold text-white">SRMS</h1>

            {/* Right Side */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold hover:bg-indigo-700 transition">
                        {firstLetter}
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem
                        onClick={() => router.push("/dashboard/profile")}
                    >
                        Edit Profile
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => router.push("/dashboard/change-password")}
                    >
                        Change Password
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-red-500"
                    >
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
