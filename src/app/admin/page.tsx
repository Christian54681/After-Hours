"use client";

import { useState } from "react";
import Link from "next/link";

interface Branch {
    id: number;
    name: string;
    category: string;
    location: string;
    manager: string;
    createdAt: string;
}

interface Employee {
    id: number;
    name: string;
    branch: string;
    position: string;
    phone: string;
    email: string;
    createdAt: string;
}

interface Supplier {
    id: number;
    name: string;
    company: string;
    phone: string;
    email: string;
    createdAt: string;
}

const initialBranches: Branch[] = [
    {
        id: 1,
        name: "Lounge Noir",
        category: "Ejecutivo",
        location: "Av. Reforma 234, CDMX",
        manager: "Carlos Mendoza",
        createdAt: "12/03/2024",
    },
    {
        id: 2,
        name: "Sunset Breeze",
        category: "Playa",
        location: "Zona Costera, Cancún",
        manager: "Mariana López",
        createdAt: "05/02/2024",
    },
    {
        id: 3,
        name: "Campus Bar",
        category: "Universitario",
        location: "Cerca de CU, CDMX",
        manager: "Luis Ramírez",
        createdAt: "18/01/2024",
    },
    {
        id: 4,
        name: "Golden Hour",
        category: "Ejecutivo",
        location: "San Pedro Garza García, Monterrey",
        manager: "Andrea Torres",
        createdAt: "22/02/2024",
    },
    {
        id: 5,
        name: "La Esquina",
        category: "Normal",
        location: "Centro Histórico, Puebla",
        manager: "Jorge Castillo",
        createdAt: "10/03/2024",
    },
    {
        id: 6,
        name: "Mar Azul",
        category: "Playa",
        location: "Puerto Escondido, Oaxaca",
        manager: "Fernanda Cruz",
        createdAt: "28/01/2024",
    },
    {
        id: 7,
        name: "After Class",
        category: "Universitario",
        location: "Zona Universitaria, Guadalajara",
        manager: "Diego Herrera",
        createdAt: "14/02/2024",
    },
    {
        id: 8,
        name: "Bar Central",
        category: "Normal",
        location: "Centro, Querétaro",
        manager: "Sofía Morales",
        createdAt: "03/03/2024",
    },
];

const initialEmployees: Employee[] = [
    {
        id: 1,
        name: "Luis García",
        branch: "Lounge Noir",
        position: "Bartender",
        phone: "9511234567",
        email: "luis.garcia@email.com",
        createdAt: "10/02/2024",
    },
    {
        id: 2,
        name: "María López",
        branch: "Sunset Breeze",
        position: "Mesera",
        phone: "9982345678",
        email: "maria.lopez@email.com",
        createdAt: "12/02/2024",
    },
    {
        id: 3,
        name: "Carlos Ramírez",
        branch: "Campus Bar",
        position: "DJ",
        phone: "3313456789",
        email: "carlos.ramirez@email.com",
        createdAt: "15/02/2024",
    },
    {
        id: 4,
        name: "Fernanda Torres",
        branch: "Golden Hour",
        position: "Hostess",
        phone: "8114567890",
        email: "fernanda.torres@email.com",
        createdAt: "18/02/2024",
    },
    {
        id: 5,
        name: "Jorge Castillo",
        branch: "La Esquina",
        position: "Gerente",
        phone: "2225678901",
        email: "jorge.castillo@email.com",
        createdAt: "20/02/2024",
    },
    {
        id: 6,
        name: "Sofía Morales",
        branch: "Mar Azul",
        position: "Bartender",
        phone: "9546789012",
        email: "sofia.morales@email.com",
        createdAt: "22/02/2024",
    },
    {
        id: 7,
        name: "Diego Herrera",
        branch: "After Class",
        position: "Seguridad",
        phone: "3317890123",
        email: "diego.herrera@email.com",
        createdAt: "25/02/2024",
    },
    {
        id: 8,
        name: "Andrea Cruz",
        branch: "Bar Central",
        position: "Mesera",
        phone: "4428901234",
        email: "andrea.cruz@email.com",
        createdAt: "28/02/2024",
    }
];

