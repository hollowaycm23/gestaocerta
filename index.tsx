import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  LayoutDashboard, 
  Users, 
  Wrench, 
  DollarSign, 
  Truck, 
  AlertTriangle, 
  FileText, 
  Settings, 
  Bell, 
  Menu, 
  Search, 
  MoreVertical, 
  LogOut, 
  UploadCloud, 
  Eye, 
  Trash2, 
  X,
  Plus,
  Filter,
  Download,
  CheckCircle,
  Clock,
  Home,
  Database,
  Calendar,
  ChevronDown,
  Edit,
  User,
  Shield
} from 'lucide-react';

// --- MOCK DATA ---

const MOCK_CONDOS = [
  { id: 1, name: 'Residencial Horizonte', cnpj: '12.345.678/0001-90', address: 'Rua das Flores, 123', syndic: 'Carlos Silva' },
  { id: 2, name: 'Edifício Solar', cnpj: '98.765.432/0001-12', address: 'Av. do Sol, 456', syndic: 'Ana Souza' }
];

const MOCK_UNITS = [
  { id: 1, condoId: 1, number: '101', block: 'A', responsible: 'João Silva', type: 'owner', status: 'paid' },
  { id: 2, condoId: 1, number: '102', block: 'A', responsible: 'Maria Souza', type: 'tenant', status: 'debt' },
  { id: 3, condoId: 1, number: '103', block: 'B', responsible: '-', type: 'vacant', status: 'debt' },
  { id: 4, condoId: 1, number: '104', block: 'B', responsible: 'Pedro Santos', type: 'owner', status: 'paid' },
  { id: 5, condoId: 1, number: '105', block: 'C', responsible: 'Ana Pereira', type: 'owner', status: 'paid' },
  { id: 6, condoId: 1, number: '106', block: 'C', responsible: 'Carlos Lima', type: 'tenant', status: 'debt' },
  // Condo 2 data
  { id: 7, condoId: 2, number: '10', block: 'Unique', responsible: 'Fernanda Lima', type: 'owner', status: 'paid' }
];

const MOCK_RESIDENTS = [
  { id: 1, condoId: 1, name: 'João Silva', email: 'joao@email.com', phone: '(11) 9999-0001', unit: '101 - A', occupants: 3 },
  { id: 2, condoId: 1, name: 'Maria Souza', email: 'maria@email.com', phone: '(11) 9999-0002', unit: '102 - A', occupants: 2 },
  { id: 3, condoId: 1, name: 'Pedro Santos', email: 'pedro@email.com', phone: '(11) 9999-0003', unit: '104 - B', occupants: 4 },
  { id: 4, condoId: 1, name: 'Ana Pereira', email: 'ana@email.com', phone: '(11) 9999-0004', unit: '105 - C', occupants: 1 },
  { id: 5, condoId: 1, name: 'Carlos Lima', email: 'carlos@email.com', phone: '(11) 9999-0005', unit: '106 - C', occupants: 2 },
];

const MOCK_MAINTENANCE = [
  { id: 1, condoId: 1, item: 'Elevador Bloco A', date: '2023-11-24', validUntil: '2024-11-24', type: 'preventive', status: 'scheduled', supplier: 'TechElevators' },
  { id: 2, condoId: 1, item: 'Lâmpadas Hall', date: '2023-11-19', validUntil: '', type: 'corrective', status: 'completed', supplier: 'Zelador' },
  { id: 3, condoId: 1, item: 'Bomba Piscina', date: '2023-11-27', validUntil: '2024-05-27', type: 'preventive', status: 'scheduled', supplier: 'PoolService' },
  { id: 4, condoId: 1, item: 'Portão Garagem', date: '2023-11-14', validUntil: '', type: 'corrective', status: 'cancelled', supplier: 'Serralheria' },
  { id: 5, condoId: 1, item: 'Jardinagem', date: '2023-11-21', validUntil: '', type: 'routine', status: 'pending', supplier: 'Jardinagem Verde' }
];

const MOCK_SUPPLIERS = [
  { id: 1, condoId: 1, name: 'ABC Ltda', category: 'Manutenção', contact: '(11) 9999-8888', contractStart: '2023-01-01', contractEnd: '2024-01-01', status: 'active' },
  { id: 2, condoId: 1, name: 'Imobiliária Centro', category: 'Administrativo', contact: '(11) 7777-6666', contractStart: '2023-05-01', contractEnd: '2025-05-01', status: 'active' },
  { id: 3, condoId: 1, name: 'Distribuidora XYZ', category: 'Insumos', contact: '(11) 5555-4444', contractStart: '2022-01-01', contractEnd: '2022-12-31', status: 'inactive' },
  { id: 4, condoId: 1, name: 'TechElevators', category: 'Manutenção', contact: '(11) 3333-2222', contractStart: '2023-01-01', contractEnd: '2024-01-01', status: 'active' },
  { id: 5, condoId: 1, name: 'Segurança Total', category: 'Segurança', contact: '(11) 2222-1111', contractStart: '2023-06-01', contractEnd: '2024-06-01', status: 'active' },
];

const MOCK_FINANCE = [
  { id: 1, condoId: 1, description: 'Aluguel 101', category: 'Aluguel', date: '2023-11-04', type: 'income', amount: 2500.00, status: 'paid', dueDate: '2023-11-05' },
  { id: 2, condoId: 1, description: 'Material Limpeza', category: 'Serviços', date: '2023-11-10', type: 'expense', amount: 350.00, status: 'pending', dueDate: '2023-11-15' },
  { id: 3, condoId: 1, description: 'Manutenção Elevador', category: 'Manutenção', date: '2023-11-12', type: 'expense', amount: 1200.00, status: 'pending', dueDate: '2023-11-20' },
  { id: 4, condoId: 1, description: 'Aluguel 104', category: 'Aluguel', date: '2023-11-05', type: 'income', amount: 2500.00, status: 'paid', dueDate: '2023-11-05' },
  { id: 5, condoId: 1, description: 'Aluguel 105', category: 'Aluguel', date: '2023-12-04', type: 'income', amount: 2500.00, status: 'paid', dueDate: '2023-12-05' },
  { id: 6, condoId: 1, description: 'Conta de Luz', category: 'Utilidades', date: '2023-11-14', type: 'expense', amount: 500.00, status: 'pending', dueDate: '2023-11-25' },
];

const MOCK_INFRACTIONS = [
  { id: 1, condoId: 1, unit: '102', type: 'Barulho Excessivo', date: '2023-11-19', fine: 250.00, status: 'defense_pending', recurrence: 1 },
  { id: 2, condoId: 1, unit: '106', type: 'Estacionamento Irregular', date: '2023-11-17', fine: 150.00, status: 'fined', recurrence: 2 },
  { id: 3, condoId: 1, unit: '101', type: 'Mudança fora de horário', date: '2023-11-09', fine: 500.00, status: 'appeal', recurrence: 1 },
];

const MOCK_DOCUMENTS = [
  { 
    id: 1, 
    condoId: 1,
    title: 'AVCB - Auto de Vistoria', 
    category: 'Legal', 
    issueDate: '2023-05-09', 
    validUntil: '2023-10-30', // Vencido
    permanent: false,
    fileData: null as string | null,
    fileName: ''
  },
  { 
    id: 2, 
    condoId: 1,
    title: 'Apólice de Seguro Predial', 
    category: 'Seguros', 
    issueDate: '2023-01-14', 
    validUntil: '2024-01-14', // Vigente
    permanent: false,
    fileData: null as string | null,
    fileName: ''
  },
  { 
    id: 3, 
    condoId: 1,
    title: 'Laudo SPDA (Para-raios)', 
    category: 'Manutenção', 
    issueDate: '2022-10-19', 
    validUntil: '2023-12-09', // A vencer
    permanent: false,
    fileData: null as string | null,
    fileName: ''
  },
  {
    id: 4,
    condoId: 1,
    title: 'Planta Hidráulica',
    category: 'Plantas',
    issueDate: '2009-12-30',
    validUntil: '',
    permanent: true,
    fileData: null,
    fileName: ''
  }
];

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'Manutenção Elevador', message: 'Manutenção programada para amanhã às 14h.', read: false, date: '2023-11-23' },
  { id: 2, title: 'Nova Infração', message: 'Unidade 102 registrou defesa.', read: false, date: '2023-11-20' },
  { id: 3, title: 'Boleto Vencendo', message: 'Conta de Luz vence hoje.', read: true, date: '2023-11-25' },
];

const MOCK_USERS = [
  { id: 1, name: 'Carlos Síndico', email: 'carlos@horizonte.com', role: 'Síndico', status: 'active', permittedCondos: [1, 2] },
  { id: 2, name: 'Ana Admin', email: 'ana@admin.com', role: 'Administradora', status: 'active', permittedCondos: [2] },
  { id: 3, name: 'João Porteiro', email: 'joao@portaria.com', role: 'Portaria', status: 'inactive', permittedCondos: [1] },
];

const MOCK_REGULATIONS = [
  { id: 1, condoId: 1, article: 'Art. 32', description: 'Barulho Excessivo', severity: 'Média', defaultFine: 250.00 },
  { id: 2, condoId: 1, article: 'Art. 15', description: 'Estacionamento Irregular', severity: 'Leve', defaultFine: 150.00 },
  { id: 3, condoId: 1, article: 'Art. 40', description: 'Mudança fora de horário', severity: 'Grave', defaultFine: 500.00 },
];

