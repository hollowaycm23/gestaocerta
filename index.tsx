
import React, { useState, useEffect, useMemo } from 'react';
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
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  Filter, 
  Download, 
  UploadCloud, 
  Eye, 
  Trash2, 
  Plus, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  MoreVertical,
  Building,
  Edit,
  LogOut,
  Database
} from 'lucide-react';

// --- TYPES ---
type ViewState = 'dashboard' | 'units' | 'maintenance' | 'finance' | 'suppliers' | 'infractions' | 'documents' | 'settings' | 'residents' | 'registration';

// --- MOCK DATA ---
const MOCK_CONDOS = [
  { id: 1, name: 'Residencial Horizonte', cnpj: '12.345.678/0001-90', address: 'Rua das Flores, 123', syndic: 'Carlos Silva' },
  { id: 2, name: 'Edifício Solar', cnpj: '98.765.432/0001-12', address: 'Av. do Sol, 456', syndic: 'Ana Souza' }
];

const MOCK_UNITS = [
  { id: 1, condoId: 1, number: '101', block: 'A', responsible: 'João Silva', type: 'owner', status: 'paid', area: 80 },
  { id: 2, condoId: 1, number: '102', block: 'A', responsible: 'Maria Souza', type: 'tenant', status: 'debt', area: 80 },
  { id: 3, condoId: 1, number: '103', block: 'B', responsible: '-', type: 'vacant', status: 'debt', area: 90 },
  { id: 4, condoId: 1, number: '104', block: 'B', responsible: 'Pedro Santos', type: 'owner', status: 'paid', area: 90 },
  { id: 5, condoId: 1, number: '105', block: 'C', responsible: 'Ana Pereira', type: 'owner', status: 'paid', area: 100 },
  { id: 6, condoId: 1, number: '106', block: 'C', responsible: 'Carlos Lima', type: 'tenant', status: 'debt', area: 100 },
  { id: 7, condoId: 2, number: '100', block: 'A', responsible: 'teste', type: 'owner', status: 'paid', area: 100 },
];

const MOCK_RESIDENTS = [
  { id: 1, condoId: 1, name: 'João Silva', unit: '101 - A', phone: '(11) 9999-0001', email: 'joao@email.com', occupants: 3 },
  { id: 2, condoId: 1, name: 'Maria Souza', unit: '102 - A', phone: '(11) 9999-0002', email: 'maria@email.com', occupants: 2 },
  { id: 3, condoId: 1, name: 'Pedro Santos', unit: '104 - B', phone: '(11) 9999-0003', email: 'pedro@email.com', occupants: 4 },
  { id: 4, condoId: 1, name: 'Ana Pereira', unit: '105 - C', phone: '(11) 9999-0004', email: 'ana@email.com', occupants: 1 },
  { id: 5, condoId: 1, name: 'Carlos Lima', unit: '106 - C', phone: '(11) 9999-0005', email: 'carlos@email.com', occupants: 2 },
  { id: 6, condoId: 2, name: 'teste', unit: '100 - A', phone: '123576486387', email: 'teste@teste.com', occupants: 1 },
];

const MOCK_MAINTENANCE = [
  { id: 1, condoId: 1, item: 'Elevador Bloco A', date: '2023-11-24', type: 'Preventiva', status: 'scheduled', supplier: 'TechElevators' },
  { id: 2, condoId: 1, item: 'Lâmpadas Hall', date: '2023-11-18', type: 'Corretiva', status: 'completed', supplier: 'Zelador' },
  { id: 3, condoId: 1, item: 'Bomba Piscina', date: '2023-11-27', type: 'Preventiva', status: 'scheduled', supplier: 'PoolService' },
  { id: 4, condoId: 1, item: 'Portão Garagem', date: '2023-11-14', type: 'Corretiva', status: 'cancelled', supplier: 'Serralheria' },
  { id: 5, condoId: 1, item: 'Jardinagem', date: '2023-11-21', type: 'Rotina', status: 'pending', supplier: 'Jardinagem Verde' },
];

const MOCK_FINANCE = [
  { id: 1, condoId: 1, description: 'Aluguel 101', category: 'Aluguel', date: '2023-11-04', type: 'income', value: 2500.00, status: 'paid', dueDate: '2023-11-04' },
  { id: 2, condoId: 1, description: 'Material Limpeza', category: 'Serviços', date: '2023-11-09', type: 'expense', value: 350.00, status: 'pending', dueDate: '2023-11-14' },
  { id: 3, condoId: 1, description: 'Manutenção Elevador', category: 'Manutenção', date: '2023-11-11', type: 'expense', value: 1200.00, status: 'pending', dueDate: '2023-11-19' },
  { id: 4, condoId: 1, description: 'Aluguel 104', category: 'Aluguel', date: '2023-11-04', type: 'income', value: 2500.00, status: 'paid', dueDate: '2023-11-04' },
  { id: 5, condoId: 1, description: 'Aluguel 105', category: 'Aluguel', date: '2023-12-03', type: 'income', value: 2500.00, status: 'paid', dueDate: '2023-12-04' },
  { id: 6, condoId: 1, description: 'Conta de Luz', category: 'Utilidades', date: '2023-11-13', type: 'expense', value: 500.00, status: 'pending', dueDate: '2023-11-24' },
];

const MOCK_SUPPLIERS = [
  { id: 1, condoId: 1, name: 'TechElevators', category: 'Manutenção', contact: '(11) 9999-8888', status: 'active', contractStart: '2023-01-01', contractEnd: '2024-01-01' },
  { id: 2, condoId: 1, name: 'Imobiliária Centro', category: 'Administrativo', contact: '(11) 7777-6666', status: 'active', contractStart: '2023-05-01', contractEnd: '2025-05-01' },
  { id: 3, condoId: 1, name: 'Distribuidora XYZ', category: 'Insumos', contact: '(11) 5555-4444', status: 'inactive', contractStart: '2022-01-01', contractEnd: '2022-12-31' },
  { id: 4, condoId: 1, name: 'PoolService', category: 'Manutenção', contact: '(11) 3333-2222', status: 'active', contractStart: '2023-01-01', contractEnd: '2024-01-01' },
  { id: 5, condoId: 1, name: 'Segurança Total', category: 'Segurança', contact: '(11) 2222-1111', status: 'active', contractStart: '2023-06-01', contractEnd: '2024-06-01' },
  { id: 6, condoId: 1, name: 'Jardinagem Verde', category: 'Manutenção', contact: '(11) 1111-2222', status: 'active', contractStart: '2023-03-01', contractEnd: '2024-03-01' },
];

const MOCK_INFRACTIONS = [
  { id: 1, condoId: 1, unit: 'Unit 102', type: 'Barulho Excessivo', date: '2023-11-19', fine: 250.00, status: 'pending', recurrence: 1 },
  { id: 2, condoId: 1, unit: 'Unit 106', type: 'Estacionamento Irregular', date: '2023-11-17', fine: 150.00, status: 'multado', recurrence: 2 },
  { id: 3, condoId: 1, unit: 'Unit 101', type: 'Mudança fora de horário', date: '2023-11-09', fine: 500.00, status: 'appealing', recurrence: 1 },
];

const MOCK_DOCUMENTS = [
  { id: 1, condoId: 1, title: 'AVCB - Auto de Vistoria', category: 'Legal', date: '2023-05-09', validUntil: '2023-10-30', permanent: false },
  { id: 2, condoId: 1, title: 'Apólice de Seguro Predial', category: 'Seguros', date: '2023-01-14', validUntil: '2024-01-13', permanent: false },
  { id: 3, condoId: 1, title: 'Laudo SPDA (Para-raios)', category: 'Manutenção', date: '2022-10-19', validUntil: '2023-10-18', permanent: false },
  { id: 4, condoId: 1, title: 'Planta Hidráulica', category: 'Plantas', date: '2009-12-31', validUntil: null, permanent: true },
];

const MOCK_USERS = [
  { id: 1, name: 'Carlos Síndico', email: 'carlos@horizonte.com', role: 'Síndico', status: 'active', permittedCondos: [1] },
  { id: 2, name: 'Ana Admin', email: 'ana@admin.com', role: 'Administradora', status: 'active', permittedCondos: [1, 2] },
  { id: 3, name: 'João Porteiro', email: 'joao@portaria.com', role: 'Portaria', status: 'inactive', permittedCondos: [1] },
];

// Default Notification Settings
const DEFAULT_SETTINGS = {
    alertDays: 5,
    channels: { email: true, push: true },
    events: {
        infractions: true,
        maintenance: true,
        bills: true,
        documents: true,
        residents: true
    }
};

// --- COMPONENTS ---

const inputClass = "w-full px-3 py-2 bg-white text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all";

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children?: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50/50 sticky top-0 bg-white z-10">
          <h3 className="font-bold text-lg text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, children, action, className = "" }: { title?: string; children?: React.ReactNode; action?: React.ReactNode; className?: string }) => (
  <div className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow ${className}`}>
    {(title || action) && (
      <div className="flex justify-between items-center mb-4">
        {title && <h3 className="text-lg font-bold text-slate-700">{title}</h3>}
        {action}
      </div>
    )}
    {children}
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    paid: 'bg-emerald-100 text-emerald-700',
    adimplente: 'bg-emerald-100 text-emerald-700',
    active: 'bg-emerald-100 text-emerald-700',
    completed: 'bg-emerald-100 text-emerald-700',
    concluido: 'bg-emerald-100 text-emerald-700',
    vigente: 'bg-emerald-100 text-emerald-700',
    permanent: 'bg-indigo-100 text-indigo-700',
    
    pending: 'bg-amber-100 text-amber-700',
    aguardando_defesa: 'bg-amber-100 text-amber-700',
    pendente: 'bg-amber-100 text-amber-700',
    scheduled: 'bg-blue-100 text-blue-700',
    agendado: 'bg-blue-100 text-blue-700',
    expiring_soon: 'bg-amber-100 text-amber-700',
    
    debt: 'bg-rose-100 text-rose-700',
    inadimplente: 'bg-rose-100 text-rose-700',
    vencido: 'bg-rose-100 text-rose-700',
    multado: 'bg-rose-100 text-rose-700',
    inactive: 'bg-slate-100 text-slate-700',
    cancelled: 'bg-slate-100 text-slate-700',
    appealing: 'bg-purple-100 text-purple-700',
    vacant: 'bg-slate-100 text-slate-600',
    
    in_progress: 'bg-indigo-100 text-indigo-700',
  };

  const labels: any = {
    paid: 'Pago',
    adimplente: 'Adimplente',
    active: 'Ativo',
    completed: 'Concluído',
    concluido: 'Concluído',
    vigente: 'Vigente',
    permanent: 'Permanente',
    
    pending: 'Pendente',
    aguardando_defesa: 'Aguardando Defesa',
    pendente: 'Pendente',
    scheduled: 'Agendado',
    agendado: 'Agendado',
    expiring_soon: 'A Vencer',
    
    debt: 'Inadimplente',
    inadimplente: 'Inadimplente',
    vencido: 'Vencido',
    multado: 'Multado',
    inactive: 'Inativo',
    cancelled: 'Cancelada',
    appealing: 'Em Recurso',
    vacant: 'Vaga',
    
    in_progress: 'Em Execução'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status.toLowerCase()] || 'bg-slate-100 text-slate-600'}`}>
      {labels[status.toLowerCase()] || status}
    </span>
  );
};

