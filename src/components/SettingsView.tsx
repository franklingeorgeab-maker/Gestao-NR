import React, { useState } from "react";
import { SystemHoliday, UserAccount, ClientCompany, Regional, AccessProfile } from "../types";
import SesiLogo from "./SesiLogo";
import { 
  Settings, 
  Calendar as CalendarIcon, 
  Users, 
  Building2, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  KeyRound,
  MapPin,
  Search,
  UserCheck,
  Globe,
  Tag,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Check,
  Sparkles
} from "lucide-react";

interface SettingsViewProps {
  holidays: SystemHoliday[];
  onAddHoliday: (holiday: SystemHoliday) => void;
  onUpdateHoliday: (holiday: SystemHoliday) => void;
  onDeleteHoliday: (id: string) => void;
  
  users: UserAccount[];
  onAddUser: (user: UserAccount) => void;
  onUpdateUser: (user: UserAccount) => void;
  onDeleteUser: (id: string) => void;

  clients: ClientCompany[];
  onAddClient: (client: ClientCompany) => void;
  onUpdateClient: (client: ClientCompany) => void;
  onDeleteClient: (id: string) => void;

  activeUser: UserAccount;
  onSwitchUser: (user: UserAccount) => void;

  customLogoUrl?: string | null;
  onUpdateCustomLogo?: (logoUrl: string | null) => void;
}