// --- COMPONENTS ---

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700',
    inactive: 'bg-slate-100 text-slate-700',
    paid: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    debt: 'bg-rose-100 text-rose-700',
    overdue: 'bg-rose-100 text-rose-700',
    scheduled: 'bg-blue-100 text-blue-700',
    completed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-slate-200 text-slate-600',
    routine: 'bg-indigo-100 text-indigo-700',
    registered: 'bg-blue-50 text-blue-700',
    defense_pending: 'bg-amber-100 text-amber-700',
    fined: 'bg-rose-100 text-rose-700',
    appeal: 'bg-purple-100 text-purple-700',
    archived: 'bg-slate-100 text-slate-600',
    valid: 'bg-emerald-100 text-emerald-700',
    expiring_soon: 'bg-amber-100 text-amber-700',
    expired: 'bg-rose-100 text-rose-700',
    permanent: 'bg-blue-100 text-blue-700'
  };
  
  const labels: Record<string, string> = {
    active: 'Ativo',
    inactive: 'Inativo',
    paid: 'Adimplente',
    pending: 'Pendente',
    debt: 'Inadimplente',
    overdue: 'Vencido',
    scheduled: 'Agendado',
    completed: 'Concluído',
    cancelled: 'Cancelada',
    routine: 'Rotina',
    registered: 'Registrada',
    defense_pending: 'Aguardando Defesa',
    fined: 'Multado',
    appeal: 'Em Recurso',
    archived: 'Arquivada',
    valid: 'Vigente',
    expiring_soon: 'A Vencer',
    expired: 'Vencido',
    permanent: 'Permanente'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.active}`}>
      {labels[status] || status}
    </span>
  );
};

const Card = ({ title, children, className = "" }: { title?: string, children?: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-xl border border-slate-200 shadow-sm p-6 ${className}`}>
    {title && <h3 className="text-slate-500 text-sm font-medium mb-4 uppercase tracking-wider">{title}</h3>}
    {children}
  </div>
);

const StatCard = ({ title, value, subtext, icon: Icon, trend }: any) => (
  <Card>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h4 className="text-2xl font-bold text-slate-800">{value}</h4>
        {subtext && <p className={`text-xs mt-2 ${trend === 'negative' ? 'text-rose-600' : trend === 'positive' ? 'text-emerald-600' : 'text-slate-400'}`}>{subtext}</p>}
      </div>
      <div className="p-3 bg-slate-50 rounded-lg text-slate-600">
        <Icon size={20} />
      </div>
    </div>
  </Card>
);

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children?: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold text-lg text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors"><X size={20} className="text-slate-400" /></button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- VIEWS ---