const ActionMenu = ({ onAction, options }: { onAction: (action: string) => void, options: {label: string, value: string, color?: string}[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="p-1 hover:bg-slate-100 rounded text-slate-400">
        <Settings size={16} />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl border border-slate-100 z-20 overflow-hidden">
            {options.map(opt => (
              <button
                key={opt.value}
                onClick={() => { onAction(opt.value); setIsOpen(false); }}
                className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-50 ${opt.color || 'text-slate-600'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// --- VIEWS ---

const DashboardView = ({ data, units, maintenance, navigateTo, documents }: any) => {
  const stats = useMemo(() => {
    // Finance
    const balance = data.reduce((acc: number, curr: any) => {
      if (curr.status === 'paid') {
        return curr.type === 'income' ? acc + curr.value : acc - curr.value;
      }
      return acc;
    }, 0);

    const pendingIncome = data.filter((i:any) => i.type === 'income' && i.status === 'pending').reduce((acc:number, c:any) => acc + c.value, 0);
    const pendingExpense = data.filter((i:any) => i.type === 'expense' && i.status === 'pending').reduce((acc:number, c:any) => acc + c.value, 0);
    const projectedBalance = balance + pendingIncome - pendingExpense;

    // Occupancy
    const totalUnits = units.length;
    const occupiedUnits = units.filter((u: any) => u.type !== 'vacant').length;
    const occupancyRate = totalUnits ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

    // Debt
    const debtUnits = units.filter((u: any) => u.status === 'debt').length;
    const debtRate = totalUnits ? Math.round((debtUnits / totalUnits) * 100) : 0;

    // Maintenance
    const pendingMaintenance = maintenance.filter((m: any) => m.status === 'pending' || m.status === 'scheduled').length;

    // Documents
    const expiringDocs = documents ? documents.filter((d: any) => {
        if (d.permanent) return false;
        const validUntil = new Date(d.validUntil);
        const today = new Date();
        const diffTime = validUntil.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays < 30; // Expired or expiring in 30 days
    }).length : 0;

    return { balance, projectedBalance, occupancyRate, occupiedUnits, debtRate, debtUnits, pendingMaintenance, expiringDocs };
  }, [data, units, maintenance, documents]);

  const DashboardCard = ({ title, value, subtext, icon: Icon, colorClass, onClick }: any) => (
    <div onClick={onClick} className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:shadow-md transition-all ${colorClass} border-b-4`}>
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
            </div>
            <div className={`p-3 rounded-lg bg-opacity-10 ${colorClass.replace('border-', 'bg-').replace('500', '100')} ${colorClass.replace('border-', 'text-').replace('500', '600')}`}>
                <Icon size={24} />
            </div>
        </div>
        <p className="text-xs text-slate-500">{subtext}</p>
    </div>
  );

  const [viewMaintenance, setViewMaintenance] = useState<any>(null);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Visão Geral</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
            title="Saldo em Caixa" 
            value={`R$ ${stats.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
            subtext="Atualizado hoje"
            icon={DollarSign}
            colorClass="border-emerald-500"
            onClick={() => navigateTo('finance')}
        />
        <DashboardCard 
            title="Saldo Projetado" 
            value={`R$ ${stats.projectedBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
            subtext={`A Pagar: ${stats.balance - stats.projectedBalance}`}
            icon={Clock}
            colorClass="border-indigo-500"
            onClick={() => navigateTo('finance')}
        />
        <DashboardCard 
            title="Inadimplência" 
            value={`${stats.debtUnits} Unidades`} 
            subtext={`${stats.debtRate}% do total`}
            icon={AlertTriangle}
            colorClass="border-rose-500"
            onClick={() => navigateTo('units')}
        />
        <DashboardCard 
            title="Manutenção" 
            value={stats.pendingMaintenance} 
            subtext="Ordens pendentes"
            icon={Wrench}
            colorClass="border-amber-500"
            onClick={() => navigateTo('maintenance')}
        />
        <DashboardCard 
            title="Ocupação" 
            value={`${stats.occupiedUnits} Unidades`} 
            subtext={`${stats.occupancyRate}% ocupação`}
            icon={Users}
            colorClass="border-sky-500"
            onClick={() => navigateTo('units')}
        />
        <DashboardCard 
            title="Documentos" 
            value={stats.expiringDocs} 
            subtext="Vencidos ou a Vencer"
            icon={FileText}
            colorClass="border-purple-500"
            onClick={() => navigateTo('documents')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Próximas Manutenções" className="h-full">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                  <tr><th className="p-3">Item</th><th className="p-3">Data</th><th className="p-3">Status</th><th className="p-3 text-right"></th></tr>
                </thead>
                <tbody>
                  {maintenance.slice(0, 5).map((item: any) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-3">{item.item}</td>
                      <td className="p-3">{new Date(item.date).toLocaleDateString('pt-BR')}</td>
                      <td className="p-3"><StatusBadge status={item.status} /></td>
                      <td className="p-3 text-right"><button onClick={() => setViewMaintenance(item)} className="text-indigo-600 text-xs hover:underline">Detalhes</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
        <Card title="Fluxo Recente" className="h-full">
          <div className="space-y-4">
            {data.slice(0, 5).map((item: any) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${item.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                    <DollarSign size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{item.description}</p>
                    <p className="text-xs text-slate-500">{item.category}</p>
                  </div>
                </div>
                <span className={`font-bold ${item.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {item.type === 'income' ? '+' : '-'} R$ {item.value.toFixed(2)}
                </span>
              </div>
            ))}
            <button onClick={() => navigateTo('finance')} className="w-full text-center text-indigo-600 text-sm font-medium hover:underline mt-2">Ver Extrato Completo</button>
          </div>
        </Card>
      </div>

      <Modal isOpen={!!viewMaintenance} onClose={() => setViewMaintenance(null)} title="Detalhes da Manutenção">
          <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-xs text-slate-500 uppercase">Item</p><p className="font-bold">{viewMaintenance?.item}</p></div>
                  <div><p className="text-xs text-slate-500 uppercase">Data</p><p className="font-bold">{viewMaintenance?.date}</p></div>
                  <div><p className="text-xs text-slate-500 uppercase">Fornecedor</p><p className="font-bold">{viewMaintenance?.supplier}</p></div>
                  <div><p className="text-xs text-slate-500 uppercase">Status</p><StatusBadge status={viewMaintenance?.status || ''} /></div>
                  {viewMaintenance?.type === 'Preventiva' && (
                      <div><p className="text-xs text-slate-500 uppercase">Validade Legal</p><p className="font-bold text-amber-600">{viewMaintenance?.validUntil || 'N/A'}</p></div>
                  )}
              </div>
          </div>
      </Modal>
    </div>
  );
};

const FinanceView = ({ data, onSave, suppliers }: any) => {
  const [showModal, setShowModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportFormat, setReportFormat] = useState('pdf');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [newEntry, setNewEntry] = useState({ description: '', category: '', value: '', type: 'expense', date: new Date().toISOString().split('T')[0], dueDate: '', supplier: '' });

  const filteredData = useMemo(() => {
    return data.filter((item: any) => {
      if (startDate && new Date(item.date) < new Date(startDate)) return false;
      if (endDate && new Date(item.date) > new Date(endDate)) return false;
      return true;
    });
  }, [data, startDate, endDate]);

  const handleSaveEntry = () => {
    onSave({ ...newEntry, value: Number(newEntry.value), status: 'pending' });
    setShowModal(false);
    setNewEntry({ description: '', category: '', value: '', type: 'expense', date: new Date().toISOString().split('T')[0], dueDate: '', supplier: '' });
  };

  const handleStatusChange = (id: number, newStatus: string) => {
      const entry = data.find((i:any) => i.id === id);
      if(entry) {
          onSave({...entry, status: newStatus}, true); // true for update
      }
  }

  const generateReport = () => {
      alert(`Gerando relatório em ${reportFormat.toUpperCase()}...`);
      setShowReportModal(false);
  }

  // Calculate totals
  const balance = data.reduce((acc: number, curr: any) => curr.status === 'paid' ? (curr.type === 'income' ? acc + curr.value : acc - curr.value) : acc, 0);
  const pendingIncome = data.filter((i:any) => i.type === 'income' && i.status === 'pending').reduce((acc:number, c:any) => acc + c.value, 0);
  const pendingExpense = data.filter((i:any) => i.type === 'expense' && i.status === 'pending').reduce((acc:number, c:any) => acc + c.value, 0);
  const projectedBalance = balance + pendingIncome - pendingExpense;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Financeiro</h2>
        <div className="flex gap-2">
            <button onClick={() => setShowReportModal(true)} className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2"><FileText size={18} /> Relatórios</button>
            <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex gap-2 items-center hover:bg-indigo-700"><Plus size={18} /> Novo Lançamento</button>
        </div>
      </div>

      {/* Banking Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border-b-4 border-emerald-500 shadow-sm">
              <p className="text-xs font-bold text-slate-500 uppercase">Saldo em Caixa</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">R$ {balance.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h3>
          </div>
          <div className="bg-white p-6 rounded-xl border-b-4 border-emerald-200 shadow-sm">
              <p className="text-xs font-bold text-slate-500 uppercase">A Receber (Previsão)</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">R$ {pendingIncome.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h3>
          </div>
          <div className="bg-white p-6 rounded-xl border-b-4 border-rose-200 shadow-sm">
              <p className="text-xs font-bold text-slate-500 uppercase">A Pagar (Previsão)</p>
              <h3 className="text-2xl font-bold text-rose-600 mt-1">R$ {pendingExpense.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h3>
          </div>
          <div className="bg-indigo-50 p-6 rounded-xl border-b-4 border-indigo-500 shadow-sm md:col-span-3">
              <p className="text-xs font-bold text-indigo-800 uppercase">Saldo Previsto Final</p>
              <h3 className="text-3xl font-bold text-indigo-900 mt-1">R$ {projectedBalance.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h3>
              <p className="text-xs text-indigo-600 mt-1">Saldo Caixa + Receber - Pagar</p>
          </div>
      </div>

      <Card>
        <div className="flex gap-4 mb-6 bg-slate-50 p-4 rounded-lg items-end">
            <div className="flex-1">
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Período Início</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={inputClass} />
            </div>
            <div className="flex-1">
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Período Fim</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className={inputClass} />
            </div>
            <button onClick={() => {setStartDate(''); setEndDate('')}} className="text-slate-500 hover:text-slate-800 text-sm mb-2">Limpar Filtros</button>
        </div>

        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
            <tr>
                <th className="p-3">Descrição</th>
                <th className="p-3">Categoria</th>
                <th className="p-3">Data</th>
                <th className="p-3">Vencimento</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Valor</th>
                <th className="p-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item: any) => (
              <tr key={item.id} className="border-b hover:bg-slate-50">
                <td className="p-3">
                    <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-full ${item.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                            <DollarSign size={14} />
                        </div>
                        <div>
                            <p className="font-medium">{item.description}</p>
                            {item.supplier && <p className="text-xs text-slate-500 flex items-center gap-1"><Truck size={10}/> {item.supplier}</p>}
                        </div>
                    </div>
                </td>
                <td className="p-3 text-slate-600">{item.category}</td>
                <td className="p-3 text-slate-600">{new Date(item.date).toLocaleDateString('pt-BR')}</td>
                <td className="p-3 text-slate-600">{item.dueDate ? new Date(item.dueDate).toLocaleDateString('pt-BR') : '-'}</td>
                <td className="p-3"><StatusBadge status={item.status} /></td>
                <td className={`p-3 text-right font-bold ${item.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {item.type === 'income' ? '+' : '-'} R$ {item.value.toFixed(2)}
                </td>
                <td className="p-3 text-center">
                    <ActionMenu 
                        onAction={(act) => handleStatusChange(item.id, act)}
                        options={[
                            { label: 'Marcar como Pago', value: 'paid', color: 'text-emerald-600' },
                            { label: 'Marcar como Pendente', value: 'pending', color: 'text-amber-600' },
                            { label: 'Marcar como Vencido', value: 'vencido', color: 'text-rose-600' }
                        ]}
                    />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Novo Lançamento">
        <div className="space-y-4">
          <div className="flex gap-4 p-1 bg-slate-100 rounded-lg">
            <button className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${newEntry.type === 'income' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`} onClick={() => setNewEntry({...newEntry, type: 'income'})}>Receita</button>
            <button className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${newEntry.type === 'expense' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`} onClick={() => setNewEntry({...newEntry, type: 'expense'})}>Despesa</button>
          </div>
          <input className={inputClass} placeholder="Descrição" value={newEntry.description} onChange={e => setNewEntry({...newEntry, description: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <select className={inputClass} value={newEntry.category} onChange={e => setNewEntry({...newEntry, category: e.target.value})}>
                <option value="">Categoria</option>
                <option value="Aluguel">Aluguel</option>
                <option value="Manutenção">Manutenção</option>
                <option value="Serviços">Serviços</option>
                <option value="Utilidades">Utilidades</option>
                <option value="Taxas">Taxas</option>
            </select>
            <input type="date" className={inputClass} value={newEntry.dueDate} onChange={e => setNewEntry({...newEntry, dueDate: e.target.value})} title="Data Vencimento" />
          </div>
          {newEntry.type === 'expense' && (
              <select className={inputClass} value={newEntry.supplier} onChange={e => setNewEntry({...newEntry, supplier: e.target.value})}>
                  <option value="">Selecionar Fornecedor</option>
                  {suppliers && suppliers.map((s:any) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
              </select>
          )}
          <input type="number" className={inputClass} placeholder="Valor (R$)" value={newEntry.value} onChange={e => setNewEntry({...newEntry, value: e.target.value})} />
          <button onClick={handleSaveEntry} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-medium">Salvar</button>
        </div>
      </Modal>

      <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)} title="Exportar Relatórios">
          <div className="space-y-6">
              <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">Período</label>
                  <div className="flex gap-2">
                      <input type="date" className={inputClass} />
                      <input type="date" className={inputClass} />
                  </div>
              </div>
              <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">Tipo de Relatório</label>
                  <select className={inputClass}>
                      <option>Fluxo de Caixa Detalhado</option>
                      <option>Inadimplência por Unidade</option>
                      <option>Despesas por Categoria</option>
                  </select>
              </div>
              <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">Formato</label>
                  <div className="grid grid-cols-3 gap-3">
                      <button onClick={() => setReportFormat('pdf')} className={`flex flex-col items-center p-3 rounded-xl border ${reportFormat === 'pdf' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:bg-slate-50'}`}>
                          <FileText size={24} className="mb-2"/> <span className="text-xs font-bold">PDF</span>
                      </button>
                      <button onClick={() => setReportFormat('excel')} className={`flex flex-col items-center p-3 rounded-xl border ${reportFormat === 'excel' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:bg-slate-50'}`}>
                          <FileText size={24} className="mb-2"/> <span className="text-xs font-bold">Excel</span>
                      </button>
                      <button onClick={() => setReportFormat('csv')} className={`flex flex-col items-center p-3 rounded-xl border ${reportFormat === 'csv' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:bg-slate-50'}`}>
                          <Download size={24} className="mb-2"/> <span className="text-xs font-bold">CSV</span>
                      </button>
                  </div>
              </div>
              <button onClick={generateReport} className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-200">Gerar Relatório</button>
          </div>
      </Modal>
    </div>
  );
};

const UnitsView = ({ data, onSave, residents }: any) => {
  const [editing, setEditing] = useState<any>(null);

  const handleEdit = (unit: any) => {
      // Clone object to avoid reference issues
      setEditing(JSON.parse(JSON.stringify(unit)));
  }

  const handleSave = () => {
      onSave(editing);
      setEditing(null);
  }

  const residentsOptions = residents ? residents.map((r: any) => r.name) : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-slate-800">Unidades</h2><button onClick={() => setEditing({ number: '', block: '', responsible: '', type: 'owner', status: 'paid', area: '' })} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex gap-2 items-center hover:bg-indigo-700"><Plus size={18} /> Nova Unidade</button></div>
      <Card>
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs"><tr><th className="p-3">Unidade</th><th className="p-3">Responsável</th><th className="p-3">Ocupação</th><th className="p-3">Situação Financeira</th><th className="p-3 text-right">Ações</th></tr></thead>
          <tbody>
            {data.map((u: any) => (
              <tr key={u.id} className="border-b hover:bg-slate-50">
                <td className="p-3 font-medium">{u.number} - Bloco {u.block}</td>
                <td className="p-3 text-slate-600">{u.responsible}</td>
                <td className="p-3">
                    {u.type === 'owner' ? 'Proprietário' : u.type === 'tenant' ? 'Inquilino' : 'Vazia'}
                </td>
                <td className="p-3"><StatusBadge status={u.status === 'paid' ? 'adimplente' : 'inadimplente'} /></td>
                <td className="p-3 text-right"><button onClick={() => handleEdit(u)} className="text-indigo-600 hover:text-indigo-800 font-medium">Editar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Editar Unidade" : "Nova Unidade"}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Unidade</label><input className={inputClass} value={editing?.number || ''} onChange={e => setEditing({...editing, number: e.target.value})} placeholder="Ex: 101" /></div>
            <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Bloco</label><input className={inputClass} value={editing?.block || ''} onChange={e => setEditing({...editing, block: e.target.value})} placeholder="Ex: A" /></div>
          </div>
          <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Responsável</label>
              <select className={inputClass} value={editing?.responsible || ''} onChange={e => setEditing({...editing, responsible: e.target.value})}>
                  <option value="">Selecionar Responsável</option>
                  <option value="-">-</option>
                  {residentsOptions.map((name:string, idx:number) => <option key={idx} value={name}>{name}</option>)}
              </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Tipo de Ocupação</label>
                <select className={inputClass} value={editing?.type} onChange={e => setEditing({...editing, type: e.target.value})}>
                    <option value="owner">Proprietário</option>
                    <option value="tenant">Inquilino</option>
                    <option value="vacant">Unidade Vazia</option>
                </select>
            </div>
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Situação Financeira</label>
                <select className={inputClass} value={editing?.status} onChange={e => setEditing({...editing, status: e.target.value})}>
                    <option value="paid">Adimplente</option>
                    <option value="debt">Inadimplente</option>
                </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Salvar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const ResidentsView = ({ data, onSave, onDelete }: any) => {
  const [editing, setEditing] = useState<any>(null);

  const handleSave = () => {
      // Check if it's a new resident (no id) or updating existing
      if(editing.id && data.find((r:any) => r.id === editing.id)){
          onSave(editing, true); // update
      } else {
          // New resident
          const newId = Math.max(...data.map((r:any) => r.id), 0) + 1;
          onSave({...editing, id: newId}, false); // create
      }
      setEditing(null);
  };

  const handleDelete = (id: number) => {
      if(window.confirm('Tem certeza que deseja excluir este morador?')){
          onDelete(id);
      }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-slate-800">Moradores</h2><button onClick={() => setEditing({ name: '', unit: '', phone: '', email: '', occupants: 1 })} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex gap-2 items-center hover:bg-indigo-700"><Plus size={18} /> Novo Morador</button></div>
      <Card>
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs"><tr><th className="p-3">Nome</th><th className="p-3">Unidade</th><th className="p-3">Contato</th><th className="p-3">Ocupantes</th><th className="p-3 text-right">Ações</th></tr></thead>
          <tbody>
            {data.map((r: any) => (
              <tr key={r.id} className="border-b hover:bg-slate-50">
                <td className="p-3 font-medium">{r.name}</td>
                <td className="p-3 text-slate-600">{r.unit}</td>
                <td className="p-3 text-slate-600">
                    <div>{r.email}</div>
                    <div className="text-xs text-slate-400">{r.phone}</div>
                </td>
                <td className="p-3 text-slate-600">{r.occupants}</td>
                <td className="p-3 text-right space-x-2">
                    <button onClick={() => setEditing(r)} className="text-indigo-600 hover:text-indigo-800 font-medium">Editar</button>
                    <button type="button" onClick={() => handleDelete(r.id)} className="text-rose-600 hover:text-rose-800 font-medium">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Editar Morador" : "Novo Morador"}>
          <div className="space-y-4">
              <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Nome Completo</label><input className={inputClass} value={editing?.name || ''} onChange={e => setEditing({...editing, name: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Email</label><input className={inputClass} value={editing?.email || ''} onChange={e => setEditing({...editing, email: e.target.value})} /></div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Telefone</label><input className={inputClass} value={editing?.phone || ''} onChange={e => setEditing({...editing, phone: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Unidade</label><input className={inputClass} placeholder="Ex: 101 - A" value={editing?.unit || ''} onChange={e => setEditing({...editing, unit: e.target.value})} /></div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Nº Ocupantes</label><input type="number" className={inputClass} value={editing?.occupants || 1} onChange={e => setEditing({...editing, occupants: parseInt(e.target.value)})} /></div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                  <button onClick={() => setEditing(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancelar</button>
                  <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Salvar</button>
              </div>
          </div>
      </Modal>
    </div>
  );
};

const MaintenanceView = ({ data, onSave, suppliers }: any) => {
  const [editing, setEditing] = useState<any>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const handleAction = (id: number, action: string) => {
      const item = data.find((i:any) => i.id === id);
      if(!item) return;
      
      let newStatus = item.status;
      if(action === 'complete') newStatus = 'completed';
      if(action === 'cancel') newStatus = 'cancelled';
      if(action === 'schedule') newStatus = 'scheduled';
      if(action === 'pending') newStatus = 'pending';
      if(action === 'in_progress') newStatus = 'in_progress';
      
      if(action === 'edit') {
          setEditing(item);
      } else {
          onSave({...item, status: newStatus}, true);
      }
  }

  const handleSaveEdit = () => {
      onSave(editing, !!editing.id); // true if editing existing
      setEditing(null);
  }

  const handleGenerateReport = (filters: any) => {
      // Filter data
      const reportData = data.filter((m: any) => {
          const mDate = new Date(m.date);
          const start = filters.start ? new Date(filters.start) : null;
          const end = filters.end ? new Date(filters.end) : null;
          
          if (start && mDate < start) return false;
          if (end && mDate > end) return false;
          if (filters.type !== 'all' && m.type !== filters.type) return false;
          
          return true;
      });

      // Generate content
      let content = `RELATÓRIO DE MANUTENÇÃO\n`;
      content += `Gerado em: ${new Date().toLocaleString('pt-BR')}\n`;
      content += `Período: ${filters.start ? new Date(filters.start).toLocaleDateString('pt-BR') : 'Início'} a ${filters.end ? new Date(filters.end).toLocaleDateString('pt-BR') : 'Fim'}\n`;
      content += `Tipo: ${filters.type === 'all' ? 'Todos' : filters.type}\n`;
      content += `--------------------------------------------------\n\n`;

      if (reportData.length === 0) {
          content += "Nenhum registro encontrado para os filtros selecionados.\n";
      } else {
          reportData.forEach((m: any) => {
              content += `ITEM: ${m.item}\n`;
              content += `DATA: ${new Date(m.date).toLocaleDateString('pt-BR')}\n`;
              content += `TIPO: ${m.type}\n`;
              content += `STATUS: ${m.status}\n`;
              content += `FORNECEDOR: ${m.supplier || 'N/A'}\n`;
              if (m.type === 'Preventiva' && m.validUntil) {
                  content += `VALIDADE LEGAL: ${new Date(m.validUntil).toLocaleDateString('pt-BR')}\n`;
              }
              content += `--------------------------------------------------\n`;
          });
      }

      // Create download
      const element = document.createElement("a");
      const file = new Blob([content], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `relatorio_manutencao_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(element); 
      element.click();
      document.body.removeChild(element);

      setShowReportModal(false);
  }

  // Calculate validity based on interval
  const handleIntervalChange = (months: number) => {
      if (!editing.date) return;
      const execDate = new Date(editing.date);
      execDate.setMonth(execDate.getMonth() + months);
      setEditing({...editing, validUntil: execDate.toISOString().split('T')[0]});
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">Plano de Manutenção</h2>
          <div className="flex gap-2">
              <button onClick={() => setShowReportModal(true)} className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2"><FileText size={18} /> Relatório</button>
              <button onClick={() => setEditing({ item: '', date: '', validUntil: '', type: 'Preventiva', status: 'pending', supplier: '' })} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex gap-2 items-center hover:bg-indigo-700"><Plus size={18} /> Nova O.S.</button>
          </div>
      </div>
      
      <div className="bg-white p-2 rounded-xl border border-slate-200 inline-flex gap-2">
          <button className="px-4 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">Todas</button>
          <button className="px-4 py-1.5 text-slate-500 hover:bg-slate-50 rounded-lg text-sm font-medium">Pendentes</button>
      </div>

      <Card>
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs"><tr><th className="p-3">Item</th><th className="p-3">Data Programada</th><th className="p-3">Fornecedor</th><th className="p-3">Tipo</th><th className="p-3">Status</th><th className="p-3 text-right">Ações</th></tr></thead>
          <tbody>
            {data.map((m: any) => (
              <tr key={m.id} className="border-b hover:bg-slate-50">
                <td className="p-3">
                    <p className="font-medium text-slate-800">{m.item}</p>
                </td>
                <td className="p-3 text-slate-600">
                    <div>{new Date(m.date).toLocaleDateString('pt-BR')}</div>
                    {m.type === 'Preventiva' && m.validUntil && <div className="text-xs text-slate-400">Val: {new Date(m.validUntil).toLocaleDateString('pt-BR')}</div>}
                </td>
                <td className="p-3 text-slate-600">{m.supplier || '-'}</td>
                <td className="p-3 text-slate-600">{m.type}</td>
                <td className="p-3"><StatusBadge status={m.status} /></td>
                <td className="p-3 text-right">
                    <ActionMenu 
                        onAction={(act) => handleAction(m.id, act)}
                        options={[
                            { label: 'Editar', value: 'edit' },
                            { label: 'Agendar', value: 'schedule', color: 'text-blue-600' },
                            { label: 'Iniciar Execução', value: 'in_progress', color: 'text-indigo-600' },
                            { label: 'Concluir', value: 'complete', color: 'text-emerald-600' },
                            { label: 'Voltar para Pendente', value: 'pending', color: 'text-amber-600' },
                            { label: 'Cancelar', value: 'cancel', color: 'text-rose-600' }
                        ]}
                    />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Editar Ordem de Serviço" : "Nova Ordem de Serviço"}>
          <div className="space-y-4">
              <input className={inputClass} placeholder="Descrição do Item / Serviço" value={editing?.item || ''} onChange={e => setEditing({...editing, item: e.target.value})} />
              
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Tipo</label>
                      <select className={inputClass} value={editing?.type} onChange={e => setEditing({...editing, type: e.target.value})}>
                          <option value="Preventiva">Preventiva</option>
                          <option value="Corretiva">Corretiva</option>
                          <option value="Rotina">Rotina</option>
                      </select>
                  </div>
                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Fornecedor</label>
                      <select className={inputClass} value={editing?.supplier || ''} onChange={e => setEditing({...editing, supplier: e.target.value})}>
                          <option value="">Selecionar</option>
                          {suppliers && suppliers.map((s:any) => <option key={s.id} value={s.name}>{s.name}</option>)}
                      </select>
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Data Execução</label>
                      <input type="date" className={inputClass} value={editing?.date || ''} onChange={e => setEditing({...editing, date: e.target.value})} />
                  </div>
                  {editing?.type === 'Preventiva' && (
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Periodicidade (Meses)</label>
                          <input 
                            type="number" 
                            className={inputClass} 
                            placeholder="Ex: 12" 
                            onChange={(e) => handleIntervalChange(parseInt(e.target.value))}
                          />
                      </div>
                  )}
              </div>
              
              {editing?.type === 'Preventiva' && (
                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Validade Legal (Calculada)</label>
                      <input type="date" className={inputClass} value={editing?.validUntil || ''} onChange={e => setEditing({...editing, validUntil: e.target.value})} />
                  </div>
              )}

              <div className="flex justify-end gap-2 mt-4">
                  <button onClick={() => setEditing(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancelar</button>
                  <button onClick={handleSaveEdit} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Salvar</button>
              </div>
          </div>
      </Modal>

      {/* Report Modal */}
      <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)} title="Relatório de Manutenção">
          <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Início</label>
                      <input type="date" id="report-start" className={inputClass} />
                  </div>
                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Fim</label>
                      <input type="date" id="report-end" className={inputClass} />
                  </div>
              </div>
              <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Tipo de Manutenção</label>
                  <select id="report-type" className={inputClass}>
                      <option value="all">Todas</option>
                      <option value="Preventiva">Preventiva</option>
                      <option value="Corretiva">Corretiva</option>
                      <option value="Rotina">Rotina</option>
                  </select>
              </div>
              <button 
                  onClick={() => handleGenerateReport({
                      start: (document.getElementById('report-start') as HTMLInputElement).value,
                      end: (document.getElementById('report-end') as HTMLInputElement).value,
                      type: (document.getElementById('report-type') as HTMLSelectElement).value
                  })} 
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 font-bold flex items-center justify-center gap-2"
              >
                  <FileText size={18} /> Gerar PDF
              </button>
          </div>
      </Modal>
    </div>
  );
};

const SuppliersView = ({ data, onSave }: any) => {
  const [editing, setEditing] = useState<any>(null);
  const [filter, setFilter] = useState('all'); // all, active, inactive

  const filteredData = data.filter((s:any) => {
      if(filter === 'active') return s.status === 'active';
      if(filter === 'inactive') return s.status === 'inactive';
      return true;
  });

  const handleDownloadContract = (name: string) => {
      const element = document.createElement("a");
      const file = new Blob([`Contrato de Prestação de Serviços - ${name}\n\nTermos do contrato...`], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `contrato_${name.replace(/\s/g, '_')}.txt`;
      document.body.appendChild(element); 
      element.click();
      document.body.removeChild(element);
  };

  const handleSave = () => {
      if(editing.id) {
          onSave(editing, true);
      } else {
          const newId = Math.max(...data.map((s:any) => s.id), 0) + 1;
          onSave({...editing, id: newId}, false);
      }
      setEditing(null);
  };

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">Fornecedores</h2>
            <button onClick={() => setEditing({ name: '', category: '', contact: '', status: 'active', contractStart: '', contractEnd: '' })} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex gap-2 items-center hover:bg-indigo-700">
                <Plus size={18} /> Novo Fornecedor
            </button>
        </div>

        <div className="bg-white p-2 rounded-xl border border-slate-200 inline-flex gap-2">
            <button onClick={() => setFilter('all')} className={`px-4 py-1.5 rounded-lg text-sm font-medium ${filter === 'all' ? 'bg-slate-100 text-slate-700' : 'text-slate-500 hover:bg-slate-50'}`}>Todos</button>
            <button onClick={() => setFilter('active')} className={`px-4 py-1.5 rounded-lg text-sm font-medium ${filter === 'active' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-slate-50'}`}>Ativos</button>
            <button onClick={() => setFilter('inactive')} className={`px-4 py-1.5 rounded-lg text-sm font-medium ${filter === 'inactive' ? 'bg-rose-50 text-rose-700' : 'text-slate-500 hover:bg-slate-50'}`}>Inativos</button>
        </div>

        <Card>
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                    <tr>
                        <th className="p-3">Nome</th>
                        <th className="p-3">Categoria</th>
                        <th className="p-3">Contato</th>
                        <th className="p-3">Vigência</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((s: any) => (
                        <tr key={s.id} className="border-b hover:bg-slate-50">
                            <td className="p-3 font-medium text-slate-900">{s.name}</td>
                            <td className="p-3 text-slate-600">{s.category}</td>
                            <td className="p-3 text-slate-600">{s.contact}</td>
                            <td className="p-3 text-slate-600 text-xs">
                                <div>Início: {s.contractStart}</div>
                                <div>Fim: {s.contractEnd}</div>
                            </td>
                            <td className="p-3"><StatusBadge status={s.status} /></td>
                            <td className="p-3 text-right space-x-3">
                                <button type="button" onClick={() => handleDownloadContract(s.name)} className="text-indigo-600 hover:text-indigo-800 text-xs font-bold uppercase tracking-wider">Contrato</button>
                                <button type="button" onClick={() => setEditing(s)} className="text-slate-400 hover:text-indigo-600">Editar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>

        <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Editar Fornecedor" : "Novo Fornecedor"}>
            <div className="space-y-4">
                <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Razão Social / Nome</label><input className={inputClass} value={editing?.name || ''} onChange={e => setEditing({...editing, name: e.target.value})} /></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Categoria</label><input className={inputClass} value={editing?.category || ''} onChange={e => setEditing({...editing, category: e.target.value})} /></div>
                    <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Contato</label><input className={inputClass} value={editing?.contact || ''} onChange={e => setEditing({...editing, contact: e.target.value})} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Início Contrato</label><input type="date" className={inputClass} value={editing?.contractStart || ''} onChange={e => setEditing({...editing, contractStart: e.target.value})} /></div>
                    <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Fim Contrato</label><input type="date" className={inputClass} value={editing?.contractEnd || ''} onChange={e => setEditing({...editing, contractEnd: e.target.value})} /></div>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Status</label>
                    <select className={inputClass} value={editing?.status || 'active'} onChange={e => setEditing({...editing, status: e.target.value})}>
                        <option value="active">Ativo</option>
                        <option value="inactive">Inativo</option>
                    </select>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={() => setEditing(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancelar</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Salvar</button>
                </div>
            </div>
        </Modal>
    </div>
  );
};

const InfractionsView = ({ data, onSave }: any) => {
  const [activeTab, setActiveTab] = useState('occurrences');
  const [showModal, setShowModal] = useState(false);
  const [selectedInfraction, setSelectedInfraction] = useState<any>(null);
  const [rules, setRules] = useState([
      { id: 1, article: 'Art. 5º', description: 'Barulho Excessivo', severity: 'Média', value: 250.00 },
      { id: 2, article: 'Art. 8º', description: 'Uso indevido da piscina', severity: 'Alta', value: 500.00 },
  ]);
  const [newInfraction, setNewInfraction] = useState({ unit: '', type: '', ruleId: '', description: '', value: 0, date: new Date().toISOString().split('T')[0], recurrence: 1 });

  const handleRuleChange = (ruleId: string) => {
      const rule = rules.find(r => r.id.toString() === ruleId);
      if(rule) {
          setNewInfraction({ ...newInfraction, ruleId, type: rule.description, value: rule.value });
      }
  }

  // Auto-calculate recurrence
  const calculateRecurrence = (unit: string, type: string) => {
      const count = data.filter((i:any) => i.unit === unit && i.type === type).length;
      return count + 1;
  }

  const handleUnitChange = (unit: string) => {
      const rec = calculateRecurrence(unit, newInfraction.type);
      setNewInfraction({...newInfraction, unit, recurrence: rec});
  }

  const handleSaveInfraction = () => {
      const id = Math.max(...data.map((i:any) => i.id), 0) + 1;
      onSave({...newInfraction, id, status: 'pending'}, false);
      setShowModal(false);
  }

  const handleStatusChange = (newStatus: string) => {
      if(selectedInfraction) {
          onSave({...selectedInfraction, status: newStatus}, true);
          setSelectedInfraction({...selectedInfraction, status: newStatus}); // update local modal state
      }
  }

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">Infrações e Regulação</h2>
            <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex gap-2 items-center hover:bg-indigo-700">
                <Plus size={18} /> Registrar Infração
            </button>
        </div>

        <div className="bg-white p-2 rounded-xl border border-slate-200 inline-flex gap-2">
            <button onClick={() => setActiveTab('occurrences')} className={`px-4 py-1.5 rounded-lg text-sm font-medium ${activeTab === 'occurrences' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}>Ocorrências</button>
            <button onClick={() => setActiveTab('rules')} className={`px-4 py-1.5 rounded-lg text-sm font-medium ${activeTab === 'rules' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}>Regimento Interno</button>
        </div>

        {activeTab === 'occurrences' ? (
            <Card>
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                        <tr><th className="p-3">Unidade</th><th className="p-3">Tipo de Infração</th><th className="p-3">Data</th><th className="p-3">Reincidência</th><th className="p-3">Valor Multa</th><th className="p-3">Status</th><th className="p-3 text-right">Ações</th></tr>
                    </thead>
                    <tbody>
                        {data.map((i: any) => (
                            <tr key={i.id} className="border-b hover:bg-slate-50">
                                <td className="p-3 font-bold text-slate-800">{i.unit}</td>
                                <td className="p-3 text-slate-600">{i.type}</td>
                                <td className="p-3 text-slate-600">{new Date(i.date).toLocaleDateString('pt-BR')}</td>
                                <td className="p-3"><span className="px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-600">{i.recurrence}ª vez</span></td>
                                <td className="p-3 font-medium text-slate-800">R$ {i.fine.toFixed(2)}</td>
                                <td className="p-3"><StatusBadge status={i.status} /></td>
                                <td className="p-3 text-right">
                                    <button onClick={() => setSelectedInfraction(i)} className="text-indigo-600 hover:underline">Detalhes</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        ) : (
            <Card title="Regras Cadastradas">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                        <tr><th className="p-3">Artigo</th><th className="p-3">Descrição</th><th className="p-3">Gravidade</th><th className="p-3">Valor Padrão</th></tr>
                    </thead>
                    <tbody>
                        {rules.map(r => (
                            <tr key={r.id} className="border-b">
                                <td className="p-3 font-bold">{r.article}</td>
                                <td className="p-3">{r.description}</td>
                                <td className="p-3">{r.severity}</td>
                                <td className="p-3">R$ {r.value.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        )}

        {/* Modal Registrar */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Registrar Infração">
            <div className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Unidade</label>
                    <input className={inputClass} placeholder="Ex: Unit 101" value={newInfraction.unit} onChange={e => handleUnitChange(e.target.value)} />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Tipo (Regimento)</label>
                    <select className={inputClass} onChange={e => handleRuleChange(e.target.value)}>
                        <option value="">Selecionar Regra infringida</option>
                        {rules.map(r => <option key={r.id} value={r.id}>{r.article} - {r.description}</option>)}
                    </select>
                </div>
                {newInfraction.recurrence > 1 && (
                    <div className="p-3 bg-amber-50 text-amber-700 rounded-lg text-sm flex gap-2 items-center">
                        <AlertTriangle size={16} />
                        Atenção: Esta é a {newInfraction.recurrence}ª ocorrência deste tipo para esta unidade.
                    </div>
                )}
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Valor da Multa</label>
                    <input type="number" className={inputClass} value={newInfraction.value} onChange={e => setNewInfraction({...newInfraction, value: parseFloat(e.target.value)})} />
                </div>
                <button onClick={handleSaveInfraction} className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold">Registrar</button>
            </div>
        </Modal>

        {/* Modal Detalhes */}
        <Modal isOpen={!!selectedInfraction} onClose={() => setSelectedInfraction(null)} title="Detalhes da Infração">
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
                    <div><p className="text-xs text-slate-500 uppercase">Unidade</p><p className="font-bold">{selectedInfraction?.unit}</p></div>
                    <div><p className="text-xs text-slate-500 uppercase">Data</p><p className="font-bold">{selectedInfraction?.date}</p></div>
                    <div className="col-span-2"><p className="text-xs text-slate-500 uppercase">Infração</p><p className="font-bold">{selectedInfraction?.type}</p></div>
                    <div><p className="text-xs text-slate-500 uppercase">Valor</p><p className="font-bold text-rose-600">R$ {selectedInfraction?.fine.toFixed(2)}</p></div>
                    <div><p className="text-xs text-slate-500 uppercase">Status</p><StatusBadge status={selectedInfraction?.status || ''} /></div>
                </div>
                
                <hr />
                <p className="text-sm font-bold text-slate-700">Alterar Status:</p>
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => handleStatusChange('pending')} className="py-2 bg-amber-100 text-amber-700 rounded hover:bg-amber-200 text-sm font-medium">Aguardando Defesa</button>
                    <button onClick={() => handleStatusChange('multado')} className="py-2 bg-rose-100 text-rose-700 rounded hover:bg-rose-200 text-sm font-medium">Aplicar Multa</button>
                    <button onClick={() => handleStatusChange('appealing')} className="py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 text-sm font-medium">Em Recurso</button>
                    <button onClick={() => handleStatusChange('archived')} className="py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 text-sm font-medium">Arquivar</button>
                </div>
            </div>
        </Modal>
    </div>
  );
};

const DocumentsView = ({ data, onSave, onDelete }: any) => {
  const [filter, setFilter] = useState('all'); // all, valid, expiring, expired
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [docToDelete, setDocToDelete] = useState<number | null>(null);
  const [viewingDoc, setViewingDoc] = useState<any>(null);
  const [newDoc, setNewDoc] = useState({ title: '', category: '', validUntil: '', permanent: false, file: null as string | null });

  // Status Logic
  const getDocStatus = (doc: any) => {
      if (doc.permanent) return 'permanent';
      const validUntil = new Date(doc.validUntil);
      const today = new Date();
      const diffTime = validUntil.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) return 'vencido';
      if (diffDays < 30) return 'expiring_soon';
      return 'vigente';
  };

  const filteredData = data.filter((d: any) => {
      const status = getDocStatus(d);
      if (filter === 'all') return true;
      if (filter === 'valid') return status === 'vigente' || status === 'permanent';
      if (filter === 'expiring') return status === 'expiring_soon';
      if (filter === 'expired') return status === 'vencido';
      return true;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setNewDoc({ ...newDoc, file: reader.result as string });
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSaveDoc = () => {
      const id = Math.max(...data.map((d:any) => d.id), 0) + 1;
      const date = new Date().toISOString().split('T')[0];
      onSave({...newDoc, id, date, validUntil: newDoc.permanent ? null : newDoc.validUntil});
      setShowUploadModal(false);
      setNewDoc({ title: '', category: '', validUntil: '', permanent: false, file: null });
  };

  const handleDelete = () => {
      if (docToDelete !== null) {
          onDelete(docToDelete);
          setDocToDelete(null);
      }
  };

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">Documentos e Alvarás</h2>
            <button onClick={() => setShowUploadModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex gap-2 items-center hover:bg-indigo-700">
                <UploadCloud size={18} /> Upload Documento
            </button>
        </div>

        <div className="bg-white p-2 rounded-xl border border-slate-200 inline-flex gap-2">
            <button onClick={() => setFilter('all')} className={`px-4 py-1.5 rounded-lg text-sm font-medium ${filter === 'all' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}>Todos</button>
            <button onClick={() => setFilter('valid')} className={`px-4 py-1.5 rounded-lg text-sm font-medium ${filter === 'valid' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-slate-50'}`}>Vigentes</button>
            <button onClick={() => setFilter('expiring')} className={`px-4 py-1.5 rounded-lg text-sm font-medium ${filter === 'expiring' ? 'bg-amber-50 text-amber-700' : 'text-slate-500 hover:bg-slate-50'}`}>A Vencer</button>
            <button onClick={() => setFilter('expired')} className={`px-4 py-1.5 rounded-lg text-sm font-medium ${filter === 'expired' ? 'bg-rose-50 text-rose-700' : 'text-slate-500 hover:bg-slate-50'}`}>Vencidos</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((doc: any) => (
                <div key={doc.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                            <FileText size={24} />
                        </div>
                        <StatusBadge status={getDocStatus(doc)} />
                    </div>
                    <h3 className="font-bold text-slate-800 mb-1">{doc.title}</h3>
                    <p className="text-sm text-slate-500 mb-4">{doc.category}</p>
                    <div className="text-xs text-slate-400 space-y-1 mb-6">
                        <p>Emissão: {new Date(doc.date).toLocaleDateString('pt-BR')}</p>
                        <p>Validade: {doc.permanent ? 'Indeterminada' : new Date(doc.validUntil).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="flex gap-2 border-t pt-4">
                        <button type="button" onClick={() => setViewingDoc(doc)} className="flex-1 flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-indigo-600 font-medium">
                            <Eye size={16} /> Visualizar
                        </button>
                        <button type="button" onClick={() => setDocToDelete(doc.id)} className="flex-1 flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-rose-600 font-medium">
                            <Trash2 size={16} /> Excluir
                        </button>
                    </div>
                </div>
            ))}
        </div>

        <Modal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} title="Upload de Documento">
            <div className="space-y-4">
                <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Título</label><input className={inputClass} value={newDoc.title} onChange={e => setNewDoc({...newDoc, title: e.target.value})} /></div>
                <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Categoria</label><input className={inputClass} value={newDoc.category} onChange={e => setNewDoc({...newDoc, category: e.target.value})} /></div>
                
                <div className="flex items-center gap-2 mb-2">
                    <input type="checkbox" id="perm" checked={newDoc.permanent} onChange={e => setNewDoc({...newDoc, permanent: e.target.checked})} />
                    <label htmlFor="perm" className="text-sm text-slate-700">Documento Permanente</label>
                </div>

                {!newDoc.permanent && (
                    <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Validade</label><input type="date" className={inputClass} value={newDoc.validUntil} onChange={e => setNewDoc({...newDoc, validUntil: e.target.value})} /></div>
                )}

                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} />
                    <UploadCloud size={32} className="mx-auto text-slate-400 mb-2" />
                    <p className="text-sm text-slate-500">{newDoc.file ? 'Arquivo selecionado!' : 'Clique para selecionar o arquivo'}</p>
                </div>

                <button onClick={handleSaveDoc} className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold mt-4">Salvar Documento</button>
            </div>
        </Modal>

        {/* View Document Modal */}
        <Modal isOpen={!!viewingDoc} onClose={() => setViewingDoc(null)} title={viewingDoc?.title || ''}>
            <div className="flex flex-col items-center justify-center p-4">
                {viewingDoc?.file ? (
                    viewingDoc.file.startsWith('data:image') ? 
                        <img src={viewingDoc.file} alt="Doc" className="max-w-full rounded shadow" /> :
                        <embed src={viewingDoc.file} className="w-full h-96 border rounded" />
                ) : (
                    <div className="text-center py-10">
                        <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-slate-500">Visualização simulada (Arquivo de exemplo)</p>
                    </div>
                )}
            </div>
        </Modal>

        {/* Confirmation Delete Modal */}
        <Modal isOpen={docToDelete !== null} onClose={() => setDocToDelete(null)} title="Confirmar Exclusão">
            <p className="text-slate-600 mb-6">Tem certeza que deseja excluir este documento?</p>
            <div className="flex justify-end gap-2">
                <button onClick={() => setDocToDelete(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancelar</button>
                <button onClick={handleDelete} className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700">Excluir</button>
            </div>
        </Modal>
    </div>
  );
};

const SettingsView = ({ users, onUpdateUsers, condos, currentCondoId, onUpdateCondo, settings, onSaveSettings }: any) => {
  const [activeTab, setActiveTab] = useState('condo');
  const [editingUser, setEditingUser] = useState<any>(null);
  
  // Notification settings local state
  const [notifPrefs, setNotifPrefs] = useState(settings);

  // Condo Data Logic - Synced with currentCondoId
  const currentCondo = condos.find((c: any) => c.id === currentCondoId);
  const [condoForm, setCondoForm] = useState(currentCondo || {});

  // Update form when condo context changes
  useEffect(() => {
    if (currentCondo) {
      setCondoForm(currentCondo);
    }
  }, [currentCondo]); // Dependency ensures sync

  const handleSaveCondo = () => {
     onUpdateCondo(condoForm);
     alert('Dados atualizados com sucesso!');
  };

  const handleSaveUser = () => {
      if(editingUser.id) {
          onUpdateUsers(users.map((u:any) => u.id === editingUser.id ? editingUser : u));
      } else {
          const newId = Math.max(...users.map((u:any) => u.id), 0) + 1;
          onUpdateUsers([...users, {...editingUser, id: newId}]);
      }
      setEditingUser(null);
  };

  const toggleUserStatus = (user: any) => {
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      onUpdateUsers(users.map((u:any) => u.id === user.id ? {...u, status: newStatus} : u));
  }

  const togglePermission = (condoId: number) => {
      const currentPerms = editingUser.permittedCondos || [];
      if(currentPerms.includes(condoId)) {
          setEditingUser({...editingUser, permittedCondos: currentPerms.filter((id:number) => id !== condoId)});
      } else {
          setEditingUser({...editingUser, permittedCondos: [...currentPerms, condoId]});
      }
  }

  const handleSavePrefs = () => {
      onSaveSettings(notifPrefs);
      alert('Preferências de notificação salvas com sucesso!');
  };

  return (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">Configurações</h2>
        
        <div className="border-b border-slate-200 flex gap-6">
            <button onClick={() => setActiveTab('condo')} className={`pb-3 border-b-2 font-medium transition-all ${activeTab === 'condo' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}>Dados do Condomínio</button>
            <button onClick={() => setActiveTab('users')} className={`pb-3 border-b-2 font-medium transition-all ${activeTab === 'users' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}>Usuários e Permissões</button>
            <button onClick={() => setActiveTab('notifications')} className={`pb-3 border-b-2 font-medium transition-all ${activeTab === 'notifications' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}>Notificações</button>
        </div>

        {activeTab === 'condo' && (
            <Card className="p-8">
                <h3 className="text-sm font-bold text-slate-500 uppercase mb-6">Dados Cadastrais</h3>
                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Razão Social</label><input className={inputClass} value={condoForm.name || ''} onChange={e => setCondoForm({...condoForm, name: e.target.value})} /></div>
                    <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">CNPJ</label><input className={inputClass} value={condoForm.cnpj || ''} onChange={e => setCondoForm({...condoForm, cnpj: e.target.value})} /></div>
                </div>
                <div className="mb-6">
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Endereço</label>
                    <input className={inputClass} value={condoForm.address || ''} onChange={e => setCondoForm({...condoForm, address: e.target.value})} />
                </div>
                <div className="flex justify-end">
                    <button onClick={handleSaveCondo} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700">Salvar Alterações</button>
                </div>
            </Card>
        )}

        {activeTab === 'users' && (
            <div>
                <div className="flex justify-between items-center mb-4"><h3 className="text-sm font-bold text-slate-500 uppercase">Usuários do Sistema</h3><button onClick={() => setEditingUser({ name: '', email: '', role: 'Portaria', status: 'active', permittedCondos: [] })} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold">Novo Usuário</button></div>
                <Card>
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-xs"><tr><th className="p-3">Nome</th><th className="p-3">Email</th><th className="p-3">Permissões (IDs)</th><th className="p-3">Função</th><th className="p-3">Status</th><th className="p-3 text-right">Ações</th></tr></thead>
                        <tbody>
                            {users.map((u: any) => (
                                <tr key={u.id} className="border-b hover:bg-slate-50">
                                    <td className="p-3 font-medium text-slate-800 flex items-center gap-2">
                                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500"><Users size={16}/></div>
                                        {u.name}
                                    </td>
                                    <td className="p-3 text-slate-600">{u.email}</td>
                                    <td className="p-3 text-slate-600">
                                        {u.permittedCondos ? u.permittedCondos.join(', ') : 'Nenhum'}
                                    </td>
                                    <td className="p-3 text-slate-600">{u.role}</td>
                                    <td className="p-3"><StatusBadge status={u.status} /></td>
                                    <td className="p-3 text-right space-x-2">
                                        <button onClick={() => toggleUserStatus(u)} className={`text-xs font-bold px-2 py-1 rounded ${u.status === 'active' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                            {u.status === 'active' ? 'Desativar' : 'Ativar'}
                                        </button>
                                        <button onClick={() => setEditingUser(u)} className="text-indigo-600 font-medium">Editar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </div>
        )}

        {activeTab === 'notifications' && (
            <Card className="p-8">
                <h3 className="text-sm font-bold text-slate-500 uppercase mb-6">Preferências de Notificação</h3>
                
                <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <label className="font-bold text-slate-700 block mb-2">Alertas de Vencimento</label>
                    <p className="text-xs text-slate-500 mb-3">Receber avisos antes do vencimento de documentos e contas</p>
                    <div className="flex items-center gap-3">
                        <input 
                            type="number" 
                            className="w-20 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900" 
                            value={notifPrefs.alertDays}
                            onChange={(e) => setNotifPrefs({...notifPrefs, alertDays: parseInt(e.target.value)})}
                        />
                        <span className="text-sm text-slate-600">dias antes</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-4">Canais</h4>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                                <input type="checkbox" checked={notifPrefs.channels.email} onChange={(e) => setNotifPrefs({...notifPrefs, channels: {...notifPrefs.channels, email: e.target.checked}})} className="w-4 h-4 text-indigo-600 rounded" />
                                <span className="text-sm font-medium text-slate-700">Notificações por Email</span>
                            </label>
                            <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                                <input type="checkbox" checked={notifPrefs.channels.push} onChange={(e) => setNotifPrefs({...notifPrefs, channels: {...notifPrefs.channels, push: e.target.checked}})} className="w-4 h-4 text-indigo-600 rounded" />
                                <span className="text-sm font-medium text-slate-700">Notificações no App (Push)</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-4">Tipos de Evento</h4>
                        <div className="space-y-3">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={notifPrefs.events.infractions} onChange={(e) => setNotifPrefs({...notifPrefs, events: {...notifPrefs.events, infractions: e.target.checked}})} className="rounded text-indigo-600" />
                                <span className="text-sm text-slate-600">Novas Infrações Registradas</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={notifPrefs.events.maintenance} onChange={(e) => setNotifPrefs({...notifPrefs, events: {...notifPrefs.events, maintenance: e.target.checked}})} className="rounded text-indigo-600" />
                                <span className="text-sm text-slate-600">Atualizações de Status de Manutenção</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={notifPrefs.events.bills} onChange={(e) => setNotifPrefs({...notifPrefs, events: {...notifPrefs.events, bills: e.target.checked}})} className="rounded text-indigo-600" />
                                <span className="text-sm text-slate-600">Contas a Pagar Vencendo</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={notifPrefs.events.documents} onChange={(e) => setNotifPrefs({...notifPrefs, events: {...notifPrefs.events, documents: e.target.checked}})} className="rounded text-indigo-600" />
                                <span className="text-sm text-slate-600">Documentos e Alvarás Expirando</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={notifPrefs.events.residents} onChange={(e) => setNotifPrefs({...notifPrefs, events: {...notifPrefs.events, residents: e.target.checked}})} className="rounded text-indigo-600" />
                                <span className="text-sm text-slate-600">Novos Moradores Cadastrados</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-8">
                    <button onClick={handleSavePrefs} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">Salvar Preferências</button>
                </div>
            </Card>
        )}

        <Modal isOpen={!!editingUser} onClose={() => setEditingUser(null)} title="Editar Usuário">
            <div className="space-y-4">
                <input className={inputClass} placeholder="Nome" value={editingUser?.name || ''} onChange={e => setEditingUser({...editingUser, name: e.target.value})} />
                <input className={inputClass} placeholder="Email" value={editingUser?.email || ''} onChange={e => setEditingUser({...editingUser, email: e.target.value})} />
                <select className={inputClass} value={editingUser?.role || 'Portaria'} onChange={e => setEditingUser({...editingUser, role: e.target.value})}>
                    <option value="Síndico">Síndico</option>
                    <option value="Administradora">Administradora</option>
                    <option value="Portaria">Portaria</option>
                </select>
                
                <div className="border p-3 rounded-lg">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">Permissões de Acesso (Condomínios)</p>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                        {condos.map((c:any) => (
                            <label key={c.id} className="flex items-center gap-2 text-sm">
                                <input 
                                    type="checkbox" 
                                    checked={editingUser?.permittedCondos?.includes(c.id)}
                                    onChange={() => togglePermission(c.id)}
                                />
                                {c.name} (ID {c.id})
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={() => setEditingUser(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancelar</button>
                    <button onClick={handleSaveUser} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Salvar</button>
                </div>
            </div>
        </Modal>
    </div>
  );
};

const RegistrationView = ({ data, onUpdate }: any) => {
  const [editing, setEditing] = useState<any>(null);
  const [condoToDelete, setCondoToDelete] = useState<number | null>(null);

  const handleSave = () => {
    if (editing.id) onUpdate(data.map((c: any) => c.id === editing.id ? editing : c));
    else {
      // Auto-increment ID based on max existing ID (Sequential)
      const maxId = data.reduce((max: number, c: any) => Math.max(max, c.id), 0);
      onUpdate([...data, { ...editing, id: maxId + 1 }]);
    }
    setEditing(null);
  };

  const confirmDelete = () => {
    if (condoToDelete) {
      onUpdate(data.filter((c: any) => c.id !== condoToDelete));
      setCondoToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-slate-800">Cadastros</h2></div>
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold text-slate-700">Lista de Condomínios</h3><button onClick={() => setEditing({ name: '', cnpj: '', address: '', syndic: '' })} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex gap-2 items-center hover:bg-indigo-700 transition-colors"><Plus size={18} /> Novo Condomínio</button></div>
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs"><tr><th className="p-3">ID</th><th className="p-3">Nome</th><th className="p-3">CNPJ</th><th className="p-3">Endereço</th><th className="p-3">Síndico</th><th className="p-3 text-right">Ações</th></tr></thead>
          <tbody>
            {data.map((c: any) => (
              <tr key={c.id} className="border-b hover:bg-slate-50 transition-colors">
                <td className="p-3 text-slate-500">{c.id}</td>
                <td className="p-3 font-medium flex items-center gap-2"><Building size={16} className="text-indigo-500"/> {c.name}</td>
                <td className="p-3 text-slate-600">{c.cnpj}</td>
                <td className="p-3 text-slate-600">{c.address}</td>
                <td className="p-3 text-slate-600">{c.syndic}</td>
                <td className="p-3 text-right space-x-2">
                  <button type="button" onClick={() => setEditing(c)} className="text-slate-400 hover:text-indigo-600 transition-colors"><Edit size={18} /></button>
                  <button type="button" onClick={() => setCondoToDelete(c.id)} className="text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Edit/Create Modal */}
      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title="Condomínio">
        <div className="space-y-4">
          <input className={inputClass} placeholder="Nome do Condomínio" value={editing?.name || ''} onChange={e => setEditing({...editing, name: e.target.value})} />
          <input className={inputClass} placeholder="CNPJ" value={editing?.cnpj || ''} onChange={e => setEditing({...editing, cnpj: e.target.value})} />
          <input className={inputClass} placeholder="Endereço Completo" value={editing?.address || ''} onChange={e => setEditing({...editing, address: e.target.value})} />
          <input className={inputClass} placeholder="Nome do Síndico" value={editing?.syndic || ''} onChange={e => setEditing({...editing, syndic: e.target.value})} />
          <div className="flex justify-end gap-2"><button onClick={() => setEditing(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancelar</button><button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">Salvar</button></div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!condoToDelete} onClose={() => setCondoToDelete(null)} title="Confirmar Exclusão">
         <p className="text-slate-600 mb-6">Tem certeza que deseja excluir este condomínio? Todos os dados vinculados a ele serão perdidos.</p>
         <div className="flex justify-end gap-2">
           <button onClick={() => setCondoToDelete(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancelar</button>
           <button onClick={confirmDelete} className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors">Excluir</button>
         </div>
      </Modal>
    </div>
  );
};

const Sidebar = ({ view, setView, currentCondo }: { view: ViewState, setView: (v: ViewState) => void, currentCondo: any }) => {
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state

  const MenuItem = ({ id, icon: Icon, label }: any) => (
    <button
      onClick={() => { setView(id); setIsOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${view === id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
    >
      <Icon size={20} /> {label}
    </button>
  );

  return (
    <>
        {/* Mobile Header Toggle */}
        <div className="lg:hidden fixed top-0 left-0 p-4 z-50">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 bg-slate-800 text-white rounded-lg shadow-lg">
                {isOpen ? <X /> : <Menu />}
            </button>
        </div>

        {/* Sidebar Drawer */}
        <div className={`fixed inset-y-0 left-0 bg-slate-900 w-64 p-6 flex flex-col gap-8 transition-transform transform z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
            <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/20">
                <Building className="text-white" size={24} />
                </div>
                <div>
                <h1 className="font-bold text-white text-lg leading-tight">GestorCondo</h1>
                <p className="text-xs text-slate-500 font-medium tracking-wider">PRO 360</p>
                </div>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto">
                <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Principal</p>
                <MenuItem id="dashboard" icon={LayoutDashboard} label="Visão Geral" />
                <MenuItem id="units" icon={Building} label="Unidades" />
                <MenuItem id="residents" icon={Users} label="Moradores" />
                <MenuItem id="maintenance" icon={Wrench} label="Manutenção" />
                
                <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mt-6 mb-2">Administrativo</p>
                <MenuItem id="finance" icon={DollarSign} label="Financeiro" />
                <MenuItem id="suppliers" icon={Truck} label="Fornecedores" />
                <MenuItem id="infractions" icon={AlertTriangle} label="Infrações" />
                <MenuItem id="documents" icon={FileText} label="Documentos" />
                
                <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mt-6 mb-2">Sistema</p>
                <MenuItem id="registration" icon={Database} label="Cadastros" />
                <MenuItem id="settings" icon={Settings} label="Configurações" />
            </div>

            {/* Current Condo Info in Sidebar */}
            <div className="px-4 pt-4 border-t border-slate-800">
                <p className="text-xs text-slate-500 uppercase">Condomínio Atual</p>
                <p className="text-sm font-bold text-white truncate">{currentCondo?.name || 'Selecione'}</p>
            </div>
        </div>
        
        {/* Overlay for mobile */}
        {isOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsOpen(false)} />}
    </>
  );
};

// --- APP ---

const App = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [currentCondoId, setCurrentCondoId] = useState(1);
  const [showCondoMenu, setShowCondoMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // -- DATABASE (LOCALSTORAGE) --
  const load = (key: string, def: any) => {
      const saved = localStorage.getItem(`gestorcondo_${key}`);
      return saved ? JSON.parse(saved) : def;
  }

  const [condos, setCondos] = useState(() => load('condos', MOCK_CONDOS));
  const [units, setUnits] = useState(() => load('units', MOCK_UNITS));
  const [residents, setResidents] = useState(() => load('residents', MOCK_RESIDENTS));
  const [maintenance, setMaintenance] = useState(() => load('maintenance', MOCK_MAINTENANCE));
  const [finance, setFinance] = useState(() => load('finance', MOCK_FINANCE));
  const [suppliers, setSuppliers] = useState(() => load('suppliers', MOCK_SUPPLIERS));
  const [infractions, setInfractions] = useState(() => load('infractions', MOCK_INFRACTIONS));
  const [documents, setDocuments] = useState(() => load('documents', MOCK_DOCUMENTS));
  const [users, setUsers] = useState(() => load('users', MOCK_USERS));
  const [appSettings, setAppSettings] = useState(() => load('settings', DEFAULT_SETTINGS));

  // Persist Data
  useEffect(() => localStorage.setItem('gestorcondo_condos', JSON.stringify(condos)), [condos]);
  useEffect(() => localStorage.setItem('gestorcondo_units', JSON.stringify(units)), [units]);
  useEffect(() => localStorage.setItem('gestorcondo_residents', JSON.stringify(residents)), [residents]);
  useEffect(() => localStorage.setItem('gestorcondo_maintenance', JSON.stringify(maintenance)), [maintenance]);
  useEffect(() => localStorage.setItem('gestorcondo_finance', JSON.stringify(finance)), [finance]);
  useEffect(() => localStorage.setItem('gestorcondo_suppliers', JSON.stringify(suppliers)), [suppliers]);
  useEffect(() => localStorage.setItem('gestorcondo_infractions', JSON.stringify(infractions)), [infractions]);
  useEffect(() => localStorage.setItem('gestorcondo_documents', JSON.stringify(documents)), [documents]);
  useEffect(() => localStorage.setItem('gestorcondo_users', JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem('gestorcondo_settings', JSON.stringify(appSettings)), [appSettings]);

  // Notifications Logic
  const notifications = useMemo(() => {
      const alerts = [];
      const today = new Date();

      // Documents Alerts
      if (appSettings.events.documents) {
          const docAlerts = documents.filter((d:any) => {
              if (d.condoId !== currentCondoId || d.permanent) return false;
              const validUntil = new Date(d.validUntil);
              const diffTime = validUntil.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              return diffDays <= appSettings.alertDays;
          });
          if(docAlerts.length > 0) alerts.push({ id: 'doc', text: `${docAlerts.length} documento(s) vencendo ou vencidos`, type: 'alert' });
      }

      // Bills Alerts (Finance)
      if (appSettings.events.bills) {
          const billAlerts = finance.filter((f:any) => {
              if (f.condoId !== currentCondoId || f.status !== 'pending' || f.type !== 'expense') return false;
              const dueDate = new Date(f.dueDate);
              const diffTime = dueDate.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              return diffDays <= appSettings.alertDays;
          });
          if(billAlerts.length > 0) alerts.push({ id: 'bill', text: `${billAlerts.length} conta(s) a pagar próximas do vencimento`, type: 'warning' });
      }

      // Maintenance Alerts
      if (appSettings.events.maintenance) {
          const maintAlerts = maintenance.filter((m:any) => {
              if (m.condoId !== currentCondoId || m.status === 'completed' || m.status === 'cancelled') return false;
              const date = new Date(m.date);
              const diffTime = date.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              return diffDays <= appSettings.alertDays;
          });
          if(maintAlerts.length > 0) alerts.push({ id: 'maint', text: `${maintAlerts.length} manutenção(ões) agendadas em breve`, type: 'info' });
      }

      return alerts;
  }, [documents, finance, maintenance, currentCondoId, appSettings]);

  const currentCondoData = condos.find((c: any) => c.id === currentCondoId);

  const resetDb = () => {
      if(confirm('Tem certeza? Isso apagará todos os seus dados e restaurará os padrões.')){
          localStorage.clear();
          window.location.reload();
      }
  }

  // Filter data by current condo
  const condoProps = {
      condoId: currentCondoId,
      units: units.filter((u:any) => u.condoId === currentCondoId),
      residents: residents.filter((r:any) => r.condoId === currentCondoId),
      maintenance: maintenance.filter((m:any) => m.condoId === currentCondoId),
      finance: finance.filter((f:any) => f.condoId === currentCondoId),
      suppliers: suppliers.filter((s:any) => s.condoId === currentCondoId),
      infractions: infractions.filter((i:any) => i.condoId === currentCondoId),
      documents: documents.filter((d:any) => d.condoId === currentCondoId),
  };

  // Generic Update Handlers (adding condoId to new items)
  const createUpdateHandler = (setter: any, allData: any[]) => (newData: any, isUpdate: boolean) => {
      if(isUpdate) {
          setter(allData.map(d => d.id === newData.id ? newData : d));
      } else {
          setter([...allData, { ...newData, condoId: currentCondoId }]);
      }
  };

  const createDeleteHandler = (setter: any, allData: any[]) => (id: number) => {
      setter(allData.filter(d => d.id !== id));
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar view={view} setView={setView} currentCondo={currentCondoData} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* HEADER */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shadow-sm shrink-0 z-20">
            <div className="relative">
                <button 
                    onClick={() => setShowCondoMenu(!showCondoMenu)} 
                    className="flex items-center gap-2 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors group"
                >
                    <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Building size={20} />
                    </div>
                    <div className="text-left">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Condomínio Atual</p>
                        <div className="flex items-center gap-1">
                            <h2 className="font-bold text-slate-800">{currentCondoData?.name}</h2>
                            <ChevronDown size={14} className="text-slate-400" />
                        </div>
                    </div>
                </button>

                {showCondoMenu && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowCondoMenu(false)}/>
                        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-100 z-20 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                            <div className="p-3 bg-slate-50 border-b border-slate-100">
                                <p className="text-xs font-bold text-slate-500 uppercase">Selecione o Condomínio</p>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                {condos.map((c:any) => (
                                    <button 
                                        key={c.id}
                                        onClick={() => { setCurrentCondoId(c.id); setShowCondoMenu(false); }}
                                        className={`w-full text-left p-3 hover:bg-indigo-50 flex items-center gap-3 transition-colors ${currentCondoId === c.id ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'border-l-4 border-transparent'}`}
                                    >
                                        <div className="bg-white p-2 rounded-full shadow-sm text-slate-600">
                                            <Building size={16}/>
                                        </div>
                                        <div>
                                            <p className={`font-bold text-sm ${currentCondoId === c.id ? 'text-indigo-700' : 'text-slate-700'}`}>{c.name}</p>
                                            <p className="text-xs text-slate-400">{c.cnpj}</p>
                                        </div>
                                        {currentCondoId === c.id && <CheckCircle size={16} className="ml-auto text-indigo-600" />}
                                    </button>
                                ))}
                            </div>
                            <div className="p-2 border-t border-slate-100 bg-slate-50">
                                <button onClick={() => { setView('registration'); setShowCondoMenu(false); }} className="w-full py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors flex items-center justify-center gap-2">
                                    <Settings size={14} /> Gerenciar Condomínios
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="flex items-center gap-6">
                <div className="relative">
                    <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                        <Bell size={20} />
                        {notifications.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>}
                    </button>
                    {showNotifications && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)}/>
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 z-20 overflow-hidden">
                                <div className="p-3 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="font-bold text-sm text-slate-700">Notificações</h3>
                                    <span className="text-xs bg-slate-100 px-2 py-1 rounded-full text-slate-600">{notifications.length}</span>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-8 text-center text-slate-400 text-sm">Nenhuma notificação</div>
                                    ) : (
                                        notifications.map((n:any) => (
                                            <div key={n.id} className="p-3 hover:bg-slate-50 border-b border-slate-50 flex gap-3">
                                                <div className="mt-1 text-rose-500"><AlertCircle size={16}/></div>
                                                <p className="text-sm text-slate-600">{n.text}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
                
                <div className="h-8 w-px bg-slate-200"></div>
                
                <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-slate-800">Carlos Síndico</p>
                        <p className="text-xs text-slate-500">Gestor Principal</p>
                    </div>
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold border-2 border-white shadow-sm">
                        CS
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 ml-2" title="Sair"><LogOut size={18} /></button>
                </div>
            </div>
        </header>

        {/* CONTENT AREA */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto pb-10">
                {view === 'dashboard' && <DashboardView data={condoProps.finance} units={condoProps.units} maintenance={condoProps.maintenance} navigateTo={setView} documents={condoProps.documents} />}
                {view === 'units' && <UnitsView data={condoProps.units} residents={condoProps.residents} onSave={createUpdateHandler(setUnits, units)} />}
                {view === 'residents' && <ResidentsView data={condoProps.residents} onSave={createUpdateHandler(setResidents, residents)} onDelete={createDeleteHandler(setResidents, residents)} />}
                {view === 'maintenance' && <MaintenanceView data={condoProps.maintenance} onSave={createUpdateHandler(setMaintenance, maintenance)} suppliers={condoProps.suppliers} />}
                {view === 'finance' && <FinanceView data={condoProps.finance} onSave={createUpdateHandler(setFinance, finance)} suppliers={condoProps.suppliers} />}
                {view === 'suppliers' && <SuppliersView data={condoProps.suppliers} onSave={createUpdateHandler(setSuppliers, suppliers)} />}
                {view === 'infractions' && <InfractionsView data={condoProps.infractions} onSave={createUpdateHandler(setInfractions, infractions)} />}
                {view === 'documents' && <DocumentsView data={condoProps.documents} onSave={createUpdateHandler(setDocuments, documents)} onDelete={createDeleteHandler(setDocuments, documents)} />}
                
                {/* Global Settings & Registration are partially condo-agnostic but may use condo info */}
                {view === 'settings' && <SettingsView users={users} onUpdateUsers={setUsers} condos={condos} currentCondoId={currentCondoId} onUpdateCondo={(updated:any) => setCondos(condos.map((c:any) => c.id === currentCondoId ? updated : c))} settings={appSettings} onSaveSettings={setAppSettings} />}
                {view === 'registration' && <RegistrationView data={condos} onUpdate={setCondos} />}
            </div>
        </main>

        {/* DEBUG RESET */}
        <div className="fixed bottom-4 left-4 z-50">
            <button onClick={resetDb} className="text-xs text-rose-300 hover:text-rose-500 flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
                <Database size={12} /> Resetar Banco de Dados
            </button>
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