const initialSuppliers: Supplier[] = [
    {
        id: 1,
        name: "Ricardo Pérez",
        company: "Bebidas Premium SA",
        phone: "5512345678",
        email: "ricardo@bebidas.com",
        createdAt: "01/03/2024",
    },
    {
        id: 2,
        name: "Laura Gómez",
        company: "Distribuidora del Sur",
        phone: "9512345678",
        email: "laura@distribuidora.com",
        createdAt: "05/03/2024",
    }
];

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<"branches" | "employees" | "suppliers">("branches");
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const [branches, setBranches] = useState(initialBranches);
    const [employees, setEmployees] = useState(initialEmployees);
    const [suppliers, setSuppliers] = useState(initialSuppliers);

    // FORM
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [formData, setFormData] = useState<any>({});

    const toggleDetails = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    // ABRIR FORM AGREGAR
    const handleAdd = () => {
        setEditId(null);
        setFormData({});
        setShowForm(true);
    };

    // ABRIR FORM EDITAR
    const handleEdit = (item: any) => {
        setEditId(item.id);
        setFormData(item);
        setShowForm(true);
    };

    // ELIMINAR
    const handleDelete = (id: number) => {
        if (activeTab === "branches") {
            setBranches(branches.filter(b => b.id !== id));
        } else if (activeTab === "employees") {
            setEmployees(employees.filter(e => e.id !== id));
        } else {
            setSuppliers(suppliers.filter(s => s.id !== id));
        }
    };

    // GUARDAR
    const handleSubmit = () => {
        if (activeTab === "branches") {
            if (editId) {
                setBranches(branches.map(b => b.id === editId ? { ...b, ...formData } : b));
            } else {
                setBranches([...branches, {
                    id: Date.now(),
                    createdAt: new Date().toLocaleDateString(),
                    ...formData
                }]);
            }
        } else if (activeTab === "employees") {
            if (editId) {
                setEmployees(employees.map(e => e.id === editId ? { ...e, ...formData } : e));
            } else {
                setEmployees([...employees, {
                    id: Date.now(),
                    createdAt: new Date().toLocaleDateString(),
                    ...formData
                }]);
            }
        } else {
            if (editId) {
                setSuppliers(suppliers.map(s => s.id === editId ? { ...s, ...formData } : s));
            } else {
                setSuppliers([...suppliers, {
                    id: Date.now(),
                    createdAt: new Date().toLocaleDateString(),
                    ...formData
                }]);
            }
        }

        setShowForm(false);
    };

    return (
        <div className="min-h-screen flex bg-[#0e0e11] text-[#bcb8b7]">

            {/* SIDEBAR */}
            <aside className="w-64 hidden md:flex flex-col border-r border-[#2a2523]">

                <div className="p-6 border-b border-[#2a2523] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-[#e8a530] flex items-center justify-center">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e8a530" strokeWidth="2">
                            <path d="M8 2h8v3a4 4 0 0 1-8 0V2z" />
                            <path d="M12 9v6" />
                            <path d="M9 22h6" />
                        </svg>
                    </div>
                    <span className="text-lg font-semibold text-[#e8a530]">
                        AfterHours
                    </span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab("branches")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${activeTab === "branches"
                            ? "bg-[#2a2523] text-[#e8a530]"
                            : "text-[#858587] hover:bg-[#2a2523]"
                            }`}
                    >
                        <span>Sucursales</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("employees")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${activeTab === "employees"
                            ? "bg-[#2a2523] text-[#e8a530]"
                            : "text-[#858587] hover:bg-[#2a2523]"
                            }`}
                    >
                        <span>Empleados</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("suppliers")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${activeTab === "suppliers"
                            ? "bg-[#2a2523] text-[#e8a530]"
                            : "text-[#858587] hover:bg-[#2a2523]"
                            }`}
                    >
                        <span>Proveedores</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-[#2a2523]">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-[#858587] hover:text-[#bcb8b7] text-sm"
                    >
                        Cerrar Sesión
                    </Link>
                </div>
            </aside>

            {/* MAIN */}
            <main className="flex-1 p-6 md:p-10">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-[#e8a530]">
                        {activeTab === "branches"
                            ? "Sucursales"
                            : activeTab === "employees"
                                ? "Empleados"
                                : "Proveedores"}
                    </h1>

                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#e8a530] text-black font-medium hover:opacity-90 transition"
                    >
                        {activeTab === "branches"
                            ? "+ Agregar Sucursal"
                            : activeTab === "employees"
                                ? "+ Agregar Empleado"
                                : "+ Agregar Proveedor"}
                    </button>
                </div>

                {/* FORM FLOTANTE */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

                        <div className="w-full max-w-md mx-4 rounded-xl border border-[#2a2523] bg-[#0e0e11] p-5 space-y-3">

                            <h2 className="text-lg text-[#e8a530]">
                                {editId ? "Editar" : "Agregar"}
                            </h2>

                            {activeTab === "branches" ? (
                                <>
                                    <div>
                                        <p className="text-sm text-[#bcb8b7] mb-1">Nombre:</p>
                                        <input
                                            className="w-full p-2 bg-[#131316] rounded"
                                            placeholder="Lounge Noir"
                                            value={formData.name || ""}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <p className="text-sm text-[#bcb8b7] mb-1">Categoría:</p>
                                        <input
                                            className="w-full p-2 bg-[#131316] rounded"
                                            placeholder="Cocktail Bar"
                                            value={formData.category || ""}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <p className="text-sm text-[#bcb8b7] mb-1">Ubicación:</p>
                                        <input
                                            className="w-full p-2 bg-[#131316] rounded"
                                            placeholder="Av. Reforma 234, CDMX"
                                            value={formData.location || ""}
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <p className="text-sm text-[#bcb8b7] mb-1">Gerente:</p>
                                        <input
                                            className="w-full p-2 bg-[#131316] rounded"
                                            placeholder="Carlos Mendoza"
                                            value={formData.manager || ""}
                                            onChange={e => setFormData({ ...formData, manager: e.target.value })}
                                        />
                                    </div>
                                </>
                            ) : activeTab === "employees" ? (
                                <>
                                    <div>
                                        <p className="text-sm text-[#bcb8b7] mb-1">Nombre:</p>
                                        <input
                                            className="w-full p-2 bg-[#131316] rounded"
                                            placeholder="Juan Pérez"
                                            value={formData.name || ""}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <p className="text-sm text-[#bcb8b7] mb-1">Sucursal:</p>
                                        <input
                                            className="w-full p-2 bg-[#131316] rounded"
                                            placeholder="Lounge Noir"
                                            value={formData.branch || ""}
                                            onChange={e => setFormData({ ...formData, branch: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <p className="text-sm text-[#bcb8b7] mb-1">Puesto:</p>
                                        <input
                                            className="w-full p-2 bg-[#131316] rounded"
                                            placeholder="Mesero"
                                            value={formData.position || ""}
                                            onChange={e => setFormData({ ...formData, position: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <p className="text-sm text-[#bcb8b7] mb-1">Teléfono:</p>
                                        <input
                                            className="w-full p-2 bg-[#131316] rounded"
                                            placeholder="9511234567"
                                            value={formData.phone || ""}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <p className="text-sm text-[#bcb8b7] mb-1">Correo:</p>
                                        <input
                                            className="w-full p-2 bg-[#131316] rounded"
                                            placeholder="juan@email.com"
                                            value={formData.email || ""}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <p className="text-sm text-[#bcb8b7] mb-1">Nombre:</p>
                                        <input
                                            className="w-full p-2 bg-[#131316] rounded"
                                            placeholder="Juan Pérez"
                                            value={formData.name || ""}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <p className="text-sm text-[#bcb8b7] mb-1">Empresa:</p>
                                        <input
                                            className="w-full p-2 bg-[#131316] rounded"
                                            placeholder="Proveedor SA"
                                            value={formData.company || ""}
                                            onChange={e => setFormData({ ...formData, company: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <p className="text-sm text-[#bcb8b7] mb-1">Teléfono:</p>
                                        <input
                                            className="w-full p-2 bg-[#131316] rounded"
                                            placeholder="9511234567"
                                            value={formData.phone || ""}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <p className="text-sm text-[#bcb8b7] mb-1">Correo:</p>
                                        <input
                                            className="w-full p-2 bg-[#131316] rounded"
                                            placeholder="correo@email.com"
                                            value={formData.email || ""}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}

                            <div className="flex gap-3 pt-3">
                                <button
                                    onClick={handleSubmit}
                                    className="px-3 py-1.5 rounded-md text-sm bg-[#e8a530] text-black hover:opacity-90 transition"
                                >
                                    Guardar
                                </button>

                                <button
                                    onClick={() => setShowForm(false)}
                                    className="px-3 py-1.5 rounded-md text-sm bg-[#2a2523] text-[#e8a530] hover:bg-[#3a3330] transition"
                                >
                                    Cancelar
                                </button>
                            </div>

                        </div>
                    </div>
                )}

                {/* LISTAS */}
                <div className="space-y-4">
                    {(activeTab === "branches"
                        ? branches
                        : activeTab === "employees"
                            ? employees
                            : suppliers
                    ).map((item: any) => {
                        const isOpen = expandedId === item.id;

                        return (
                            <div key={item.id} className="rounded-xl border border-[#2a2523] bg-[#131316] p-5 transition">

                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">
                                            {item.name}
                                        </h3>

                                        <span className="inline-block mt-1 text-xs px-2 py-1 rounded-full bg-[#2a2523] text-[#e8a530]">
                                            {activeTab === "branches"
                                                ? item.category
                                                : activeTab === "employees"
                                                    ? `${item.branch} • ${item.position}`
                                                    : item.company}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => toggleDetails(item.id)}
                                        className="flex items-center gap-2 text-[#858587] hover:text-[#e8a530] text-sm"
                                    >
                                        <svg className={`transition-transform ${isOpen ? "rotate-180" : ""}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M6 9l6 6 6-6" />
                                        </svg>
                                        Detalles
                                    </button>
                                </div>

                                {isOpen && (
                                    <div className="mt-4 pt-4 border-t border-[#2a2523] space-y-2 text-sm text-[#858587]">

                                        {activeTab === "branches" ? (
                                            <>
                                                <p><span className="text-[#bcb8b7]">Ubicación:</span> {item.location}</p>
                                                <p><span className="text-[#bcb8b7]">Gerente:</span> {item.manager}</p>
                                            </>
                                        ) : activeTab === "employees" ? (
                                            <>
                                                <p><span className="text-[#bcb8b7]">Sucursal:</span> {item.branch}</p>
                                                <p><span className="text-[#bcb8b7]">Puesto:</span> {item.position}</p>
                                                <p><span className="text-[#bcb8b7]">Teléfono:</span> {item.phone}</p>
                                                <p><span className="text-[#bcb8b7]">Correo:</span> {item.email}</p>
                                            </>
                                        ) : (
                                            <>
                                                <p><span className="text-[#bcb8b7]">Empresa:</span> {item.company}</p>
                                                <p><span className="text-[#bcb8b7]">Teléfono:</span> {item.phone}</p>
                                                <p><span className="text-[#bcb8b7]">Correo:</span> {item.email}</p>
                                            </>
                                        )}

                                        <div className="flex gap-3 pt-3">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="px-3 py-1.5 rounded-md text-sm bg-[#e8a530] text-black hover:opacity-90 transition"
                                            >
                                                Editar
                                            </button>

                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="px-3 py-1.5 rounded-md text-sm bg-[#2a2523] text-[#e8a530] hover:bg-[#3a3330] transition"
                                            >
                                                Eliminar
                                            </button>
                                        </div>

                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

            </main>
        </div>
    );
}