const DashboardView = ({ currentCondoId, financeData, unitsData, maintenanceData, documentsData }: any) => {
  const condoFinance = financeData.filter((f: any) => f.condoId === currentCondoId);
  const condoUnits = unitsData.filter((u: any) => u.condoId === currentCondoId);
  const condoMaintenance = maintenanceData.filter((m: any) => m.condoId === currentCondoId);
  const condoDocs = documentsData.filter((d: any) => d.condoId === currentCondoId);

  // Financial Calcs
  const income = condoFinance.filter((t: any) => t.type === 'income' && t.status === 'paid').reduce((acc: number, curr: any) => acc + curr.amount, 0);
  const expense = condoFinance.filter((t: any) => t.type === 'expense' && t.status === 'paid').reduce((acc: number, curr: any) => acc + curr.amount, 0);
  const balance = income - expense;
  
  const pendingIncome = condoFinance.filter((t: any) => t.type === 'income' && t.status === 'pending').reduce((acc: number, curr: any) => acc + curr.amount, 0);
  const pendingExpense = condoFinance.filter((t: any) => t.type === 'expense' && t.status === 'pending').reduce((acc: number, curr: any) => acc + curr.amount, 0);
  const projectedBalance = balance + pendingIncome - pendingExpense;

  // Operational Calcs
  const debtUnits = condoUnits.filter((u: any) => u.status === 'debt').length;
  const debtPercentage = (debtUnits / condoUnits.length * 100).toFixed(1);

  const occupiedUnits = condoUnits.filter((u: any) => u.type !== 'vacant').length;
  const occupancyRate = (occupiedUnits / condoUnits.length * 100).toFixed(0);

  const pendingMaintenance = condoMaintenance.filter((m: any) => m.status === 'pending' || m.status === 'scheduled').length;
  
  // Document Calcs
  const today = new Date();
  const expiringDocs = condoDocs.filter((d: any) => {
    if (d.permanent) return false;
    if (!d.validUntil) return false;
    const validDate = new Date(d.validUntil);
    const diffTime = validDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30; // Expired or expiring in 30 days
  }).length;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Visão Geral</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Saldo em Caixa" value={`R$ ${balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} subtext="Atualizado hoje" icon={DollarSign} />
        <StatCard title="Saldo Projetado" value={`R$ ${projectedBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} subtext={`A Pagar: ${pendingExpense.toLocaleString()}`} icon={Clock} />
        <StatCard title="Inadimplência" value={`${debtUnits} Unidades`} subtext={`${debtPercentage}% do total`} trend="negative" icon={AlertTriangle} />
        <StatCard title="Manutenção" value={pendingMaintenance} subtext="Ordens pendentes" icon={Wrench} />
        <StatCard title="Ocupação" value={`${occupancyRate}%`} subtext="Unidades ocupadas" icon={Users} />
        <StatCard title="Documentos" value={expiringDocs} subtext="Vencidos ou a Vencer" trend={expiringDocs > 0 ? "negative" : "positive"} icon={FileText} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Próximas Manutenções" className="lg:col-span-2">
           <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
               <thead className="text-xs text-slate-500 bg-slate-50 uppercase">
                 <tr>
                   <th className="px-4 py-3">Item</th>
                   <th className="px-4 py-3">Data</th>
                   <th className="px-4 py-3">Status</th>
                   <th className="px-4 py-3 text-right">Ação</th>
                 </tr>
               </thead>
               <tbody>
                 {condoMaintenance.slice(0, 5).map((item: any) => (
                   <tr key={item.id} className="border-b last:border-0 hover:bg-slate-50">
                     <td className="px-4 py-3 font-medium text-slate-800">{item.item}</td>
                     <td className="px-4 py-3 text-slate-600">{new Date(item.date).toLocaleDateString('pt-BR')}</td>
                     <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                     <td className="px-4 py-3 text-right">
                       <button className="text-indigo-600 hover:text-indigo-800 font-medium text-xs">Detalhes</button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </Card>
        
        <Card title="Fluxo Recente">
          <div className="space-y-4">
            {condoFinance.slice(0, 5).map((item: any) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-full ${item.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                     {item.type === 'income' ? <DollarSign size={16} /> : <DollarSign size={16} />}
                   </div>
                   <div>
                     <p className="text-sm font-medium text-slate-800">{item.description}</p>
                     <p className="text-xs text-slate-500">{item.category}</p>
                   </div>
                </div>
                <span className={`text-sm font-bold ${item.type === 'income' ? 'text-emerald-600' : 'text-slate-800'}`}>
                  {item.type === 'income' ? '+' : '-'} R$ {item.amount.toLocaleString()}
                </span>
              </div>
            ))}
            <button className="w-full text-center text-sm text-indigo-600 hover:text-indigo-800 font-medium py-2">Ver Extrato Completo</button>
          </div>
        </Card>
      </div>
    </div>
  );
};

const UnitsView = ({ currentCondoId, data, residentsData, onUpdate }: any) => {
  const [editingUnit, setEditingUnit] = useState<any>(null);
  
  const displayData = data.filter((u: any) => u.condoId === currentCondoId);
  const condoResidents = residentsData.filter((r: any) => r.condoId === currentCondoId);

  const handleEdit = (unit: any) => {
    setEditingUnit({...unit});
  };

  const handleSave = () => {
    onUpdate(data.map((u: any) => u.id === editingUnit.id ? editingUnit : u));
    setEditingUnit(null);
  };

  const handleCreate = () => {
    const newUnit = { 
      id: Date.now(), 
      condoId: currentCondoId,
      number: '', 
      block: '', 
      responsible: '', 
      type: 'owner', 
      status: 'paid' 
    };
    setEditingUnit(newUnit);
  };

  const handleDelete = (id: number) => {
    if (typeof window !== 'undefined' && window.confirm('Excluir unidade?')) {
      onUpdate(data.filter((u: any) => u.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Unidades</h2>
        <button onClick={handleCreate} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 shadow-sm">
          <Plus size={18} /> Nova Unidade
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Unidade</th>
                <th className="px-6 py-4">Responsável</th>
                <th className="px-6 py-4">Ocupação</th>
                <th className="px-6 py-4">Situação Financeira</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((unit: any) => (
                <tr key={unit.id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{unit.number} - Bloco {unit.block}</td>
                  <td className="px-6 py-4 text-slate-600">{unit.responsible}</td>
                  <td className="px-6 py-4 text-slate-600 capitalize">{unit.type === 'owner' ? 'Proprietário' : unit.type === 'tenant' ? 'Inquilino' : 'Vazia'}</td>
                  <td className="px-6 py-4"><StatusBadge status={unit.status} /></td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEdit(unit)} className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={!!editingUnit} onClose={() => setEditingUnit(null)} title={editingUnit?.id ? "Editar Unidade" : "Nova Unidade"}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Unidade</label>
              <input type="text" value={editingUnit?.number || ''} onChange={e => setEditingUnit({...editingUnit, number: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white" placeholder="Ex: 101" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Bloco</label>
              <input type="text" value={editingUnit?.block || ''} onChange={e => setEditingUnit({...editingUnit, block: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white" placeholder="Ex: A" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Responsável</label>
            <select 
              value={editingUnit?.responsible || ''} 
              onChange={e => setEditingUnit({...editingUnit, responsible: e.target.value})} 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
            >
              <option value="">Selecione...</option>
              {condoResidents.map((r: any) => (
                <option key={r.id} value={r.name}>{r.name} (Unidade {r.unit})</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Tipo de Ocupação</label>
              <select value={editingUnit?.type || 'owner'} onChange={e => setEditingUnit({...editingUnit, type: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white">
                <option value="owner">Proprietário</option>
                <option value="tenant">Inquilino</option>
                <option value="vacant">Unidade Vazia</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Situação Financeira</label>
              <select value={editingUnit?.status || 'paid'} onChange={e => setEditingUnit({...editingUnit, status: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white">
                <option value="paid">Adimplente</option>
                <option value="debt">Inadimplente</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button onClick={() => setEditingUnit(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancelar</button>
            <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Salvar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const MaintenanceView = ({ currentCondoId, data, suppliers, onUpdate }: any) => {
  const [filter, setFilter] = useState('all');
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const displayData = data.filter((m: any) => m.condoId === currentCondoId);
  const filteredData = filter === 'all' ? displayData : displayData.filter((item: any) => item.status === filter);
  const condoSuppliers = suppliers.filter((s: any) => s.condoId === currentCondoId);

  const handleAction = (id: number, action: string) => {
    if (action === 'edit') {
       const item = displayData.find((i: any) => i.id === id);
       setEditingItem({...item});
    } else {
       let newStatus = action === 'complete' ? 'completed' : action === 'cancel' ? 'cancelled' : action === 'schedule' ? 'scheduled' : 'pending';
       if (action === 'pending') newStatus = 'pending';
       onUpdate(data.map((item: any) => item.id === id ? { ...item, status: newStatus } : item));
    }
  };

  const handleSave = () => {
     if (editingItem.id) {
        onUpdate(data.map((item: any) => item.id === editingItem.id ? editingItem : item));
     } else {
        onUpdate([...data, { ...editingItem, id: Date.now(), condoId: currentCondoId, status: 'scheduled' }]);
     }
     setEditingItem(null);
  };

  const handleCreate = () => {
    setEditingItem({ item: '', date: '', validUntil: '', type: 'preventive', supplier: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Plano de Manutenção</h2>
        <button onClick={handleCreate} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 shadow-sm">
          <Plus size={18} /> Nova O.S.
        </button>
      </div>

      <Card>
        <div className="flex gap-2 mb-6">
          {['all', 'pending'].map((f) => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
            >
              {f === 'all' ? 'Todas' : 'Pendentes'}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-slate-50 uppercase">
              <tr>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Data Programada</th>
                <th className="px-4 py-3">Validade</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item: any) => (
                <tr key={item.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{item.item}</p>
                    <p className="text-xs text-slate-500">{item.supplier}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{new Date(item.date).toLocaleDateString('pt-BR')}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {item.validUntil ? new Date(item.validUntil).toLocaleDateString('pt-BR') : '-'}
                  </td>
                  <td className="px-4 py-3 capitalize text-slate-600">{item.type === 'preventive' ? 'Preventiva' : item.type === 'corrective' ? 'Corretiva' : 'Rotina'}</td>
                  <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                  <td className="px-4 py-3 text-right group relative">
                     <button className="text-slate-400 hover:text-indigo-600"><Settings size={18} /></button>
                     <div className="absolute right-0 top-8 w-40 bg-white rounded-lg shadow-xl border border-slate-100 hidden group-hover:block z-10">
                       <button onClick={() => handleAction(item.id, 'edit')} className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 text-slate-700">Editar</button>
                       <button onClick={() => handleAction(item.id, 'schedule')} className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 text-blue-600">Agendar</button>
                       <button onClick={() => handleAction(item.id, 'pending')} className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 text-amber-600">Pendente</button>
                       <button onClick={() => handleAction(item.id, 'complete')} className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 text-emerald-600">Concluir</button>
                       <button onClick={() => handleAction(item.id, 'cancel')} className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 text-rose-600">Cancelar</button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={!!editingItem} onClose={() => setEditingItem(null)} title={editingItem?.id ? "Editar O.S." : "Nova Ordem de Serviço"}>
        <div className="space-y-4">
           <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Item / Equipamento</label>
              <input type="text" value={editingItem?.item || ''} onChange={e => setEditingItem({...editingItem, item: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white" />
           </div>
           <div>
             <label className="block text-xs font-medium text-slate-500 mb-1">Fornecedor</label>
             <select value={editingItem?.supplier || ''} onChange={e => setEditingItem({...editingItem, supplier: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white">
               <option value="">Selecione...</option>
               {condoSuppliers.map((s: any) => <option key={s.id} value={s.name}>{s.name} ({s.category})</option>)}
             </select>
           </div>
           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-xs font-medium text-slate-500 mb-1">Tipo</label>
               <select value={editingItem?.type || 'preventive'} onChange={e => setEditingItem({...editingItem, type: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white">
                 <option value="preventive">Preventiva</option>
                 <option value="corrective">Corretiva</option>
               </select>
             </div>
             <div>
               <label className="block text-xs font-medium text-slate-500 mb-1">Data Execução / Programada</label>
               <input type="date" value={editingItem?.date || ''} onChange={e => setEditingItem({...editingItem, date: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white" />
             </div>
           </div>
           {editingItem?.type === 'preventive' && (
             <div>
               <label className="block text-xs font-medium text-slate-500 mb-1">Data de Validade (Legislação)</label>
               <input type="date" value={editingItem?.validUntil || ''} onChange={e => setEditingItem({...editingItem, validUntil: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white" />
             </div>
           )}
           <button onClick={handleSave} className="w-full bg-indigo-600 text-white py-2 rounded-lg mt-4">Salvar</button>
        </div>
      </Modal>
    </div>
  );
};

const FinanceView = ({ currentCondoId, data, suppliers, onUpdate }: any) => {
  const [showModal, setShowModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [newEntry, setNewEntry] = useState({ description: '', category: '', amount: '', type: 'expense', date: new Date().toISOString().split('T')[0], supplier: '', dueDate: new Date().toISOString().split('T')[0] });
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [reportFormat, setReportFormat] = useState('');
  
  const displayData = data.filter((f: any) => f.condoId === currentCondoId);
  const condoSuppliers = suppliers.filter((s: any) => s.condoId === currentCondoId);

  const filteredData = useMemo(() => {
    return displayData.filter((item: any) => {
      if (!dateRange.start && !dateRange.end) return true;
      const itemDate = new Date(item.date);
      const start = dateRange.start ? new Date(dateRange.start) : new Date(0);
      const end = dateRange.end ? new Date(dateRange.end) : new Date(8640000000000000);
      return itemDate >= start && itemDate <= end;
    });
  }, [displayData, dateRange]);

  const handleSaveEntry = () => {
    onUpdate([...data, { 
      id: Date.now(),
      condoId: currentCondoId,
      ...newEntry, 
      amount: Number(newEntry.amount),
      status: 'pending' 
    }]);
    setShowModal(false);
    setNewEntry({ description: '', category: '', amount: '', type: 'expense', date: new Date().toISOString().split('T')[0], supplier: '', dueDate: new Date().toISOString().split('T')[0] });
  };

  const handleStatusChange = (id: number, status: string) => {
    onUpdate(data.map((item: any) => item.id === id ? { ...item, status } : item));
  };

  const handleGenerateReport = () => {
    if (!reportFormat) return alert('Selecione um formato');
    alert(`Gerando relatório em ${reportFormat.toUpperCase()}... Download iniciado.`);
    setShowReportModal(false);
  };

  // Finance Panel Calcs
  const currentBalance = displayData.filter((t: any) => t.status === 'paid').reduce((acc: number, curr: any) => acc + (curr.type === 'income' ? curr.amount : -curr.amount), 0);
  const toReceive = displayData.filter((t: any) => t.status === 'pending' && t.type === 'income').reduce((acc: number, curr: any) => acc + curr.amount, 0);
  const toPay = displayData.filter((t: any) => t.status === 'pending' && t.type === 'expense').reduce((acc: number, curr: any) => acc + curr.amount, 0);
  const projected = currentBalance + toReceive - toPay;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Financeiro</h2>
        <div className="flex gap-2">
           <button onClick={() => setShowReportModal(true)} className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2 shadow-sm">
             <FileText size={18} /> Relatórios
           </button>
           <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 shadow-sm">
             <Plus size={18} /> Novo Lançamento
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm border-b-4 border-b-emerald-500">
           <p className="text-xs text-slate-500 uppercase font-bold">Saldo em Caixa</p>
           <h3 className="text-xl font-bold text-slate-800 mt-1">R$ {currentBalance.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h3>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm border-b-4 border-b-emerald-300">
           <p className="text-xs text-slate-500 uppercase font-bold">A Receber (Previsão)</p>
           <h3 className="text-xl font-bold text-emerald-600 mt-1">R$ {toReceive.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h3>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm border-b-4 border-b-rose-300">
           <p className="text-xs text-slate-500 uppercase font-bold">A Pagar (Previsão)</p>
           <h3 className="text-xl font-bold text-rose-600 mt-1">R$ {toPay.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h3>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm border-b-4 border-b-indigo-500 bg-indigo-50">
           <p className="text-xs text-indigo-800 uppercase font-bold">Saldo Previsto Final</p>
           <h3 className="text-xl font-bold text-indigo-900 mt-1">R$ {projected.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h3>
           <p className="text-[10px] text-indigo-600">Saldo Caixa + Receber - Pagar</p>
        </div>
      </div>

      <Card>
        <div className="flex flex-wrap gap-4 mb-6 items-end bg-slate-50 p-4 rounded-lg">
           <div className="flex-1 min-w-[200px]">
             <label className="block text-xs font-medium text-slate-500 mb-1">Período Início</label>
             <input type="date" value={dateRange.start} onChange={e => setDateRange({...dateRange, start: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white" />
           </div>
           <div className="flex-1 min-w-[200px]">
             <label className="block text-xs font-medium text-slate-500 mb-1">Período Fim</label>
             <input type="date" value={dateRange.end} onChange={e => setDateRange({...dateRange, end: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white" />
           </div>
           <button onClick={() => setDateRange({start: '', end: ''})} className="px-4 py-2 text-sm text-slate-600 hover:text-indigo-600">Limpar Filtros</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Descrição</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Vencimento</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Valor</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item: any) => (
                <tr key={item.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">
                    <div className="flex items-center gap-2">
                       <div className={`p-1.5 rounded-full ${item.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                         {item.type === 'income' ? <DollarSign size={14} /> : <DollarSign size={14} />}
                       </div>
                       <div>
                         <p className="text-slate-800">{item.description}</p>
                         {item.supplier && <p className="text-[10px] text-slate-500 flex items-center gap-1"><Truck size={10} /> {item.supplier}</p>}
                       </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{item.category}</td>
                  <td className="px-4 py-3 text-slate-600">{new Date(item.date).toLocaleDateString('pt-BR')}</td>
                  <td className="px-4 py-3 text-slate-600">{item.dueDate ? new Date(item.dueDate).toLocaleDateString('pt-BR') : '-'}</td>
                  <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                  <td className={`px-4 py-3 text-right font-bold ${item.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {item.type === 'income' ? '+' : '-'} R$ {item.amount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                  </td>
                  <td className="px-4 py-3 text-right group relative">
                     <button className="text-slate-400 hover:text-indigo-600"><MoreVertical size={16} /></button>
                     <div className="absolute right-0 top-6 w-32 bg-white rounded-lg shadow-xl border border-slate-100 hidden group-hover:block z-10">
                        <button onClick={() => handleStatusChange(item.id, 'paid')} className="w-full text-left px-4 py-2 text-xs hover:bg-emerald-50 text-emerald-600">Marcar Pago</button>
                        <button onClick={() => handleStatusChange(item.id, 'pending')} className="w-full text-left px-4 py-2 text-xs hover:bg-amber-50 text-amber-600">Marcar Pendente</button>
                        <button onClick={() => handleStatusChange(item.id, 'overdue')} className="w-full text-left px-4 py-2 text-xs hover:bg-rose-50 text-rose-600">Marcar Vencido</button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Novo Lançamento">
        <div className="space-y-4">
          <div className="flex gap-4">
            <button onClick={() => setNewEntry({...newEntry, type: 'income'})} className={`flex-1 py-2 rounded-lg border ${newEntry.type === 'income' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-slate-200'}`}>Receita</button>
            <button onClick={() => setNewEntry({...newEntry, type: 'expense'})} className={`flex-1 py-2 rounded-lg border ${newEntry.type === 'expense' ? 'bg-rose-50 border-rose-500 text-rose-700' : 'border-slate-200'}`}>Despesa</button>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Descrição</label>
            <input type="text" value={newEntry.description} onChange={e => setNewEntry({...newEntry, description: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white" placeholder="Ex: Pagamento Fornecedor" />
          </div>
          {newEntry.type === 'expense' && (
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Fornecedor</label>
              <select value={newEntry.supplier} onChange={e => setNewEntry({...newEntry, supplier: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white">
                <option value="">Selecione...</option>
                {condoSuppliers.map((s: any) => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Categoria</label>
              <input type="text" value={newEntry.category} onChange={e => setNewEntry({...newEntry, category: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white" placeholder="Ex: Manutenção" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Data Vencimento</label>
              <input type="date" value={newEntry.dueDate} onChange={e => setNewEntry({...newEntry, dueDate: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Valor (R$)</label>
            <input type="number" value={newEntry.amount} onChange={e => setNewEntry({...newEntry, amount: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white" placeholder="0.00" />
          </div>
          <button onClick={handleSaveEntry} className="w-full bg-indigo-600 text-white py-2 rounded-lg mt-4">Salvar Lançamento</button>
        </div>
      </Modal>

      <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)} title="Exportar Relatórios">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border-2 border-slate-100 rounded-xl hover:border-indigo-100 cursor-pointer transition-all">
              <p className="font-semibold text-slate-800">Fluxo de Caixa</p>
              <p className="text-xs text-slate-500 mt-1">Entradas e saídas detalhadas</p>
            </div>
            <div className="p-4 border-2 border-slate-100 rounded-xl hover:border-indigo-100 cursor-pointer transition-all">
              <p className="font-semibold text-slate-800">Inadimplência</p>
              <p className="text-xs text-slate-500 mt-1">Relatório de devedores</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700 mb-3">Formato</p>
            <div className="flex gap-3">
               {['PDF', 'Excel', 'CSV'].map(fmt => (
                 <button 
                   key={fmt} 
                   onClick={() => setReportFormat(fmt)}
                   className={`flex-1 py-3 rounded-lg border text-sm font-medium flex flex-col items-center gap-2 ${reportFormat === fmt ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                 >
                   <FileText size={18} /> {fmt}
                 </button>
               ))}
            </div>
          </div>
          <button onClick={handleGenerateReport} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl shadow-lg shadow-indigo-200">
            Gerar Relatório
          </button>
        </div>
      </Modal>
    </div>
  );
};

const SuppliersView = ({ currentCondoId, data, onUpdate }: any) => {
  const [editingSupplier, setEditingSupplier] = useState<any>(null);
  const displayData = data.filter((s: any) => s.condoId === currentCondoId);

  const handleEdit = (supplier: any) => {
    setEditingSupplier({...supplier});
  };

  const handleSave = () => {
    if (editingSupplier.id) {
       onUpdate(data.map((s: any) => s.id === editingSupplier.id ? editingSupplier : s));
    } else {
       onUpdate([...data, { ...editingSupplier, id: Date.now(), condoId: currentCondoId, status: 'active' }]);
    }
    setEditingSupplier(null);
  };

  const handleDownloadContract = () => {
    const blob = new Blob(["CONTRATO DE PRESTAÇÃO DE SERVIÇOS\n\nEntre as partes..."], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Contrato_Prestacao_Servicos.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Fornecedores</h2>
        <button 
          onClick={() => setEditingSupplier({ name: '', category: '', contact: '', contractStart: '', contractEnd: '', status: 'active' })} 
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 shadow-sm"
        >
          <Plus size={18} /> Novo Fornecedor
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Nome</th>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4">Contato</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((s: any) => (
              <tr key={s.id} className="border-b last:border-0 hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-800">{s.name}</td>
                <td className="px-6 py-4 text-slate-600">{s.category}</td>
                <td className="px-6 py-4 text-slate-600">{s.contact}</td>
                <td className="px-6 py-4"><StatusBadge status={s.status} /></td>
                <td className="px-6 py-4 text-right flex justify-end gap-3">
                   <button type="button" onClick={handleDownloadContract} className="text-indigo-600 hover:text-indigo-800 text-xs font-medium">Contrato</button>
                   <button type="button" onClick={() => handleEdit(s)} className="text-slate-500 hover:text-indigo-600 text-xs font-medium">Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!editingSupplier} onClose={() => setEditingSupplier(null)} title={editingSupplier?.id ? "Editar Fornecedor" : "Novo Fornecedor"}>
         <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Razão Social / Nome</label>
              <input type="text" value={editingSupplier?.name || ''} onChange={e => setEditingSupplier({...editingSupplier, name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Categoria</label>
              <input type="text" value={editingSupplier?.category || ''} onChange={e => setEditingSupplier({...editingSupplier, category: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white" placeholder="Manutenção, Segurança..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Contato</label>
              <input type="text" value={editingSupplier?.contact || ''} onChange={e => setEditingSupplier({...editingSupplier, contact: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-xs font-medium text-slate-500 mb-1">Início Contrato</label>
                 <input type="date" value={editingSupplier?.contractStart || ''} onChange={e => setEditingSupplier({...editingSupplier, contractStart: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white" />
               </div>
               <div>
                 <label className="block text-xs font-medium text-slate-500 mb-1">Fim Contrato</label>
                 <input type="date" value={editingSupplier?.contractEnd || ''} onChange={e => setEditingSupplier({...editingSupplier, contractEnd: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white" />
               </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
              <select value={editingSupplier?.status || 'active'} onChange={e => setEditingSupplier({...editingSupplier, status: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white">
                 <option value="active">Ativo</option>
                 <option value="inactive">Inativo</option>
              </select>
            </div>
            <button onClick={handleSave} className="w-full bg-indigo-600 text-white py-2 rounded-lg mt-4">Salvar</button>
         </div>
      </Modal>
    </div>
  );
};

const InfractionsView = ({ currentCondoId, data, regulations, onUpdate, onUpdateRules }: any) => {
  const [activeTab, setActiveTab] = useState('occurrences');
  const [showModal, setShowModal] = useState(false);
  const [selectedInfraction, setSelectedInfraction] = useState<any>(null);
  
  // New Infraction Form
  const [newInfraction, setNewInfraction] = useState({ unit: '', typeId: '', date: new Date().toISOString().split('T')[0], description: '', manualRecurrence: false });
  
  const displayData = data.filter((i: any) => i.condoId === currentCondoId);
  const condoRegulations = regulations.filter((r: any) => r.condoId === currentCondoId);

  // Recurrence logic
  const existingCount = newInfraction.unit && newInfraction.typeId 
    ? displayData.filter((i: any) => i.unit === newInfraction.unit && i.type === condoRegulations.find((r:any) => r.id === Number(newInfraction.typeId))?.description).length 
    : 0;
  
  const handleSave = () => {
    const rule = condoRegulations.find((r: any) => r.id === Number(newInfraction.typeId));
    onUpdate([...data, {
      id: Date.now(),
      condoId: currentCondoId,
      unit: newInfraction.unit,
      type: rule?.description || 'Outros',
      date: newInfraction.date,
      fine: rule?.defaultFine || 0,
      status: 'defense_pending',
      recurrence: newInfraction.manualRecurrence ? existingCount + 2 : existingCount + 1
    }]);
    setShowModal(false);
    setNewInfraction({ unit: '', typeId: '', date: new Date().toISOString().split('T')[0], description: '', manualRecurrence: false });
  };

  const handleStatusChange = (status: string) => {
    if (selectedInfraction) {
       onUpdate(data.map((i: any) => i.id === selectedInfraction.id ? { ...i, status } : i));
       setSelectedInfraction({ ...selectedInfraction, status }); // Update local modal state
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Infrações e Regulação</h2>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 shadow-sm">
          <Plus size={18} /> Registrar Infração
        </button>
      </div>

      <Card>
        <div className="flex gap-4 border-b border-slate-100 mb-6">
           <button onClick={() => setActiveTab('occurrences')} className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'occurrences' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}>Ocorrências</button>
           <button onClick={() => setActiveTab('rules')} className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'rules' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}>Regimento Interno</button>
        </div>

        {activeTab === 'occurrences' ? (
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-slate-50 uppercase">
              <tr>
                <th className="px-4 py-3">Unidade</th>
                <th className="px-4 py-3">Tipo de Infração</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Reincidência</th>
                <th className="px-4 py-3">Valor Multa</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((item: any) => (
                <tr key={item.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold text-slate-800">Unit {item.unit}</td>
                  <td className="px-4 py-3 text-slate-600">{item.type}</td>
                  <td className="px-4 py-3 text-slate-600">{new Date(item.date).toLocaleDateString('pt-BR')}</td>
                  <td className="px-4 py-3">
                     <span className={`px-2 py-0.5 rounded text-xs font-bold ${item.recurrence > 1 ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
                        {item.recurrence}ª vez
                     </span>
                  </td>
                  <td className="px-4 py-3 font-medium">R$ {item.fine.toFixed(2)}</td>
                  <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setSelectedInfraction(item)} className="text-indigo-600 hover:text-indigo-800 font-medium text-xs">Detalhes</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>
             <div className="flex justify-end mb-4">
               <button className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded text-slate-600 font-medium">+ Adicionar Regra</button>
             </div>
             <table className="w-full text-sm text-left">
               <thead className="text-xs text-slate-500 bg-slate-50 uppercase">
                 <tr>
                    <th className="px-4 py-3">Artigo</th>
                    <th className="px-4 py-3">Descrição</th>
                    <th className="px-4 py-3">Gravidade</th>
                    <th className="px-4 py-3">Multa Padrão</th>
                 </tr>
               </thead>
               <tbody>
                 {condoRegulations.map((rule: any) => (
                   <tr key={rule.id} className="border-b last:border-0">
                      <td className="px-4 py-3 font-medium">{rule.article}</td>
                      <td className="px-4 py-3">{rule.description}</td>
                      <td className="px-4 py-3">{rule.severity}</td>
                      <td className="px-4 py-3">R$ {rule.defaultFine.toFixed(2)}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        )}
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Registrar Infração">
         <div className="space-y-4">
            <div>
               <label className="block text-xs font-medium text-slate-500 mb-1">Unidade</label>
               <input type="text" value={newInfraction.unit} onChange={e => setNewInfraction({...newInfraction, unit: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white" placeholder="Ex: 101" />
            </div>
            <div>
               <label className="block text-xs font-medium text-slate-500 mb-1">Tipo de Infração (Regimento)</label>
               <select value={newInfraction.typeId} onChange={e => setNewInfraction({...newInfraction, typeId: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white">
                  <option value="">Selecione...</option>
                  {condoRegulations.map((r: any) => <option key={r.id} value={r.id}>{r.article} - {r.description} (R$ {r.defaultFine})</option>)}
               </select>
            </div>
            {newInfraction.unit && newInfraction.typeId && existingCount > 0 && (
               <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2 rounded-lg text-xs flex items-center gap-2">
                  <AlertTriangle size={14} />
                   Atenção: Esta é a {existingCount + 1}ª ocorrência deste tipo para esta unidade.
               </div>
            )}
            <div className="flex items-center gap-2">
               <input type="checkbox" checked={newInfraction.manualRecurrence} onChange={e => setNewInfraction({...newInfraction, manualRecurrence: e.target.checked})} />
               <label className="text-xs text-slate-600">Marcar como Reincidente Manualmente</label>
            </div>
            <div>
               <label className="block text-xs font-medium text-slate-500 mb-1">Data</label>
               <input type="date" value={newInfraction.date} onChange={e => setNewInfraction({...newInfraction, date: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white" />
            </div>
            <button onClick={handleSave} className="w-full bg-indigo-600 text-white py-2 rounded-lg mt-4">Salvar</button>
         </div>
      </Modal>

      <Modal isOpen={!!selectedInfraction} onClose={() => setSelectedInfraction(null)} title="Detalhes da Infração">
         <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
               <div>
                  <p className="text-xs text-slate-500">Unidade</p>
                  <p className="font-medium">{selectedInfraction?.unit}</p>
               </div>
               <div>
                  <p className="text-xs text-slate-500">Data</p>
                  <p className="font-medium">{selectedInfraction?.date}</p>
               </div>
               <div className="col-span-2">
                  <p className="text-xs text-slate-500">Tipo</p>
                  <p className="font-medium">{selectedInfraction?.type}</p>
               </div>
               <div>
                  <p className="text-xs text-slate-500">Valor Multa</p>
                  <p className="font-medium text-rose-600">R$ {selectedInfraction?.fine.toFixed(2)}</p>
               </div>
               <div>
                  <p className="text-xs text-slate-500">Status</p>
                  <StatusBadge status={selectedInfraction?.status} />
               </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100">
               <p className="text-xs font-bold text-slate-700 mb-2">Alterar Status</p>
               <div className="flex flex-wrap gap-2">
                  <button onClick={() => handleStatusChange('defense_pending')} className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded text-xs hover:bg-amber-100">Aguardando Defesa</button>
                  <button onClick={() => handleStatusChange('fined')} className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded text-xs hover:bg-rose-100">Multado</button>
                  <button onClick={() => handleStatusChange('appeal')} className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded text-xs hover:bg-purple-100">Em Recurso</button>
               </div>
            </div>
         </div>
      </Modal>
    </div>
  );
};

const DocumentsView = ({ currentCondoId, data, onUpdate }: { currentCondoId: number, data: typeof MOCK_DOCUMENTS, onUpdate: (d: any) => void }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDoc, setNewDoc] = useState({ title: '', category: '', expiry: '', permanent: false, fileData: null as string | null, fileName: '' });
  const [viewingDoc, setViewingDoc] = useState<any>(null);
  
  // New State for Delete Confirmation
  const [docToDelete, setDocToDelete] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter for current condo
  const displayData = data.filter(d => d.condoId === currentCondoId);

  // Calculate dynamic status logic
  const processedData = displayData.map(doc => {
    let status = 'valid';
    if (doc.permanent) {
      status = 'permanent';
    } else if (doc.validUntil) {
      const today = new Date();
      const validDate = new Date(doc.validUntil);
      const diffTime = validDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) status = 'expired';
      else if (diffDays <= 30) status = 'expiring_soon';
      else status = 'valid';
    }
    return { ...doc, computedStatus: status };
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewDoc({ ...newDoc, fileData: reader.result as string, fileName: file.name });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdate([...data, { 
      id: Date.now(),
      condoId: currentCondoId,
      title: newDoc.title, 
      category: newDoc.category, 
      issueDate: new Date().toISOString().split('T')[0],
      validUntil: newDoc.permanent ? '' : newDoc.expiry,
      permanent: newDoc.permanent,
      fileData: newDoc.fileData // Store the file
    }]);
    setIsModalOpen(false);
    setNewDoc({ title: '', category: '', expiry: '', permanent: false, fileData: null, fileName: '' }); // Reset
  };

  const handleDeleteClick = (id: number) => {
    setDocToDelete(id);
  };

  const confirmDelete = () => {
    if (docToDelete) {
        onUpdate(data.filter(d => d.id !== docToDelete));
        setDocToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Documentos e Alvarás</h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 shadow-sm">
          <UploadCloud size={18} /> Upload Documento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {processedData.length > 0 ? processedData.map((doc) => (
          <div key={doc.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <FileText size={20} />
              </div>
              <StatusBadge status={doc.computedStatus} />
            </div>
            <h3 className="font-semibold text-slate-800 mb-1">{doc.title}</h3>
            <p className="text-xs text-slate-500 mb-4">{doc.category}</p>
            
            <div className="text-xs text-slate-600 space-y-1 mb-4">
              <p>Emissão: {new Date(doc.issueDate).toLocaleDateString('pt-BR')}</p>
              {!doc.permanent && <p>Validade: {new Date(doc.validUntil).toLocaleDateString('pt-BR')}</p>}
            </div>

            <div className="flex gap-2 pt-4 border-t border-slate-100">
              <button 
                type="button"
                onClick={() => setViewingDoc(doc)}
                className="flex-1 flex items-center justify-center gap-2 text-xs font-medium text-slate-600 hover:text-indigo-600 py-2 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <Eye size={14} /> Visualizar
              </button>
              <button 
                type="button"
                onClick={() => handleDeleteClick(doc.id)}
                className="flex-1 flex items-center justify-center gap-2 text-xs font-medium text-slate-600 hover:text-red-600 py-2 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <Trash2 size={14} /> Excluir
              </button>
            </div>
          </div>
        )) : (
          <div className="col-span-full text-center py-10 text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">
            Nenhum documento cadastrado.
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload de Documento">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Título do Documento</label>
            <input 
              type="text" 
              value={newDoc.title}
              onChange={e => setNewDoc({...newDoc, title: e.target.value})}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm bg-white"
              placeholder="Ex: Alvará de Funcionamento"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Categoria</label>
            <input 
              type="text" 
              value={newDoc.category}
              onChange={e => setNewDoc({...newDoc, category: e.target.value})}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm bg-white"
              placeholder="Legal, Manutenção, Plantas..."
            />
          </div>
          
          <label className="flex items-center gap-2 cursor-pointer py-1">
             <input type="checkbox" checked={newDoc.permanent} onChange={e => setNewDoc({...newDoc, permanent: e.target.checked})} className="rounded text-indigo-600 focus:ring-indigo-500" />
             <span className="text-sm text-slate-700 font-medium">Documento Permanente</span>
          </label>

          {!newDoc.permanent && (
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Data de Validade</label>
              <input 
                type="date" 
                value={newDoc.expiry}
                onChange={e => setNewDoc({...newDoc, expiry: e.target.value})}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm bg-white"
              />
            </div>
          )}

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            className="hidden" 
          />

          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer"
          >
             <UploadCloud size={24} className="mx-auto text-slate-400 mb-2" />
             <p className="text-sm text-slate-500">{newDoc.fileName || 'Clique para selecionar o arquivo'}</p>
             <p className="text-xs text-slate-400 mt-1">PDF, JPG ou PNG (Max 10MB)</p>
          </div>

          <button onClick={handleSave} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg">
            Salvar Documento
          </button>
        </div>
      </Modal>

      {/* View Document Modal */}
      <Modal isOpen={!!viewingDoc} onClose={() => setViewingDoc(null)} title={viewingDoc?.title || "Visualizar Documento"}>
        <div className="flex flex-col items-center justify-center min-h-[300px] bg-slate-100 rounded-lg border border-slate-200">
          {viewingDoc?.fileData ? (
             viewingDoc.fileData.startsWith('data:image') ? (
               <img src={viewingDoc.fileData} alt={viewingDoc.title} className="max-w-full max-h-[500px] object-contain" />
             ) : (
               <iframe src={viewingDoc.fileData} className="w-full h-[500px]" title="Document Viewer"></iframe>
             )
          ) : (
             <div className="text-center p-8">
               <FileText size={48} className="mx-auto text-slate-300 mb-4" />
               <p className="text-slate-500 font-medium">Visualização não disponível</p>
               <p className="text-xs text-slate-400 mt-2">Este é um documento simulado ou o arquivo original não foi carregado.</p>
             </div>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={!!docToDelete} 
        onClose={() => setDocToDelete(null)} 
        title="Confirmar Exclusão"
      >
        <div className="space-y-4">
            <p className="text-slate-600">
                Tem certeza que deseja excluir o documento <strong>{data.find(d => d.id === docToDelete)?.title}</strong>?
                <br/>Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-3 mt-4">
                <button 
                    onClick={() => setDocToDelete(null)}
                    className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors font-medium text-sm"
                >
                    Cancelar
                </button>
                <button 
                    onClick={confirmDelete}
                    className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium text-sm shadow-sm"
                >
                    Sim, Excluir
                </button>
            </div>
        </div>
      </Modal>
    </div>
  );
};

const SettingsView = ({ currentCondoId, data, users, condos, onUpdate, onUpdateUsers }: any) => {
  const [activeTab, setActiveTab] = useState('condo');
  const [editingUser, setEditingUser] = useState<any>(null);
  
  const condo = data.find((c: any) => c.id === currentCondoId) || {};

  const handleUpdateCondo = (field: string, value: string) => {
    onUpdate(data.map((c: any) => c.id === currentCondoId ? { ...c, [field]: value } : c));
  };

  const handleToggleStatus = (id: number) => {
     onUpdateUsers(users.map((u: any) => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
  };

  const handleSaveUser = () => {
    if (editingUser.id) {
       onUpdateUsers(users.map((u: any) => u.id === editingUser.id ? editingUser : u));
    } else {
       onUpdateUsers([...users, { ...editingUser, id: Date.now(), status: 'active' }]);
    }
    setEditingUser(null);
  };

  const handleCondoPermissionChange = (condoId: number) => {
     const currentPermissions = editingUser.permittedCondos || [];
     let newPermissions;
     if (currentPermissions.includes(condoId)) {
        newPermissions = currentPermissions.filter((id: number) => id !== condoId);
     } else {
        newPermissions = [...currentPermissions, condoId];
     }
     setEditingUser({ ...editingUser, permittedCondos: newPermissions });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Configurações</h2>
      
      <Card>
         <div className="flex gap-4 border-b border-slate-100 mb-6">
            <button onClick={() => setActiveTab('condo')} className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'condo' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}>Dados do Condomínio</button>
            <button onClick={() => setActiveTab('users')} className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'users' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}>Usuários e Permissões</button>
            <button onClick={() => setActiveTab('notifications')} className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'notifications' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}>Notificações</button>
         </div>

         {activeTab === 'condo' && (
           <div className="space-y-4 max-w-lg">
              <div>
                 <label className="block text-xs font-medium text-slate-500 mb-1">Nome do Condomínio</label>
                 <input type="text" value={condo.name || ''} onChange={e => handleUpdateCondo('name', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white" />
              </div>
              <div>
                 <label className="block text-xs font-medium text-slate-500 mb-1">CNPJ</label>
                 <input type="text" value={condo.cnpj || ''} onChange={e => handleUpdateCondo('cnpj', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white" />
              </div>
              <div>
                 <label className="block text-xs font-medium text-slate-500 mb-1">Endereço</label>
                 <input type="text" value={condo.address || ''} onChange={e => handleUpdateCondo('address', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white" />
              </div>
           </div>
         )}

         {activeTab === 'users' && (
           <div>
              <div className="flex justify-between items-center mb-4">
                 <h3 className="font-semibold text-slate-700">Usuários do Sistema</h3>
                 <button onClick={() => setEditingUser({ name: '', email: '', role: 'Morador', permittedCondos: [] })} className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm">Novo Usuário</button>
              </div>
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 bg-slate-50 uppercase">
                  <tr>
                    <th className="px-4 py-3">Nome</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Função</th>
                    <th className="px-4 py-3">Acesso (Condomínios)</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u: any) => (
                    <tr key={u.id} className="border-b last:border-0 hover:bg-slate-50">
                       <td className="px-4 py-3 font-medium flex items-center gap-2">
                         <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><User size={16} /></div>
                         {u.name}
                       </td>
                       <td className="px-4 py-3 text-slate-600">{u.email}</td>
                       <td className="px-4 py-3 text-slate-600">{u.role}</td>
                       <td className="px-4 py-3 text-xs text-slate-500">
                          {u.permittedCondos?.map((cid: number) => condos.find((c:any) => c.id === cid)?.name).join(', ') || 'Nenhum'}
                       </td>
                       <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                       <td className="px-4 py-3 text-right flex justify-end gap-2">
                          <button onClick={() => setEditingUser({...u})} className="text-indigo-600 hover:text-indigo-800 text-xs font-medium">Editar</button>
                          <button onClick={() => handleToggleStatus(u.id)} className={`text-xs font-medium ${u.status === 'active' ? 'text-rose-600 hover:text-rose-800' : 'text-emerald-600 hover:text-emerald-800'}`}>
                             {u.status === 'active' ? 'Desativar' : 'Ativar'}
                          </button>
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
         )}
         
         {activeTab === 'notifications' && (
           <div className="space-y-4 max-w-lg">
              <p className="text-sm text-slate-500 mb-4">Configure quais alertas você deseja receber.</p>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                 <span className="text-sm font-medium text-slate-700">Manutenção Preventiva</span>
                 <input type="checkbox" defaultChecked className="toggle" />
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                 <span className="text-sm font-medium text-slate-700">Novas Infrações</span>
                 <input type="checkbox" defaultChecked className="toggle" />
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                 <span className="text-sm font-medium text-slate-700">Financeiro (Contas a Pagar)</span>
                 <input type="checkbox" defaultChecked className="toggle" />
              </div>
           </div>
         )}
      </Card>

      <Modal isOpen={!!editingUser} onClose={() => setEditingUser(null)} title={editingUser?.id ? "Editar Usuário" : "Novo Usuário"}>
         <div className="space-y-4">
            <div>
               <label className="block text-xs font-medium text-slate-500 mb-1">Nome</label>
               <input type="text" value={editingUser?.name || ''} onChange={e => setEditingUser({...editingUser, name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white" />
            </div>
            <div>
               <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
               <input type="email" value={editingUser?.email || ''} onChange={e => setEditingUser({...editingUser, email: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white" />
            </div>
            <div>
               <label className="block text-xs font-medium text-slate-500 mb-1">Função</label>
               <select value={editingUser?.role || 'Morador'} onChange={e => setEditingUser({...editingUser, role: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white">
                  <option value="Síndico">Síndico</option>
                  <option value="Administradora">Administradora</option>
                  <option value="Portaria">Portaria</option>
                  <option value="Morador">Morador</option>
               </select>
            </div>
            <div>
               <label className="block text-xs font-medium text-slate-500 mb-2">Permissões de Acesso (Condomínios)</label>
               <div className="space-y-2 border border-slate-200 rounded-lg p-3 max-h-40 overflow-y-auto">
                  {condos.map((c: any) => (
                    <label key={c.id} className="flex items-center gap-2 cursor-pointer">
                       <input 
                         type="checkbox" 
                         checked={editingUser?.permittedCondos?.includes(c.id) || false} 
                         onChange={() => handleCondoPermissionChange(c.id)}
                         className="rounded text-indigo-600"
                       />
                       <span className="text-sm text-slate-700">{c.name}</span>
                    </label>
                  ))}
               </div>
            </div>
            <div>
               <label className="block text-xs font-medium text-slate-500 mb-1">Senha (Opcional)</label>
               <input type="password" placeholder="Nova senha..." className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white" />
            </div>
            <button onClick={handleSaveUser} className="w-full bg-indigo-600 text-white py-2 rounded-lg mt-4">Salvar</button>
         </div>
      </Modal>
    </div>
  );
};

const RegistrationView = ({ condos, onUpdate }: any) => {
  const [activeTab, setActiveTab] = useState('condos');
  const [editingCondo, setEditingCondo] = useState<any>(null);

  const handleSaveCondo = () => {
    if (editingCondo.id) {
       onUpdate(condos.map((c: any) => c.id === editingCondo.id ? editingCondo : c));
    } else {
       // Sequencial ID logic
       const maxId = condos.length > 0 ? Math.max(...condos.map((c: any) => c.id)) : 0;
       onUpdate([...condos, { ...editingCondo, id: maxId + 1 }]);
    }
    setEditingCondo(null);
  };

  const handleDelete = (id: number) => {
    if (typeof window !== 'undefined' && window.confirm('Excluir este condomínio?')) {
       onUpdate(condos.filter((c: any) => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-slate-800">Cadastros</h2>
        <p className="text-slate-500 text-sm">Gerencie os registros do sistema</p>
      </div>

      <Card>
         <div className="flex gap-4 border-b border-slate-100 mb-6">
            <button className="pb-3 px-2 text-sm font-medium border-b-2 border-indigo-600 text-indigo-600">Condomínios</button>
            {/* Placeholders for future modules */}
         </div>

         <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-700">Lista de Condomínios</h3>
            <button onClick={() => setEditingCondo({ name: '', cnpj: '', address: '', syndic: '' })} className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-2"><Plus size={16}/> Novo Condomínio</button>
         </div>

         <table className="w-full text-sm text-left">
           <thead className="text-xs text-slate-500 bg-slate-50 uppercase">
             <tr>
               <th className="px-4 py-3">ID</th>
               <th className="px-4 py-3">Nome</th>
               <th className="px-4 py-3">CNPJ</th>
               <th className="px-4 py-3">Endereço</th>
               <th className="px-4 py-3">Síndico</th>
               <th className="px-4 py-3 text-right">Ações</th>
             </tr>
           </thead>
           <tbody>
             {condos.map((c: any) => (
               <tr key={c.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">{c.id}</td>
                  <td className="px-4 py-3 font-medium flex items-center gap-2">
                     <div className="p-1 bg-indigo-100 text-indigo-600 rounded"><Database size={14}/></div>
                     {c.name}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{c.cnpj}</td>
                  <td className="px-4 py-3 text-slate-600">{c.address}</td>
                  <td className="px-4 py-3 text-slate-600">{c.syndic}</td>
                  <td className="px-4 py-3 text-right flex justify-end gap-2">
                     <button type="button" onClick={() => setEditingCondo({...c})} className="text-indigo-600 hover:text-indigo-800"><Edit size={16}/></button>
                     <button type="button" onClick={() => handleDelete(c.id)} className="text-slate-400 hover:text-rose-600"><Trash2 size={16}/></button>
                  </td>
               </tr>
             ))}
           </tbody>
         </table>
      </Card>

      <Modal isOpen={!!editingCondo} onClose={() => setEditingCondo(null)} title={editingCondo?.id ? "Editar Condomínio" : "Novo Condomínio"}>
         <div className="space-y-4">
            <div>
               <label className="block text-xs font-medium text-slate-500 mb-1">Nome do Condomínio</label>
               <input type="text" value={editingCondo?.name || ''} onChange={e => setEditingCondo({...editingCondo, name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white" />
            </div>
            <div>
               <label className="block text-xs font-medium text-slate-500 mb-1">CNPJ</label>
               <input type="text" value={editingCondo?.cnpj || ''} onChange={e => setEditingCondo({...editingCondo, cnpj: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white" />
            </div>
            <div>
               <label className="block text-xs font-medium text-slate-500 mb-1">Endereço</label>
               <input type="text" value={editingCondo?.address || ''} onChange={e => setEditingCondo({...editingCondo, address: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white" />
            </div>
            <div>
               <label className="block text-xs font-medium text-slate-500 mb-1">Nome do Síndico</label>
               <input type="text" value={editingCondo?.syndic || ''} onChange={e => setEditingCondo({...editingCondo, syndic: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white" />
            </div>
            <button onClick={handleSaveCondo} className="w-full bg-indigo-600 text-white py-2 rounded-lg mt-4">Salvar</button>
         </div>
      </Modal>
    </div>
  );
};

const ResidentsView = ({ currentCondoId, data, units, onUpdate }: any) => {
  const [editingResident, setEditingResident] = useState<any>(null);
  const displayData = data.filter((r: any) => r.condoId === currentCondoId);
  const condoUnits = units.filter((u: any) => u.condoId === currentCondoId);

  const handleSave = () => {
    if (editingResident.id) {
       onUpdate(data.map((r: any) => r.id === editingResident.id ? editingResident : r));
    } else {
       onUpdate([...data, { ...editingResident, id: Date.now(), condoId: currentCondoId }]);
    }
    setEditingResident(null);
  };

  const handleDelete = (id: number) => {
     if (typeof window !== 'undefined' && window.confirm('Excluir morador?')) {
        onUpdate(data.filter((r: any) => r.id !== id));
     }
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold text-slate-800">Moradores</h2>
         <button onClick={() => setEditingResident({ name: '', email: '', phone: '', unit: '', occupants: 1 })} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 shadow-sm">
           <Plus size={18} /> Novo Morador
         </button>
       </div>

       <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
         <table className="w-full text-sm text-left">
           <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
             <tr>
               <th className="px-6 py-4">Nome</th>
               <th className="px-6 py-4">Contato</th>
               <th className="px-6 py-4">Unidade</th>
               <th className="px-6 py-4">Ocupantes</th>
               <th className="px-6 py-4 text-right">Ações</th>
             </tr>
           </thead>
           <tbody>
             {displayData.map((r: any) => (
               <tr key={r.id} className="border-b last:border-0 hover:bg-slate-50">
                 <td className="px-6 py-4 font-medium text-slate-800">{r.name}</td>
                 <td className="px-6 py-4 text-slate-600">
                    <p>{r.email}</p>
                    <p className="text-xs">{r.phone}</p>
                 </td>
                 <td className="px-6 py-4 text-slate-600">{r.unit}</td>
                 <td className="px-6 py-4 text-slate-600">{r.occupants}</td>
                 <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button onClick={() => setEditingResident({...r})} className="text-indigo-600 hover:text-indigo-800 font-medium text-xs">Editar</button>
                    <button onClick={() => handleDelete(r.id)} className="text-slate-400 hover:text-rose-600 font-medium text-xs">Excluir</button>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>

       <Modal isOpen={!!editingResident} onClose={() => setEditingResident(null)} title={editingResident?.id ? "Editar Morador" : "Novo Morador"}>
          <div className="space-y-4">
             <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Nome Completo</label>
                <input type="text" value={editingResident?.name || ''} onChange={e => setEditingResident({...editingResident, name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white" />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                  <input type="email" value={editingResident?.email || ''} onChange={e => setEditingResident({...editingResident, email: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Telefone</label>
                  <input type="text" value={editingResident?.phone || ''} onChange={e => setEditingResident({...editingResident, phone: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white" />
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-medium text-slate-500 mb-1">Unidade</label>
                   <select value={editingResident?.unit || ''} onChange={e => setEditingResident({...editingResident, unit: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white">
                      <option value="">Selecione...</option>
                      {condoUnits.map((u: any) => <option key={u.id} value={`${u.number} - ${u.block}`}>{u.number} - {u.block}</option>)}
                   </select>
                </div>
                <div>
                   <label className="block text-xs font-medium text-slate-500 mb-1">Nº Ocupantes</label>
                   <input type="number" value={editingResident?.occupants || 1} onChange={e => setEditingResident({...editingResident, occupants: Number(e.target.value)})} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white" />
                </div>
             </div>
             <button onClick={handleSave} className="w-full bg-indigo-600 text-white py-2 rounded-lg mt-4">Salvar</button>
          </div>
       </Modal>
    </div>
  );
};

// --- APP ---

const App = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [currentCondoId, setCurrentCondoId] = useState(1);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Persistence State
  const [condoData, setCondoData] = useState(() => JSON.parse(localStorage.getItem('condos') || JSON.stringify(MOCK_CONDOS)));
  const [unitData, setUnitData] = useState(() => JSON.parse(localStorage.getItem('units') || JSON.stringify(MOCK_UNITS)));
  const [financeData, setFinanceData] = useState(() => JSON.parse(localStorage.getItem('finance') || JSON.stringify(MOCK_FINANCE)));
  const [maintenanceData, setMaintenanceData] = useState(() => JSON.parse(localStorage.getItem('maintenance') || JSON.stringify(MOCK_MAINTENANCE)));
  const [suppliersData, setSuppliersData] = useState(() => JSON.parse(localStorage.getItem('suppliers') || JSON.stringify(MOCK_SUPPLIERS)));
  const [infractionsData, setInfractionsData] = useState(() => JSON.parse(localStorage.getItem('infractions') || JSON.stringify(MOCK_INFRACTIONS)));
  const [documentsData, setDocumentsData] = useState(() => JSON.parse(localStorage.getItem('documents') || JSON.stringify(MOCK_DOCUMENTS)));
  const [userData, setUserData] = useState(() => JSON.parse(localStorage.getItem('users') || JSON.stringify(MOCK_USERS)));
  const [regulationsData, setRegulationsData] = useState(() => JSON.parse(localStorage.getItem('regulations') || JSON.stringify(MOCK_REGULATIONS)));
  const [residentsData, setResidentsData] = useState(() => JSON.parse(localStorage.getItem('residents') || JSON.stringify(MOCK_RESIDENTS)));

  // Save to LocalStorage
  useEffect(() => { localStorage.setItem('condos', JSON.stringify(condoData)); }, [condoData]);
  useEffect(() => { localStorage.setItem('units', JSON.stringify(unitData)); }, [unitData]);
  useEffect(() => { localStorage.setItem('finance', JSON.stringify(financeData)); }, [financeData]);
  useEffect(() => { localStorage.setItem('maintenance', JSON.stringify(maintenanceData)); }, [maintenanceData]);
  useEffect(() => { localStorage.setItem('suppliers', JSON.stringify(suppliersData)); }, [suppliersData]);
  useEffect(() => { localStorage.setItem('infractions', JSON.stringify(infractionsData)); }, [infractionsData]);
  useEffect(() => { localStorage.setItem('documents', JSON.stringify(documentsData)); }, [documentsData]);
  useEffect(() => { localStorage.setItem('users', JSON.stringify(userData)); }, [userData]);
  useEffect(() => { localStorage.setItem('regulations', JSON.stringify(regulationsData)); }, [regulationsData]);
  useEffect(() => { localStorage.setItem('residents', JSON.stringify(residentsData)); }, [residentsData]);

  const resetDatabase = () => {
    if (confirm('Atenção! Isso apagará todos os dados salvos e restaurará os dados de exemplo. Continuar?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const currentCondo = condoData.find((c: any) => c.id === currentCondoId) || condoData[0];
  
  // Notifications logic
  const notifications = [
     ...MOCK_NOTIFICATIONS,
     // Add auto-generated document alerts
     ...documentsData.filter((d: any) => {
        if (!d.validUntil || d.permanent) return false;
        const validDate = new Date(d.validUntil);
        const today = new Date();
        return validDate < today;
     }).map((d: any) => ({ 
        id: `doc-${d.id}`, 
        title: 'Documento Vencido', 
        message: `${d.title} venceu em ${new Date(d.validUntil).toLocaleDateString()}`, 
        read: false, 
        date: new Date().toISOString() 
     }))
  ];
  const unreadCount = notifications.filter(n => !n.read).length;

  const MenuItem = ({ id, icon: Icon, label }: any) => (
    <button 
      onClick={() => { setActiveView(id); setIsMobileMenuOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
    >
      <Icon size={20} />
      <span className="font-medium text-sm">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-[Inter]">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <LayoutDashboard size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">GestorCondo</h1>
              <p className="text-xs text-slate-400">PRO 360</p>
            </div>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-slate-400"><X size={24} /></button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-2">Principal</p>
          <MenuItem id="dashboard" icon={LayoutDashboard} label="Visão Geral" />
          <MenuItem id="units" icon={Home} label="Unidades" />
          <MenuItem id="residents" icon={Users} label="Moradores" />
          <MenuItem id="maintenance" icon={Wrench} label="Manutenção" />
          
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6">Administrativo</p>
          <MenuItem id="finance" icon={DollarSign} label="Financeiro" />
          <MenuItem id="suppliers" icon={Truck} label="Fornecedores" />
          <MenuItem id="infractions" icon={AlertTriangle} label="Infrações" />
          <MenuItem id="documents" icon={FileText} label="Documentos" />

          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6">Sistema</p>
          <MenuItem id="registration" icon={Edit} label="Cadastros" />
          <MenuItem id="settings" icon={Settings} label="Configurações" />
        </nav>

        <div className="p-4 border-t border-slate-800">
           <button onClick={resetDatabase} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-400 hover:text-rose-300 transition-colors">
              <Database size={14} /> Resetar Banco de Dados
           </button>
           <div className="mt-4 flex items-center gap-3 px-4">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">CS</div>
              <div>
                 <p className="text-sm font-medium">Carlos Síndico</p>
                 <p className="text-xs text-slate-400">Gestor Principal</p>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-4">
             <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden text-slate-500"><Menu size={24} /></button>
             <div className="flex flex-col">
                <select 
                  value={currentCondoId} 
                  onChange={(e) => setCurrentCondoId(Number(e.target.value))}
                  className="font-bold text-slate-800 bg-transparent border-none focus:ring-0 p-0 cursor-pointer text-sm"
                >
                  {condoData.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
             </div>
          </div>
          <div className="flex items-center gap-4">
             {/* Notifications */}
             <div className="relative">
                <button onClick={() => setShowNotifications(!showNotifications)} className="relative text-slate-500 hover:text-indigo-600 transition-colors">
                   <Bell size={20} />
                   {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full"></span>}
                </button>
                
                {showNotifications && (
                   <div className="absolute right-0 top-10 w-80 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                      <div className="p-3 border-b border-slate-50 bg-slate-50 flex justify-between items-center">
                         <h3 className="font-semibold text-sm text-slate-700">Notificações</h3>
                         <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{unreadCount} novas</span>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                         {notifications.length > 0 ? notifications.map((n: any) => (
                            <div key={n.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!n.read ? 'bg-indigo-50/50' : ''}`}>
                               <div className="flex justify-between items-start mb-1">
                                  <p className={`text-sm ${!n.read ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>{n.title}</p>
                                  <span className="text-[10px] text-slate-400">{new Date(n.date).toLocaleDateString()}</span>
                               </div>
                               <p className="text-xs text-slate-500">{n.message}</p>
                            </div>
                         )) : (
                            <div className="p-8 text-center text-slate-500 text-sm">Nenhuma notificação.</div>
                         )}
                      </div>
                   </div>
                )}
             </div>

             <button className="text-slate-400 hover:text-indigo-600"><LogOut size={20} /></button>
          </div>
        </header>

        {/* Dynamic View Content */}
        <div className="p-6 overflow-y-auto">
           {activeView === 'dashboard' && <DashboardView currentCondoId={currentCondoId} financeData={financeData} unitsData={unitData} maintenanceData={maintenanceData} documentsData={documentsData} />}
           {activeView === 'units' && <UnitsView currentCondoId={currentCondoId} data={unitData} residentsData={residentsData} onUpdate={setUnitData} />}
           {activeView === 'residents' && <ResidentsView currentCondoId={currentCondoId} data={residentsData} units={unitData} onUpdate={setResidentsData} />}
           {activeView === 'maintenance' && <MaintenanceView currentCondoId={currentCondoId} data={maintenanceData} suppliers={suppliersData} onUpdate={setMaintenanceData} />}
           {activeView === 'finance' && <FinanceView currentCondoId={currentCondoId} data={financeData} suppliers={suppliersData} onUpdate={setFinanceData} />}
           {activeView === 'suppliers' && <SuppliersView currentCondoId={currentCondoId} data={suppliersData} onUpdate={setSuppliersData} />}
           {activeView === 'infractions' && <InfractionsView currentCondoId={currentCondoId} data={infractionsData} regulations={regulationsData} onUpdate={setInfractionsData} onUpdateRules={setRegulationsData} />}
           {activeView === 'documents' && <DocumentsView currentCondoId={currentCondoId} data={documentsData} onUpdate={setDocumentsData} />}
           {activeView === 'registration' && <RegistrationView condos={condoData} onUpdate={setCondoData} />}
           {activeView === 'settings' && <SettingsView currentCondoId={currentCondoId} data={condoData} users={userData} condos={condoData} onUpdate={setCondoData} onUpdateUsers={setUserData} />}
        </div>
      </main>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
