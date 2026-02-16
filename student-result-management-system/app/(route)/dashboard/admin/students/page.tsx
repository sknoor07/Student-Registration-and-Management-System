"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Student {
    id: number;
    name: string;
    email: string;
    role: "student" | "admin";
}

export default function AdminStudents() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Student | null>(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        role: "student",
    });

    // =============================
    // FETCH STUDENTS
    // =============================
    const fetchStudents = async () => {
        try {
            const res = await api.get("/admin/students/details");
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

    // =============================
    // CREATE / UPDATE STUDENT
    // =============================
    const handleSubmit = async () => {
        try {
            if (editing) {
                await api.put(`/admin/students/${editing.id}`, form);
            } else {
                await api.post("/admin/students", form);
            }

            setOpen(false);
            fetchStudents();
        } catch (err: any) {
            alert(err.response?.data?.message || "Error occurred");
        }
    };

    // =============================
    // DELETE STUDENT
    // =============================
    const handleDelete = async (id: number) => {
        const confirmDelete = confirm("Are you sure you want to delete this student?");
        if (!confirmDelete) return;

        try {
            await api.delete(`/admin/students/${id}`);
            fetchStudents();
        } catch (err: any) {
            alert(err.response?.data?.message || "Delete failed");
        }
    };

    // =============================
    // OPEN MODAL
    // =============================
    const openModal = (student?: Student) => {
        if (student) {
            setEditing(student);
            setForm({
                name: student.name,
                email: student.email,
                role: student.role,
            });
        } else {
            setEditing(null);
            setForm({
                name: "",
                email: "",
                role: "student",
            });
        }

        setOpen(true);
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Students</h1>
                <Button
                    onClick={() => openModal()}
                    className="bg-indigo-600 hover:bg-indigo-700"
                >
                    + Add Student
                </Button>
            </div>

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
                                <td className="px-4 py-2 capitalize">{student.role}</td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => openModal(student)}
                                        className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-white mr-2"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(student.id)}
                                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* MODAL */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="bg-gray-900 border border-gray-700 text-white rounded-2xl max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editing ? "Edit Student" : "Add Student"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col gap-4 mt-4">
                        <Input
                            placeholder="Full Name"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                        />

                        <Input
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                        />

                        <select
                            className="bg-gray-800 border border-gray-700 p-2 rounded"
                            value={form.role}
                            onChange={(e) =>
                                setForm({ ...form, role: e.target.value as any })
                            }
                        >
                            <option value="student">Student</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button
                            className="w-full bg-indigo-600 hover:bg-indigo-700"
                            onClick={handleSubmit}
                        >
                            {editing ? "Update Student" : "Create Student"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
