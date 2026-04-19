import { useState } from "react";
import { Building2, Users, Plus, MapPin, UserCircle, Pencil, Trash2, Filter, ChevronDown, ChevronUp, Wine, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Link } from "react-router-dom";

interface Branch {
  id: number;
  name: string;
  category: string;
  location: string;
  manager: string;
}

interface Employee {
  id: number;
  name: string;
  branch: string;
  position: string;
}

const initialBranches: Branch[] = [
  { id: 1, name: "Lounge Noir", category: "Cocktail Bar", location: "Av. Reforma 234, CDMX", manager: "Carlos Mendoza" },
  { id: 2, name: "The Amber Room", category: "Whiskey Bar", location: "Calle 5 de Mayo 12, Guadalajara", manager: "Ana Torres" },
  { id: 3, name: "Velvet Underground", category: "Speakeasy", location: "Zona Rosa 88, Monterrey", manager: "Diego Ruiz" },
];

const initialEmployees: Employee[] = [
  { id: 1, name: "Luis García", branch: "Lounge Noir", position: "Bartender" },
  { id: 2, name: "María López", branch: "The Amber Room", position: "Hostess" },
  { id: 3, name: "Pedro Sánchez", branch: "Velvet Underground", position: "DJ" },
  { id: 4, name: "Sofia Reyes", branch: "Lounge Noir", position: "Mesera" },
  { id: 5, name: "Javier Morales", branch: "The Amber Room", position: "Bartender" },
];

const emptyBranch = { name: "", category: "", location: "", manager: "" };
const emptyEmployee = { name: "", branch: "", position: "" };

