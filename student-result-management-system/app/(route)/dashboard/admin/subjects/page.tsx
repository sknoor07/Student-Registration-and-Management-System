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

interface Courses {
    id: number;
    name: string;
    code: string;
    credits: number;
    department: string;
    year: number;
}

export default function AdminSubjects() {
    const [subjects, setSubjects] = useState<Courses[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Courses | null>(null);

    const [form, setForm] = useState({
        name: "",
        code: "",
        credits: "",
        department: "",
        year: "",
    });

    // =============================
    // FETCH SUBJECTS
    // =============================
    const fetchSubjects = async () => {
        try {
            const res = await api.get("/admin/courses");
            setSubjects(res?.data?.courses);
        } catch (err: any) {
            console.error(err?.response?.data?.message || "Error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    // =============================
    // HANDLE CREATE / UPDATE
    // =============================
    const handleSubmit = async () => {
        try {
            const payload = {
                name: form.name,
                code: form.code,
                credits: Number(form.credits),
                department: form.department,
                year: Number(form.year),
            };

            if (editing) {
                await api.put(`/admin/courses/${editing.id}`, payload);
            } else {
                await api.post("/admin/courses", payload);
            }

            setOpen(false);
            fetchSubjects();
        } catch (err: any) {
            alert(err.response?.data?.message || "Error occurred");
        }
    };

    // =============================
    // HANDLE DELETE
    // =============================
    const handleDelete = async (id: number) => {
        const confirmDelete = confirm("Are you sure you want to delete this subject?");
        if (!confirmDelete) return;

        try {
            await api.delete(`/admin/courses/${id}`);
            fetchSubjects();
        } catch (err: any) {
            alert(err.response?.data?.message || "Delete failed");
        }
    };

    // =============================
    // OPEN MODAL
    // =============================
    const openModal = (subject?: Courses) => {
        if (subject) {
            setEditing(subject);
            setForm({
                name: subject.name,
                code: subject.code,
                credits: String(subject.credits),
                department: subject.department,
                year: String(subject.year),
            });
        } else {
            setEditing(null);
            setForm({
                name: "",
                code: "",
                credits: "",
                department: "",
                year: "",
            });
        }

        setOpen(true);
    };

    return (
        <div className="p-8">

            {/* Header Section */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Manage Subjects</h1>

                <Button
                    onClick={() => openModal()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                >
                    + Add Subject
                </Button>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-800 text-left">
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Code</th>
                            <th className="px-4 py-2">Credits</th>
                            <th className="px-4 py-2">Department</th>
                            <th className="px-4 py-2">Year</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.map((subject) => (
                            <tr key={subject.id} className="border-b border-gray-700">
                                <td className="px-4 py-2">{subject.name}</td>
                                <td className="px-4 py-2">{subject.code}</td>
                                <td className="px-4 py-2">{subject.credits}</td>
                                <td className="px-4 py-2">{subject.department}</td>
                                <td className="px-4 py-2">{subject.year}</td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => openModal(subject)}
                                        className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-white mr-2"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(subject.id)}
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
                <DialogContent className="bg-gray-900 border border-gray-700 text-white rounded-2xl shadow-2xl max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editing ? "Edit Subject" : "Add Subject"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col gap-4 mt-4">
                        <Input
                            placeholder="Subject Name"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                        />

                        <Input
                            placeholder="Code"
                            value={form.code}
                            onChange={(e) =>
                                setForm({ ...form, code: e.target.value })
                            }
                        />

                        <Input
                            type="number"
                            placeholder="Credits"
                            value={form.credits}
                            onChange={(e) =>
                                setForm({ ...form, credits: e.target.value })
                            }
                        />

                        <Input
                            placeholder="Department"
                            value={form.department}
                            onChange={(e) =>
                                setForm({ ...form, department: e.target.value })
                            }
                        />

                        <Input
                            type="number"
                            placeholder="Year"
                            value={form.year}
                            onChange={(e) =>
                                setForm({ ...form, year: e.target.value })
                            }
                        />
                    </div>

                    <DialogFooter className="mt-6">
                        <Button
                            className="w-full bg-indigo-600 hover:bg-indigo-700"
                            onClick={handleSubmit}
                        >
                            {editing ? "Update Subject" : "Create Subject"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
