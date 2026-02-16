"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";

interface Student {
    id: number;
    name: string;
    email: string;
    role: "student" | "admin";
}

export default function AdminStudents() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchStudents = async () => {
        try {
            const res = await api.get("/admin/students/details");
            console.log("All students: " + res?.data?.student);
            setStudents(res?.data?.student);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Manage Students</h1>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-800 text-left">
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Role</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.id} className="border-b border-gray-700">
                                <td className="px-4 py-2">{student.name}</td>
                                <td className="px-4 py-2">{student.email}</td>
                                <td className="px-4 py-2">{student.role}</td>
                                <td className="px-4 py-2">
                                    <button className="bg-indigo-600 hover:bg-indigo-700 px-2 py-1 rounded text-white mr-2">
                                        Edit
                                    </button>
                                    <button className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-white">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