const Admin = () => {
  const [activeTab, setActiveTab] = useState<"branches" | "employees">("branches");
  const [expandedBranch, setExpandedBranch] = useState<number | null>(null);
  const [expandedEmployee, setExpandedEmployee] = useState<number | null>(null);
  const [branchFilter, setBranchFilter] = useState("all");

  const [branches, setBranches] = useState<Branch[]>(initialBranches);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);

  // Branch dialog
  const [branchDialogOpen, setBranchDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [branchForm, setBranchForm] = useState(emptyBranch);

  // Employee dialog
  const [employeeDialogOpen, setEmployeeDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [employeeForm, setEmployeeForm] = useState(emptyEmployee);

  const filteredEmployees = branchFilter === "all" ? employees : employees.filter(e => e.branch === branchFilter);

  // Branch CRUD
  const openNewBranch = () => {
    setEditingBranch(null);
    setBranchForm(emptyBranch);
    setBranchDialogOpen(true);
  };
  const openEditBranch = (b: Branch) => {
    setEditingBranch(b);
    setBranchForm({ name: b.name, category: b.category, location: b.location, manager: b.manager });
    setBranchDialogOpen(true);
  };
  const saveBranch = () => {
    if (!branchForm.name.trim()) return;
    if (editingBranch) {
      setBranches(prev => prev.map(b => b.id === editingBranch.id ? { ...b, ...branchForm } : b));
    } else {
      setBranches(prev => [...prev, { id: Date.now(), ...branchForm }]);
    }
    setBranchDialogOpen(false);
  };
  const deleteBranch = (id: number) => {
    setBranches(prev => prev.filter(b => b.id !== id));
    setExpandedBranch(null);
  };

  // Employee CRUD
  const openNewEmployee = () => {
    setEditingEmployee(null);
    setEmployeeForm(emptyEmployee);
    setEmployeeDialogOpen(true);
  };
  const openEditEmployee = (e: Employee) => {
    setEditingEmployee(e);
    setEmployeeForm({ name: e.name, branch: e.branch, position: e.position });
    setEmployeeDialogOpen(true);
  };
  const saveEmployee = () => {
    if (!employeeForm.name.trim()) return;
    if (editingEmployee) {
      setEmployees(prev => prev.map(e => e.id === editingEmployee.id ? { ...e, ...employeeForm } : e));
    } else {
      setEmployees(prev => [...prev, { id: Date.now(), ...employeeForm }]);
    }
    setEmployeeDialogOpen(false);
  };
  const deleteEmployee = (id: number) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
    setExpandedEmployee(null);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/50 flex flex-col shrink-0 hidden md:flex">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Wine className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-display font-bold text-gradient-gold">BarManager</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button onClick={() => setActiveTab("branches")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === "branches" ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}>
            <Building2 className="w-5 h-5" />
            Sucursales
          </button>
          <button onClick={() => setActiveTab("employees")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === "employees" ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}>
            <Users className="w-5 h-5" />
            Empleados
          </button>
        </nav>

        <div className="p-4 border-t border-border">
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
              <LogOut className="w-4 h-4 mr-2" /> Cerrar Sesión
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        {/* Mobile tabs */}
        <div className="flex md:hidden gap-2 mb-6">
          <Button variant={activeTab === "branches" ? "default" : "secondary"} onClick={() => setActiveTab("branches")} className="flex-1">
            <Building2 className="w-4 h-4 mr-2" /> Sucursales
          </Button>
          <Button variant={activeTab === "employees" ? "default" : "secondary"} onClick={() => setActiveTab("employees")} className="flex-1">
            <Users className="w-4 h-4 mr-2" /> Empleados
          </Button>
        </div>

        {activeTab === "branches" ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl md:text-3xl font-display font-bold text-gradient-gold">Sucursales</h1>
              <Button onClick={openNewBranch} className="gold-glow hover:scale-[1.02] transition-transform">
                <Plus className="w-4 h-4 mr-2" /> Nueva Sucursal
              </Button>
            </div>

            <div className="grid gap-4">
              {branches.map((b) => (
                <div key={b.id} className="glass-card p-5 space-y-3 hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{b.name}</h3>
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{b.category}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setExpandedBranch(expandedBranch === b.id ? null : b.id)}
                      className="text-muted-foreground hover:text-primary">
                      {expandedBranch === b.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      <span className="ml-1 text-xs">Detalles</span>
                    </Button>
                  </div>

                  {expandedBranch === b.id && (
                    <div className="pt-3 border-t border-border space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 text-primary/70" /> {b.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <UserCircle className="w-4 h-4 text-primary/70" /> Encargado: {b.manager}
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button variant="secondary" size="sm" onClick={() => openEditBranch(b)}>
                          <Pencil className="w-3 h-3 mr-1" /> Editar
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deleteBranch(b.id)}
                          className="text-muted-foreground hover:text-foreground hover:border-muted-foreground">
                          <Trash2 className="w-3 h-3 mr-1" /> Eliminar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h1 className="text-2xl md:text-3xl font-display font-bold text-gradient-gold">Empleados</h1>
              <div className="flex gap-3 w-full sm:w-auto">
                <Select value={branchFilter} onValueChange={setBranchFilter}>
                  <SelectTrigger className="w-full sm:w-48 bg-muted/50 border-border">
                    <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Filtrar por sucursal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las sucursales</SelectItem>
                    {branches.map(b => <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button onClick={openNewEmployee} className="gold-glow hover:scale-[1.02] transition-transform shrink-0">
                  <Plus className="w-4 h-4 mr-2" /> Agregar
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredEmployees.map((e) => (
                <div key={e.id} className="glass-card p-5 hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <UserCircle className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{e.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{e.branch}</span>
                          <span className="text-border">•</span>
                          <span className="text-primary/80">{e.position}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setExpandedEmployee(expandedEmployee === e.id ? null : e.id)}
                      className="text-muted-foreground hover:text-primary">
                      {expandedEmployee === e.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      <span className="ml-1 text-xs">Detalles</span>
                    </Button>
                  </div>

                  {expandedEmployee === e.id && (
                    <div className="mt-3 pt-3 border-t border-border space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      <p className="text-sm text-muted-foreground">Sucursal: <span className="text-foreground">{e.branch}</span></p>
                      <p className="text-sm text-muted-foreground">Puesto: <span className="text-foreground">{e.position}</span></p>
                      <div className="flex gap-2 pt-2">
                        <Button variant="secondary" size="sm" onClick={() => openEditEmployee(e)}>
                          <Pencil className="w-3 h-3 mr-1" /> Editar
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deleteEmployee(e.id)}
                          className="text-muted-foreground hover:text-foreground hover:border-muted-foreground">
                          <Trash2 className="w-3 h-3 mr-1" /> Eliminar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Branch Dialog */}
      <Dialog open={branchDialogOpen} onOpenChange={setBranchDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground font-display">{editingBranch ? "Editar Sucursal" : "Nueva Sucursal"}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {editingBranch ? "Modifica los datos de la sucursal." : "Completa los datos para agregar una nueva sucursal."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Nombre</Label>
              <Input value={branchForm.name} onChange={e => setBranchForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Ej: Lounge Noir" className="bg-muted/50 border-border" />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Categoría</Label>
              <Input value={branchForm.category} onChange={e => setBranchForm(f => ({ ...f, category: e.target.value }))}
                placeholder="Ej: Cocktail Bar" className="bg-muted/50 border-border" />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Ubicación</Label>
              <Input value={branchForm.location} onChange={e => setBranchForm(f => ({ ...f, location: e.target.value }))}
                placeholder="Ej: Av. Reforma 234, CDMX" className="bg-muted/50 border-border" />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Encargado</Label>
              <Input value={branchForm.manager} onChange={e => setBranchForm(f => ({ ...f, manager: e.target.value }))}
                placeholder="Ej: Carlos Mendoza" className="bg-muted/50 border-border" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBranchDialogOpen(false)} className="border-border text-muted-foreground">Cancelar</Button>
            <Button onClick={saveBranch} className="gold-glow">{editingBranch ? "Guardar Cambios" : "Agregar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Employee Dialog */}
      <Dialog open={employeeDialogOpen} onOpenChange={setEmployeeDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground font-display">{editingEmployee ? "Editar Empleado" : "Agregar Empleado"}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {editingEmployee ? "Modifica los datos del empleado." : "Completa los datos para agregar un nuevo empleado."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Nombre</Label>
              <Input value={employeeForm.name} onChange={e => setEmployeeForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Ej: Luis García" className="bg-muted/50 border-border" />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Sucursal</Label>
              <Select value={employeeForm.branch} onValueChange={v => setEmployeeForm(f => ({ ...f, branch: v }))}>
                <SelectTrigger className="bg-muted/50 border-border">
                  <SelectValue placeholder="Selecciona sucursal" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map(b => <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Puesto</Label>
              <Input value={employeeForm.position} onChange={e => setEmployeeForm(f => ({ ...f, position: e.target.value }))}
                placeholder="Ej: Bartender" className="bg-muted/50 border-border" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmployeeDialogOpen(false)} className="border-border text-muted-foreground">Cancelar</Button>
            <Button onClick={saveEmployee} className="gold-glow">{editingEmployee ? "Guardar Cambios" : "Agregar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