export default function SettingsView({
  holidays,
  onAddHoliday,
  onUpdateHoliday,
  onDeleteHoliday,
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  clients,
  onAddClient,
  onUpdateClient,
  onDeleteClient,
  activeUser,
  onSwitchUser,
  customLogoUrl = null,
  onUpdateCustomLogo
}: SettingsViewProps) {
  const [activeTab, setActiveTab] = useState<"holidays" | "users" | "clients" | "logo">("holidays");
  const [logoPreview, setLogoPreview] = useState<string | null>(customLogoUrl);
  const [logoUrlInput, setLogoUrlInput] = useState<string>("");
  const [logoSaveSuccess, setLogoSaveSuccess] = useState<boolean>(false);

  // Holiday Filters & Forms
  const [holidaySearch, setHolidaySearch] = useState("");
  const [holidayTypeFilter, setHolidayTypeFilter] = useState<"Todos" | "Geral" | "Local">("Todos");
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<SystemHoliday | null>(null);

  const [holidayDate, setHolidayDate] = useState("2026-09-20");
  const [holidayName, setHolidayName] = useState("");
  const [holidayType, setHolidayType] = useState<"Geral" | "Local">("Geral");
  const [holidayRegional, setHolidayRegional] = useState<Regional>("Oeste");
  const [holidayCity, setHolidayCity] = useState("");
  const [holidayDescription, setHolidayDescription] = useState("");

  // User Filters & Forms
  const [userSearch, setUserSearch] = useState("");
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);

  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [roleInput, setRoleInput] = useState<AccessProfile>("Comercial");
  const [regionalInput, setRegionalInput] = useState<Regional>("Centro-Norte");
  const [unitInput, setUnitInput] = useState("Jaraguá do Sul");
  const [allowedMenusInput, setAllowedMenusInput] = useState<string[]>([]);

  const DEFAULT_MENUS_BY_ROLE: Record<AccessProfile, string[]> = {
    "Supervisão": ["dashboard", "calendar", "tracker", "instructors", "commercial", "portal", "courses", "documents", "settings"],
    "PCP": ["dashboard", "calendar", "tracker", "instructors", "courses", "documents", "settings"],
    "Comercial": ["commercial"],
    "Secretária": ["tracker"],
    "Instrutor": ["portal"],
    "Faturamento": ["tracker"]
  };

  const MENU_OPTIONS: { id: string; label: string }[] = [
    { id: "dashboard", label: "Painel Gerencial" },
    { id: "calendar", label: "Agenda Geral" },
    { id: "tracker", label: "Acompanhamento de Fluxo" },
    { id: "instructors", label: "Instrutores & Escalas" },
    { id: "commercial", label: "Apoio ao Comercial" },
    { id: "portal", label: "Portal do Instrutor" },
    { id: "courses", label: "Catálogo de Cursos SGN" },
    { id: "documents", label: "Documentos de Apoio" },
    { id: "settings", label: "Configuração & Acesso" }
  ];

  // Client Filters & Forms
  const [clientSearch, setClientSearch] = useState("");
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientCompany | null>(null);

  const [cliName, setCliName] = useState("");
  const [cliCnpj, setCliCnpj] = useState("");
  const [cliContact, setCliContact] = useState("");
  const [cliEmail, setCliEmail] = useState("");
  const [cliPhone, setCliPhone] = useState("");
  const [cliRegional, setCliRegional] = useState<Regional>("Oeste");
  const [cliCity, setCliCity] = useState("Chapecó");
  const [cliAddress, setCliAddress] = useState("");
  const [cliNotes, setCliNotes] = useState("");

  // Handlers for Holidays
  const handleOpenHolidayModal = (h?: SystemHoliday) => {
    if (h) {
      setEditingHoliday(h);
      setHolidayDate(h.date);
      setHolidayName(h.name);
      setHolidayType(h.type);
      setHolidayRegional(h.regional || "Oeste");
      setHolidayCity(h.city || "");
      setHolidayDescription(h.description || "");
    } else {
      setEditingHoliday(null);
      setHolidayDate("2026-10-24");
      setHolidayName("");
      setHolidayType("Geral");
      setHolidayRegional("Oeste");
      setHolidayCity("");
      setHolidayDescription("");
    }
    setIsHolidayModalOpen(true);
  };

  const handleSaveHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!holidayName || !holidayDate) return;

    const newH: SystemHoliday = {
      id: editingHoliday ? editingHoliday.id : `hol-custom-${Date.now()}`,
      date: holidayDate,
      name: holidayName,
      type: holidayType,
      regional: holidayType === "Local" ? holidayRegional : undefined,
      city: holidayType === "Local" ? holidayCity : undefined,
      description: holidayDescription || (holidayType === "Geral" ? "Feriado Nacional/Estadual" : "Feriado Municipal/Regional")
    };

    if (editingHoliday) {
      onUpdateHoliday(newH);
    } else {
      onAddHoliday(newH);
    }
    setIsHolidayModalOpen(false);
  };

  // Handlers for Users
  const handleOpenUserModal = (u?: UserAccount) => {
    if (u) {
      setEditingUser(u);
      setUsernameInput(u.username);
      setPasswordInput(u.password);
      setNameInput(u.name);
      setEmailInput(u.email);
      setRoleInput(u.role);
      setRegionalInput(u.regional);
      setUnitInput(u.unit);
      setAllowedMenusInput(u.allowedMenus && u.allowedMenus.length > 0 ? u.allowedMenus : DEFAULT_MENUS_BY_ROLE[u.role]);
    } else {
      setEditingUser(null);
      setUsernameInput("");
      setPasswordInput("123");
      setNameInput("");
      setEmailInput("");
      setRoleInput("Comercial");
      setRegionalInput("Centro-Norte");
      setUnitInput("Chapecó");
      setAllowedMenusInput(DEFAULT_MENUS_BY_ROLE["Comercial"]);
    }
    setIsUserModalOpen(true);
  };

  const handleRoleChange = (newRole: AccessProfile) => {
    setRoleInput(newRole);
    setAllowedMenusInput(DEFAULT_MENUS_BY_ROLE[newRole] || ["portal"]);
  };

  const handleToggleMenuPermission = (menuId: string) => {
    setAllowedMenusInput(prev => 
      prev.includes(menuId) ? prev.filter(m => m !== menuId) : [...prev, menuId]
    );
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput || !nameInput) return;

    const newUser: UserAccount = {
      id: editingUser ? editingUser.id : `usr-custom-${Date.now()}`,
      username: usernameInput.toLowerCase().trim(),
      password: passwordInput,
      name: nameInput,
      email: emailInput || `${usernameInput.toLowerCase()}@sesisc.org.br`,
      role: roleInput,
      regional: regionalInput,
      unit: unitInput,
      allowedMenus: allowedMenusInput.length > 0 ? allowedMenusInput : DEFAULT_MENUS_BY_ROLE[roleInput],
      canApproveSpecialDates: roleInput === "Supervisão",
      canManageHolidays: roleInput === "Supervisão" || roleInput === "PCP"
    };

    if (editingUser) {
      onUpdateUser(newUser);
    } else {
      onAddUser(newUser);
    }
    setIsUserModalOpen(false);
  };

  // Handlers for Clients
  const handleOpenClientModal = (c?: ClientCompany) => {
    if (c) {
      setEditingClient(c);
      setCliName(c.name);
      setCliCnpj(c.cnpj);
      setCliContact(c.contactName);
      setCliEmail(c.email);
      setCliPhone(c.phone);
      setCliRegional(c.regional);
      setCliCity(c.city);
      setCliAddress(c.address || "");
      setCliNotes(c.notes || "");
    } else {
      setEditingClient(null);
      setCliName("");
      setCliCnpj("");
      setCliContact("");
      setCliEmail("");
      setCliPhone("");
      setCliRegional("Oeste");
      setCliCity("Chapecó");
      setCliAddress("");
      setCliNotes("");
    }
    setIsClientModalOpen(true);
  };

  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliName) return;

    const newCli: ClientCompany = {
      id: editingClient ? editingClient.id : `cli-custom-${Date.now()}`,
      name: cliName,
      cnpj: cliCnpj || "00.000.000/0001-00",
      contactName: cliContact,
      email: cliEmail,
      phone: cliPhone,
      regional: cliRegional,
      city: cliCity,
      address: cliAddress,
      notes: cliNotes
    };

    if (editingClient) {
      onUpdateClient(newCli);
    } else {
      onAddClient(newCli);
    }
    setIsClientModalOpen(false);
  };

  // Handlers for Custom Logo
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("O arquivo selecionado deve ter no máximo 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setLogoPreview(reader.result);
          setLogoSaveSuccess(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyCustomLogo = () => {
    const finalUrl = logoUrlInput.trim() || logoPreview;
    if (onUpdateCustomLogo) {
      onUpdateCustomLogo(finalUrl || null);
    }
    setLogoSaveSuccess(true);
    setTimeout(() => setLogoSaveSuccess(false), 3000);
  };

  const handleResetToDefaultLogo = () => {
    setLogoPreview(null);
    setLogoUrlInput("");
    if (onUpdateCustomLogo) {
      onUpdateCustomLogo(null);
    }
    setLogoSaveSuccess(true);
    setTimeout(() => setLogoSaveSuccess(false), 3000);
  };

  // Filtered lists
  const filteredHolidays = holidays.filter(h => {
    const matchSearch = h.name.toLowerCase().includes(holidaySearch.toLowerCase()) ||
                        h.date.includes(holidaySearch) ||
                        (h.city && h.city.toLowerCase().includes(holidaySearch.toLowerCase()));
    const matchType = holidayTypeFilter === "Todos" || h.type === holidayTypeFilter;
    return matchSearch && matchType;
  });

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.cnpj.includes(clientSearch) ||
    c.contactName.toLowerCase().includes(clientSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-black text-slate-900">Configurações & Controle de Acesso</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Gerenciamento centralizado de feriados gerais/locais, contas de usuários com logins e senhas, e cadastro de indústrias/clientes.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("holidays")}
            className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === "holidays"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <CalendarIcon className="w-4 h-4 text-blue-600" />
            <span>Feriados ({holidays.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === "users"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <KeyRound className="w-4 h-4 text-emerald-600" />
            <span>Usuários & Credenciais ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("clients")}
            className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === "clients"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Building2 className="w-4 h-4 text-purple-600" />
            <span>Clientes & Indústrias ({clients.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("logo")}
            className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === "logo"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ImageIcon className="w-4 h-4 text-amber-500" />
            <span>Logo Personalizada</span>
          </button>
        </div>
      </div>

      {/* TAB 1: HOLIDAYS MANAGEMENT */}
      {activeTab === "holidays" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" />
                Cadastro de Feriados Nacionais e Locais
              </h3>
              <p className="text-xs text-slate-500">
                Os feriados cadastrados bloqueiam automaticamente simulações de turmas sem anuência da coordenação.
              </p>
            </div>

            <button
              onClick={() => handleOpenHolidayModal()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition-colors shadow-sm flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Feriado</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por nome do feriado, data ou cidade..."
                value={holidaySearch}
                onChange={(e) => setHolidaySearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 shrink-0">Tipo:</span>
              <select
                value={holidayTypeFilter}
                onChange={(e) => setHolidayTypeFilter(e.target.value as any)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="Todos">Todos os Tipos</option>
                <option value="Geral">Apenas Gerais (Nacionais)</option>
                <option value="Local">Apenas Locais (Municipais/Regionais)</option>
              </select>
            </div>
          </div>

          {/* Holidays Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-extrabold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Nome do Feriado</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Abrangência / Local</th>
                  <th className="px-4 py-3">Descrição</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHolidays.map((h) => {
                  const parts = h.date.split("-");
                  const formattedDate = parts.length >= 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : h.date;

                  return (
                    <tr key={h.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-extrabold text-slate-900 font-mono">
                        {formattedDate}
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-800">
                        {h.name}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          h.type === "Geral"
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : "bg-purple-100 text-purple-800 border border-purple-200"
                        }`}>
                          {h.type === "Geral" ? "Nacional / Geral" : "Local / Municipal"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-600">
                        {h.type === "Local" ? (
                          <span className="flex items-center gap-1 font-semibold text-slate-700">
                            <MapPin className="w-3 h-3 text-rose-500" />
                            {h.city ? `${h.city} (${h.regional})` : `Regional ${h.regional}`}
                          </span>
                        ) : (
                          <span className="text-slate-400">Todas as Regionais SC</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-[11px]">
                        {h.description || "—"}
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() => handleOpenHolidayModal(h)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Editar Feriado"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remover o feriado '${h.name}'?`)) {
                              onDeleteHoliday(h.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Excluir Feriado"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredHolidays.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400 text-xs font-medium">
                      Nenhum feriado localizado com os filtros selecionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: USERS & ACCESS PROFILES */}
      {activeTab === "users" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                Usuários do Sistema, Logins e Perfis de Acesso
              </h3>
              <p className="text-xs text-slate-500">
                Alterne entre perfis para testar as travas de permissão, visibilidade de menus e aprovações especiais do sistema.
              </p>
            </div>

            <button
              onClick={() => handleOpenUserModal()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-colors shadow-sm flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Usuário</span>
            </button>
          </div>

          {/* User Active Card Banner */}
          <div className="p-4 bg-slate-900 text-white rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 text-white rounded-xl font-black text-sm">
                {activeUser.role.slice(0, 3).toUpperCase()}
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Usuário Ativo na Sessão</p>
                <p className="text-sm font-extrabold text-white flex items-center gap-2">
                  {activeUser.name} <span className="text-xs font-normal text-slate-300">({activeUser.email})</span>
                </p>
                <p className="text-[11px] text-slate-400">
                  Perfil: <strong className="text-blue-400">{activeUser.role}</strong> • Regional: <strong>{activeUser.regional} ({activeUser.unit})</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {activeUser.canApproveSpecialDates && (
                <span className="text-[10px] bg-purple-900/80 text-purple-200 border border-purple-700 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> Aprovador de Feriados/Domingos
                </span>
              )}
            </div>
          </div>

          {/* User Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filtrar por nome, usuário (login) ou perfil de acesso..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Users Grid / Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((u) => {
              const isActive = u.id === activeUser.id;
              const showPass = !!showPasswords[u.id];

              return (
                <div
                  key={u.id}
                  className={`p-4 rounded-xl border transition-all space-y-3 relative ${
                    isActive 
                      ? "border-emerald-400 bg-emerald-50/50 shadow-sm" 
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase ${
                        u.role === "Supervisão" ? "bg-purple-100 text-purple-800" :
                        u.role === "PCP" ? "bg-blue-100 text-blue-800" :
                        u.role === "Comercial" ? "bg-emerald-100 text-emerald-800" :
                        u.role === "Secretária" ? "bg-amber-100 text-amber-800" :
                        u.role === "Instrutor" ? "bg-cyan-100 text-cyan-800" :
                        "bg-slate-100 text-slate-800"
                      }`}>
                        {u.role}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-sm mt-1">{u.name}</h4>
                      <p className="text-[11px] text-slate-500">{u.email}</p>
                    </div>

                    {isActive && (
                      <span className="px-2 py-0.5 bg-emerald-600 text-white text-[9px] font-bold rounded-md flex items-center gap-1">
                        <UserCheck className="w-3 h-3" /> Conectado
                      </span>
                    )}
                  </div>

                  {/* Credentials Box */}
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1 font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[10px] font-bold uppercase">Login:</span>
                      <span className="font-bold text-slate-800">{u.username}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                      <span className="text-slate-400 text-[10px] font-bold uppercase">Senha:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800">
                          {showPass ? u.password : "••••••••"}
                        </span>
                        <button
                          onClick={() => setShowPasswords(prev => ({ ...prev, [u.id]: !prev[u.id] }))}
                          className="text-slate-400 hover:text-slate-600 p-0.5"
                          title="Mostrar/Ocultar Senha"
                        >
                          {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600 space-y-1">
                    <p><strong>Regional:</strong> {u.regional} ({u.unit})</p>
                    <p className="text-[10px] text-slate-500 leading-snug">
                      <strong>Menus permitidos:</strong>{" "}
                      {u.allowedMenus.map(m => {
                        const opt = MENU_OPTIONS.find(o => o.id === m);
                        return opt ? opt.label : m;
                      }).join(", ")}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => onSwitchUser(u)}
                      disabled={isActive}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                        isActive
                          ? "bg-slate-200 text-slate-400 cursor-default"
                          : "bg-slate-900 text-white hover:bg-slate-800 shadow-xs"
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>{isActive ? "Sessão Ativa" : "Entrar como este Usuário"}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenUserModal(u)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Editar Conta"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remover a conta do usuário '${u.name}'?`)) {
                            onDeleteUser(u.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Excluir Conta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: CLIENTS & INDUSTRIES */}
      {activeTab === "clients" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-600" />
                Cadastro de Clientes e Indústrias Parceiras
              </h3>
              <p className="text-xs text-slate-500">
                Cadastro centralizado de empresas contratantes com CNPJ e contatos para o Apoio Comercial.
              </p>
            </div>

            <button
              onClick={() => handleOpenClientModal()}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl transition-colors shadow-sm flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Cliente</span>
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por nome do cliente, CNPJ ou responsável..."
              value={clientSearch}
              onChange={(e) => setClientSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Client Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-extrabold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Razão Social / Empresa</th>
                  <th className="px-4 py-3">CNPJ</th>
                  <th className="px-4 py-3">Contato / SST</th>
                  <th className="px-4 py-3">E-mail / Telefone</th>
                  <th className="px-4 py-3">Regional / Cidade</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClients.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-extrabold text-slate-900">
                      {c.name}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-700">
                      {c.cnpj}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {c.contactName}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <div>{c.email}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{c.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      <span className="font-bold">{c.city}</span> ({c.regional})
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => handleOpenClientModal(c)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Editar Cliente"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remover o cadastro da empresa '${c.name}'?`)) {
                            onDeleteClient(c.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Excluir Cliente"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CUSTOM LOGO MANAGEMENT */}
      {activeTab === "logo" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-amber-500" />
                Inclusão de Logo Personalizada
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Envie uma imagem para substituir a marca exibida no cabeçalho e relatórios da plataforma.
              </p>
            </div>
            {logoSaveSuccess && (
              <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-600" />
                Logo salva com sucesso!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left side: Upload & Options */}
            <div className="space-y-5">
              {/* File Upload Area */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  1. Selecionar Arquivo de Imagem (PNG, JPG, WEBP, SVG)
                </label>
                <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 text-center bg-slate-50 hover:bg-blue-50/30 transition-all cursor-pointer relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="p-3 bg-white rounded-xl shadow-xs group-hover:scale-105 transition-transform">
                      <Upload className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-xs font-extrabold text-slate-800">
                      Clique aqui para selecionar a logo do seu computador
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Suporta arquivos de até 5MB (Formatos recomendados: PNG transparente ou SVG)
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct URL Option */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  2. Ou Cole uma URL da Imagem da Logo
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={logoUrlInput}
                    onChange={(e) => {
                      setLogoUrlInput(e.target.value);
                      if (e.target.value) setLogoPreview(e.target.value);
                    }}
                    placeholder="https://exemplo.com.br/sua-logo.png"
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleApplyCustomLogo}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Aplicar Logo Personalizada</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetToDefaultLogo}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Restaurar Logo Padrão SESI</span>
                </button>
              </div>
            </div>

            {/* Right side: Live Header Preview */}
            <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Pré-visualização ao Vivo no Cabeçalho
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Assim é como a marca será renderizada no topo do sistema e nas documentações:
              </p>

              {/* Header Box Preview */}
              <div className="bg-gradient-to-r from-blue-800 via-blue-900 to-sky-900 p-4 rounded-xl shadow-md border border-blue-700/50 flex items-center justify-between mt-3">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-300 flex items-center justify-center">
                    <SesiLogo className="h-7" variant="color" customLogoUrl={logoPreview} />
                  </div>
                  <div>
                    <span className="text-xs font-black text-white block">Gestão Integrada NR</span>
                    <span className="text-[9px] text-blue-200 font-semibold uppercase">SGN PRO</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1 mt-2">
                <span className="text-[10px] font-bold uppercase text-slate-400">Status Atual da Logo</span>
                <p className="font-extrabold text-slate-800">
                  {logoPreview ? "🟢 Logo Personalizada Ativa" : "🔵 Logo Padrão SESI Ativa"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HOLIDAY MODAL */}
      {isHolidayModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">
              {editingHoliday ? "Editar Feriado" : "Cadastrar Novo Feriado"}
            </h3>

            <form onSubmit={handleSaveHoliday} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nome do Feriado *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Aniversário do Município"
                  value={holidayName}
                  onChange={(e) => setHolidayName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Data *</label>
                  <input
                    type="date"
                    required
                    value={holidayDate}
                    onChange={(e) => setHolidayDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tipo de Feriado *</label>
                  <select
                    value={holidayType}
                    onChange={(e) => setHolidayType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                  >
                    <option value="Geral">Nacional / Geral</option>
                    <option value="Local">Local / Municipal</option>
                  </select>
                </div>
              </div>

              {holidayType === "Local" && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-purple-50 rounded-xl border border-purple-200">
                  <div>
                    <label className="font-bold text-purple-900 block mb-1">Regional *</label>
                    <select
                      value={holidayRegional}
                      onChange={(e) => setHolidayRegional(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 bg-white border border-purple-300 rounded-lg"
                    >
                      <option value="Oeste">Oeste</option>
                      <option value="Serrana">Serrana</option>
                      <option value="Norte">Norte</option>
                      <option value="Litoral">Litoral</option>
                      <option value="Vale do Itajaí">Vale do Itajaí</option>
                      <option value="Centro-Norte">Centro-Norte</option>
                      <option value="Sul">Sul</option>
                      <option value="Sudeste">Sudeste</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-purple-900 block mb-1">Cidade / Município</label>
                    <input
                      type="text"
                      placeholder="ex: Chapecó"
                      value={holidayCity}
                      onChange={(e) => setHolidayCity(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-purple-300 rounded-lg"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Descrição Opcional</label>
                <input
                  type="text"
                  placeholder="ex: Decreto municipal nº 452/2026"
                  value={holidayDescription}
                  onChange={(e) => setHolidayDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsHolidayModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-extrabold rounded-xl hover:bg-blue-700 shadow-sm"
                >
                  Salvar Feriado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* USER MODAL */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">
              {editingUser ? "Editar Conta de Usuário" : "Cadastrar Nova Conta de Usuário"}
            </h3>

            <form onSubmit={handleSaveUser} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Roberto Carlos"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nome de Usuário (Login) *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: roberto.carlos"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Senha de Acesso *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: 123456"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Perfil de Acesso / Função *</label>
                <select
                  value={roleInput}
                  onChange={(e) => handleRoleChange(e.target.value as AccessProfile)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 font-bold"
                >
                  <option value="Supervisão">Supervisão / Coordenação (Acesso Total)</option>
                  <option value="PCP">PCP / Operação (Turmas & Instrutores)</option>
                  <option value="Comercial">Comercial (Apoio Comercial)</option>
                  <option value="Secretária">Secretária Acadêmica</option>
                  <option value="Instrutor">Instrutor de Ensino (Portal do Instrutor)</option>
                  <option value="Faturamento">Faturamento / Financeiro</option>
                </select>
              </div>

              {/* Allowed Menus Checkboxes */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 text-xs block">
                    Menus e Módulos Permitidos ({allowedMenusInput.length})
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">Apenas menus marcados ficarão visíveis</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  {MENU_OPTIONS.map(menu => (
                    <label key={menu.id} className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 hover:text-slate-950 p-1 hover:bg-white rounded transition-colors">
                      <input
                        type="checkbox"
                        checked={allowedMenusInput.includes(menu.id)}
                        onChange={() => handleToggleMenuPermission(menu.id)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>{menu.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Regional *</label>
                  <select
                    value={regionalInput}
                    onChange={(e) => setRegionalInput(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                  >
                    <option value="Oeste">Oeste</option>
                    <option value="Serrana">Serrana</option>
                    <option value="Norte">Norte</option>
                    <option value="Litoral">Litoral</option>
                    <option value="Vale do Itajaí">Vale do Itajaí</option>
                    <option value="Centro-Norte">Centro-Norte</option>
                    <option value="Sul">Sul</option>
                    <option value="Sudeste">Sudeste</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Unidade *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Chapecó"
                    value={unitInput}
                    onChange={(e) => setUnitInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white font-extrabold rounded-xl hover:bg-emerald-700 shadow-sm"
                >
                  Salvar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CLIENT MODAL */}
      {isClientModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">
              {editingClient ? "Editar Cadastro de Cliente" : "Cadastrar Novo Cliente / Indústria"}
            </h3>

            <form onSubmit={handleSaveClient} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Razão Social / Nome da Empresa *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Empresa Metalúrgica SC S.A."
                  value={cliName}
                  onChange={(e) => setCliName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">CNPJ</label>
                  <input
                    type="text"
                    placeholder="00.000.000/0001-00"
                    value={cliCnpj}
                    onChange={(e) => setCliCnpj(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contato Responsável</label>
                  <input
                    type="text"
                    placeholder="ex: João da Silva (SST)"
                    value={cliContact}
                    onChange={(e) => setCliContact(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">E-mail</label>
                  <input
                    type="email"
                    placeholder="contato@empresa.com.br"
                    value={cliEmail}
                    onChange={(e) => setCliEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Telefone</label>
                  <input
                    type="text"
                    placeholder="(47) 3333-0000"
                    value={cliPhone}
                    onChange={(e) => setCliPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Regional *</label>
                  <select
                    value={cliRegional}
                    onChange={(e) => setCliRegional(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                  >
                    <option value="Oeste">Oeste</option>
                    <option value="Serrana">Serrana</option>
                    <option value="Norte">Norte</option>
                    <option value="Litoral">Litoral</option>
                    <option value="Vale do Itajaí">Vale do Itajaí</option>
                    <option value="Centro-Norte">Centro-Norte</option>
                    <option value="Sul">Sul</option>
                    <option value="Sudeste">Sudeste</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cidade</label>
                  <input
                    type="text"
                    placeholder="ex: Chapecó"
                    value={cliCity}
                    onChange={(e) => setCliCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsClientModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white font-extrabold rounded-xl hover:bg-purple-700 shadow-sm"
                >
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
