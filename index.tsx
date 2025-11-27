import React, { useState, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  DollarSign, 
  AlertTriangle, 
  Wrench, 
  Building2, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Calendar, 
  Truck,
  X,
  Search,
  User,
  Settings,
  Bell,
  FileText,
  UploadCloud,
  File,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Menu,
  ChevronDown,
  MoreVertical,
  Plus,
  Filter,
  Download,
  AlertCircle,
  PieChart,
  Wallet,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

// Types
type ViewState = 'dashboard' | 'units' | 'finance' | 'maintenance' | 'settings' | 'suppliers' | 'documents' | 'infractions';

// Mock Data Initial State
const MOCK_UNITS = [
  { id: 1, unit: '101', block: 'A', owner: 'João Silva', status: 'occupied', type: 'owner' },
  { id: 2, unit: '102', block: 'A', owner: 'Maria Souza', status: 'debt', type: 'tenant' },
  { id: 3, unit: '103', block: 'B', owner: '', status: 'debt', type: 'vacant' },
  { id: 4, unit: '104', block: 'B', owner: 'Pedro Santos', status: 'occupied', type: 'owner' },
  { id: 5, unit: '105', block: 'C', owner: 'Ana Pereira', status: 'occupied', type: 'owner' },
  { id: 6, unit: '106', block: 'C', owner: 'Carlos Lima', status: 'debt', type: 'tenant' },
];

const MOCK_FINANCE = [
  { id: 1, type: 'income', status: 'paid', amount: 2500, desc: 'Aluguel 101', category: 'Aluguel', date: '2023-11-05' },
  { id: 2, type: 'expense', status: 'paid', amount: 350, desc: 'Material Limpeza', category: 'Serviços', date: '2023-11-10' },
  { id: 3, type: 'expense', status: 'pending', amount: 1200, desc: 'Manutenção Elevador', category: 'Manutenção', date: '2023-11-25' },
  { id: 4, type: 'income', status: 'paid', amount: 2500, desc: 'Aluguel 104', category: 'Aluguel', date: '2023-11-05' },
  { id: 5, type: 'income', status: 'pending', amount: 2500, desc: 'Aluguel 105', category: 'Aluguel', date: '2023-12-05' },
  { id: 6, type: 'expense', status: 'overdue', amount: 500, desc: 'Conta de Luz', category: 'Utilidades', date: '2023-11-15' },
];

const MOCK_MAINTENANCE = [
  { id: 1, item: 'Elevador Bloco A', date: '2023-11-25', status: 'pending', type: 'Preventiva', priority: 'high', assignee: 'TechElevators', validUntil: '2024-11-25' },
  { id: 2, item: 'Lâmpadas Hall', date: '2023-11-20', status: 'completed', type: 'Corretiva', priority: 'low', assignee: 'Zelador', validUntil: '' },
  { id: 3, item: 'Bomba Piscina', date: '2023-11-28', status: 'scheduled', type: 'Preventiva', priority: 'medium', assignee: 'PoolService', validUntil: '2024-05-28' },
  { id: 4, item: 'Portão Garagem', date: '2023-11-15', status: 'cancelled', type: 'Corretiva', priority: 'high', assignee: 'Serralheria', validUntil: '' },
  { id: 5, item: 'Jardinagem', date: '2023-11-22', status: 'pending', type: 'Rotina', priority: 'low', assignee: 'Jardinagem Verde', validUntil: '' },
];

const MOCK_SUPPLIERS = [
  { id: 1, name: 'TechElevators', category: 'Manutenção', contact: '(11) 9999-8888', contractStart: '2023-01-01', contractEnd: '2024-01-01', status: 'active', service: 'Elevadores' },
  { id: 2, name: 'PoolService', category: 'Limpeza', contact: '(11) 9777-6666', contractStart: '2023-03-15', contractEnd: '2024-03-15', status: 'active', service: 'Piscinas' },
  { id: 3, name: 'Segurança Total', category: 'Segurança', contact: '(11) 9555-4444', contractStart: '2022-06-01', contractEnd: '2023-06-01', status: 'inactive', service: 'Portaria' },
];

const MOCK_INFRACTIONS = [
  { id: 1, unit: '102', type: 'Barulho Excessivo', date: '2023-11-20', amount: 250.00, status: 'awaiting_defense', recurrence: 1 },
  { id: 2, unit: '106', type: 'Estacionamento Irregular', date: '2023-11-18', amount: 150.00, status: 'fined', recurrence: 2 },
  { id: 3, unit: '101', type: 'Mudança fora de horário', date: '2023-11-10', amount: 500.00, status: 'appealing', recurrence: 1 },
];

const MOCK_REGIMENT_RULES = [
  { id: 1, article: 'Art. 15', description: 'Barulho após as 22h', severity: 'Média', defaultAmount: 250.00 },
  { id: 2, article: 'Art. 22', description: 'Estacionamento em vaga alheia', severity: 'Leve', defaultAmount: 150.00 },
  { id: 3, article: 'Art. 8', description: 'Obras sem autorização', severity: 'Grave', defaultAmount: 1000.00 },
];

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'Nova Infração', message: 'Unidade 102 registrou defesa.', time: '2h atrás', read: false },
  { id: 2, title: 'Manutenção', message: 'Elevador Bloco A vence em 3 dias.', time: '5h atrás', read: false },
  { id: 3, title: 'Pagamento', message: 'Fatura Fornecedor TechElevators paga.', time: '1d atrás', read: true },
];

const MOCK_SYSTEM_USERS = [
  { id: 1, name: 'Carlos Síndico', email: 'sindico@condo.com', role: 'Síndico', status: 'active' },
  { id: 2, name: 'Ana Admin', email: 'ana@admin.com', role: 'Administradora', status: 'active' },
  { id: 3, name: 'Portaria', email: 'portaria@condo.com', role: 'Porteiro', status: 'inactive' },
];

const MOCK_DOCUMENTS = [
  { id: 1, title: 'AVCB - Auto de Vistoria', category: 'Legal', date: '2023-05-10', expiry: '2024-05-10', status: 'valid', fileData: null, fileType: null },
  { id: 2, title: 'Apólice de Seguro Predial', category: 'Seguros', date: '2023-01-15', expiry: '2024-01-15', status: 'valid', fileData: null, fileType: null },
  { id: 3, title: 'Laudo SPDA (Para-raios)', category: 'Manutenção', date: '2022-10-20', expiry: '2023-10-20', status: 'expired', fileData: null, fileType: null },
  { id: 4, title: 'Planta Hidráulica', category: 'Plantas', date: '2010-01-01', expiry: '', status: 'permanent', fileData: null, fileType: null },
];

const TENANTS = [
  { id: 1, name: 'Residencial Horizonte', cnpj: '12.345.678/0001-90' },
  { id: 2, name: 'Edifício Bela Vista', cnpj: '98.765.432/0001-10' },
];

// Components
const Card = ({ title, children, className = '', action = null }: { title: string, children?: React.ReactNode, className?: string, action?: React.ReactNode }) => (
  <div className={`bg-white p-6 rounded-xl shadow-sm border border-slate-200 ${className}`}>
    <div className="flex justify-between items-center mb-6">
      <h3 className="font-semibold text-slate-800 text-lg">{title}</h3>
      {action}
    </div>
    {children}
  </div>
);

const StatCard = ({ title, value, trend, icon: Icon, trendType }: { title: string, value: string, trend: string, icon: any, trendType: 'up' | 'down' | 'neutral' }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
      </div>
      <div className="p-2 bg-slate-50 rounded-lg text-slate-600 group-hover:bg-slate-100 transition-colors">
        <Icon size={20} />
      </div>
    </div>
    <div className={`text-xs font-medium ${
      trendType === 'up' ? 'text-emerald-600' : 
      trendType === 'down' ? 'text-red-600' : 'text-slate-500'
    } flex items-center gap-1`}>
       {trend}
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    paid: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    overdue: 'bg-red-100 text-red-700 border-red-200',
    late: 'bg-red-100 text-red-700 border-red-200',
    debt: 'bg-red-100 text-red-700 border-red-200',
    occupied: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    vacant: 'bg-slate-100 text-slate-700 border-slate-200',
    completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
    cancelled: 'bg-slate-100 text-slate-500 border-slate-200',
    high: 'bg-red-50 text-red-700 border-red-100',
    medium: 'bg-amber-50 text-amber-700 border-amber-100',
    low: 'bg-blue-50 text-blue-700 border-blue-100',
    active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    inactive: 'bg-slate-100 text-slate-600 border-slate-200',
    valid: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    expired: 'bg-red-100 text-red-700 border-red-200',
    permanent: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    awaiting_defense: 'bg-amber-100 text-amber-700 border-amber-200',
    fined: 'bg-red-100 text-red-700 border-red-200',
    appealing: 'bg-purple-100 text-purple-700 border-purple-200'
  };
  
  const labels: Record<string, string> = {
    paid: 'Pago', pending: 'Pendente', overdue: 'Vencido', late: 'Atrasado',
    debt: 'Inadimplente', occupied: 'Adimplente', vacant: 'Vaga',
    completed: 'Concluído', scheduled: 'Agendado', cancelled: 'Cancelada',
    high: 'Alta', medium: 'Média', low: 'Baixa',
    active: 'Ativo', inactive: 'Inativo',
    valid: 'Vigente', expired: 'Vencido', permanent: 'Permanente',
    awaiting_defense: 'Aguardando Defesa', fined: 'Multado', appealing: 'Em Recurso'
  };

  const label = labels[status] || status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
      {label}
    </span>
  );
};

const Modal = ({ title, onClose, children }: { title: string, onClose: () => void, children?: React.ReactNode }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
      <div className="flex items-center justify-between p-5 border-b border-slate-100">
        <h3 className="font-semibold text-slate-800 text-lg">{title}</h3>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <X size={20} className="text-slate-500" />
        </button>
      </div>
      <div className="p-6 overflow-y-auto max-h-[80vh]">
        {children}
      </div>
    </div>
  </div>
);

// --- VIEWS ---

const DashboardView = ({ 
  onNavigate, 
  data 
}: { 
  onNavigate: (view: ViewState) => void,
  data: {
    finance: typeof MOCK_FINANCE,
    units: typeof MOCK_UNITS,
    maintenance: typeof MOCK_MAINTENANCE
  }
}) => {
  const [selectedMaintenance, setSelectedMaintenance] = useState<any>(null);

  const financialData = useMemo(() => {
    const income = data.finance.filter(t => t.type === 'income' && t.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0);
    const expense = data.finance.filter(t => t.type === 'expense' && t.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0);
    const currentBalance = income - expense;

    const pendingIncome = data.finance.filter(t => t.type === 'income' && (t.status === 'pending' || t.status === 'overdue')).reduce((acc, curr) => acc + curr.amount, 0);
    const pendingExpense = data.finance.filter(t => t.type === 'expense' && (t.status === 'pending' || t.status === 'overdue')).reduce((acc, curr) => acc + curr.amount, 0);
    
    const projectedBalance = currentBalance + pendingIncome - pendingExpense;

    return { 
      balance: currentBalance, 
      projected: projectedBalance,
      pendingIncome,
      pendingExpense 
    };
  }, [data.finance]);

  const delinquencyStats = useMemo(() => {
      const totalUnits = data.units.length;
      const debtUnits = data.units.filter(u => u.status === 'debt').length;
      const rate = totalUnits > 0 ? ((debtUnits / totalUnits) * 100).toFixed(1) : "0";
      return { count: debtUnits, rate };
  }, [data.units]);

  const maintenanceStats = useMemo(() => {
      const total = data.maintenance.length;
      const pending = data.maintenance.filter(m => m.status === 'pending' || m.status === 'late').length;
      return { total, pending };
  }, [data.maintenance]);

  const occupancyStats = useMemo(() => {
    const total = data.units.length;
    const occupied = data.units.filter(u => u.status !== 'vacant').length;
    const rate = total > 0 ? ((occupied/total)*100).toFixed(0) : "0";
    return { rate };
  }, [data.units]);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <StatCard 
            title="Saldo em Caixa" 
            value={`R$ ${financialData.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
            trend="Atualizado hoje" 
            icon={DollarSign} 
            trendType="neutral" 
        />
         <StatCard 
            title="Saldo Projetado" 
            value={`R$ ${financialData.projected.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
            trend={`A Pagar: -${financialData.pendingExpense.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`}
            icon={PieChart} 
            trendType={financialData.projected >= financialData.balance ? "up" : "down"} 
        />
        <StatCard 
            title="Inadimplência" 
            value={`${delinquencyStats.count} Unidades`} 
            trend={`${delinquencyStats.rate}% do total`} 
            icon={AlertTriangle} 
            trendType={delinquencyStats.count > 0 ? "down" : "up"} 
        />
        <StatCard 
            title="Manutenção" 
            value={maintenanceStats.pending.toString()} 
            trend="Ordens pendentes" 
            icon={Wrench} 
            trendType={maintenanceStats.pending > 2 ? "down" : "up"} 
        />
        <StatCard 
            title="Ocupação" 
            value={`${occupancyStats.rate}%`} 
            trend="Unidades ocupadas" 
            icon={Building2} 
            trendType="up" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Próximas Manutenções" className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-slate-500 font-medium border-b border-slate-100">
                <tr>
                  <th className="pb-3 pl-2 font-medium">Item</th>
                  <th className="pb-3 font-medium">Data</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.maintenance.slice(0, 5).map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 pl-2 font-medium text-slate-700">{m.item}</td>
                    <td className="py-3 text-slate-500">{new Date(m.date).toLocaleDateString('pt-BR')}</td>
                    <td className="py-3"><StatusBadge status={m.status} /></td>
                    <td className="py-3 text-right">
                      <button 
                        onClick={() => setSelectedMaintenance(m)}
                        className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-indigo-50 transition-colors"
                      >
                        Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Fluxo Recente">
           <div className="space-y-4">
            {data.finance.slice(0, 4).map((f) => (
              <div key={f.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${f.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    {f.type === 'income' ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16} />}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 text-sm truncate max-w-[120px]">{f.desc}</p>
                    <p className="text-xs text-slate-500">{f.category}</p>
                  </div>
                </div>
                <span className={`font-bold text-sm ${f.type === 'income' ? 'text-emerald-600' : 'text-slate-700'}`}>
                  {f.type === 'income' ? '+' : '-'} R$ {f.amount.toFixed(2)}
                </span>
              </div>
            ))}
            <button 
              onClick={() => onNavigate('finance')}
              className="w-full py-2.5 text-center text-sm text-indigo-600 hover:bg-indigo-50 hover:text-indigo-800 rounded-lg transition-colors font-medium border border-transparent hover:border-indigo-100 mt-2"
            >
              Ver Extrato Completo
            </button>
          </div>
        </Card>
      </div>

      {selectedMaintenance && (
        <Modal title="Detalhes da Manutenção" onClose={() => setSelectedMaintenance(null)}>
          <div className="space-y-6">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
               <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Item / Ativo</label>
               <p className="text-slate-800 font-semibold text-lg">{selectedMaintenance.item}</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Tipo</label>
                <p className="text-slate-700 font-medium">{selectedMaintenance.type}</p>
              </div>
               <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Prioridade</label>
                <div className="flex"><StatusBadge status={selectedMaintenance.priority} /></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Data Programada</label>
                <p className="text-slate-700 font-medium flex items-center gap-2">
                   <Calendar size={14} className="text-slate-400"/>
                   {new Date(selectedMaintenance.date).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Status</label>
                <div className="flex"><StatusBadge status={selectedMaintenance.status} /></div>
              </div>
            </div>
             <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Responsável</label>
              <p className="text-slate-700 font-medium flex items-center gap-2">
                 <Truck size={14} className="text-slate-400"/>
                 {selectedMaintenance.assignee}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

const UnitsView = ({ 
  data, 
  onUpdate 
}: { 
  data: typeof MOCK_UNITS, 
  onUpdate: (data: typeof MOCK_UNITS) => void 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({ unit: '', block: '', owner: '', type: 'owner', status: 'occupied' });

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData({ unit: item.unit, block: item.block, owner: item.owner, type: item.type || 'owner', status: item.status });
    } else {
      setEditingItem(null);
      setFormData({ unit: '', block: '', owner: '', type: 'owner', status: 'occupied' });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingItem) {
      onUpdate(data.map(u => u.id === editingItem.id ? { ...u, ...formData } : u));
    } else {
      onUpdate([...data, { id: Date.now(), ...formData }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Unidades</h2>
        <button onClick={() => handleOpenModal()} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors shadow-sm">
          <Plus size={18} /> Nova Unidade
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-slate-500 font-medium border-b border-slate-100 bg-slate-50/50">
            <tr>
              <th className="p-4 pl-6 font-medium">Unidade</th>
              <th className="p-4 font-medium">Responsável</th>
              <th className="p-4 font-medium">Ocupação</th>
              <th className="p-4 font-medium">Situação Financeira</th>
              <th className="p-4 font-medium text-right pr-6">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 pl-6 font-medium text-slate-800">{u.unit} {u.block && `- Bloco ${u.block}`}</td>
                <td className="p-4 text-slate-600">{u.owner || '-'}</td>
                <td className="p-4 text-slate-600">
                  {u.type === 'owner' ? 'Proprietário' : u.type === 'tenant' ? 'Inquilino' : 'Vazia'}
                </td>
                <td className="p-4"><StatusBadge status={u.status} /></td>
                <td className="p-4 text-right pr-6">
                  <button onClick={() => handleOpenModal(u)} className="text-indigo-600 hover:text-indigo-800 font-medium">Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal title={editingItem ? "Editar Unidade" : "Nova Unidade"} onClose={() => setIsModalOpen(false)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Unidade</label>
                <input 
                  type="text" 
                  value={formData.unit} 
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                  placeholder="Ex: 101"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bloco</label>
                <input 
                  type="text" 
                  value={formData.block} 
                  onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                  placeholder="Ex: A"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Responsável</label>
              <input 
                type="text" 
                value={formData.owner} 
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                placeholder="Nome completo"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Ocupação</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="owner">Proprietário</option>
                  <option value="tenant">Inquilino</option>
                  <option value="vacant">Unidade Vazia</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Situação Financeira</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="occupied">Adimplente</option>
                  <option value="debt">Inadimplente</option>
                </select>
              </div>
            </div>
            <div className="pt-4 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">Salvar</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

const FinanceView = ({ 
  data, 
  onUpdate 
}: { 
  data: typeof MOCK_FINANCE, 
  onUpdate: (data: typeof MOCK_FINANCE) => void 
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'payable' | 'receivable'>('all');
  const [showReportModal, setShowReportModal] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState<number | null>(null);
  const [newEntry, setNewEntry] = useState({ desc: '', amount: '', type: 'expense', category: 'Outros', date: new Date().toISOString().split('T')[0] });
  const [reportFormat, setReportFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  
  const financeStats = useMemo(() => {
    const income = data.filter(t => t.type === 'income' && t.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0);
    const expense = data.filter(t => t.type === 'expense' && t.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0);
    const balance = income - expense;

    const receivable = data.filter(t => t.type === 'income' && (t.status === 'pending' || t.status === 'overdue')).reduce((acc, curr) => acc + curr.amount, 0);
    const payable = data.filter(t => t.type === 'expense' && (t.status === 'pending' || t.status === 'overdue')).reduce((acc, curr) => acc + curr.amount, 0);
    
    const forecast = balance + receivable - payable;

    return { balance, receivable, payable, forecast };
  }, [data]);

  const filteredData = useMemo(() => {
    if (activeTab === 'payable') return data.filter(i => i.type === 'expense');
    if (activeTab === 'receivable') return data.filter(i => i.type === 'income');
    return data;
  }, [activeTab, data]);

  const handleSaveEntry = () => {
    const amount = parseFloat(newEntry.amount);
    if (!newEntry.desc || isNaN(amount)) return;

    onUpdate([{
      id: Date.now(),
      desc: newEntry.desc,
      amount: amount,
      type: newEntry.type,
      category: newEntry.category,
      status: 'pending',
      date: newEntry.date || new Date().toISOString()
    }, ...data]);
    
    setIsFormOpen(false);
    setNewEntry({ desc: '', amount: '', type: 'expense', category: 'Outros', date: new Date().toISOString().split('T')[0] });
  }

  const handleStatusChange = (id: number, newStatus: string) => {
    onUpdate(data.map(f => f.id === id ? { ...f, status: newStatus } : f));
    setOpenActionMenuId(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Financeiro</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowReportModal(true)}
            className="text-slate-600 hover:text-slate-800 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 font-medium flex items-center gap-2"
          >
            <FileText size={18} /> Relatórios
          </button>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 shadow-sm"
          >
            <Plus size={18} /> Novo Lançamento
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden">
          <div className="flex justify-between items-start z-10">
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Saldo em Caixa</p>
              <h3 className={`text-2xl font-bold ${financeStats.balance >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                R$ {financeStats.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
              <Wallet size={20} />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-300"></div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden">
          <div className="flex justify-between items-start z-10">
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">A Receber (Previsão)</p>
              <h3 className="text-2xl font-bold text-slate-800">
                R$ {financeStats.receivable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
            </div>
             <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-200"></div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden">
          <div className="flex justify-between items-start z-10">
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">A Pagar (Previsão)</p>
              <h3 className="text-2xl font-bold text-slate-800">
                R$ {financeStats.payable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-2 bg-red-50 rounded-lg text-red-600">
              <TrendingDown size={20} />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-red-200"></div>
        </div>

        <div className="bg-indigo-900 p-5 rounded-xl border border-indigo-800 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden">
          <div className="flex justify-between items-start z-10">
            <div>
              <p className="text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-1">Saldo Previsto Final</p>
              <h3 className="text-2xl font-bold text-white">
                R$ {financeStats.forecast.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-2 bg-indigo-800 rounded-lg text-indigo-200">
              <PieChart size={20} />
            </div>
          </div>
          <p className="text-xs text-indigo-300 z-10 mt-1">Saldo Caixa + Receber - Pagar</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-100 p-4">
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'all' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Extrato Completo
            </button>
            <button 
               onClick={() => setActiveTab('payable')}
               className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'payable' ? 'bg-red-50 text-red-700' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Contas a Pagar
            </button>
            <button 
               onClick={() => setActiveTab('receivable')}
               className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'receivable' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Contas a Receber
            </button>
          </div>
        </div>

        <table className="w-full text-sm text-left">
          <thead className="text-slate-500 font-medium border-b border-slate-100 bg-slate-50/50">
            <tr>
              <th className="p-4 pl-6 font-medium">Descrição</th>
              <th className="p-4 font-medium">Categoria</th>
              <th className="p-4 font-medium">Data</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Valor</th>
              <th className="p-4 font-medium text-right pr-6">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.map((f) => (
              <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 pl-6 font-medium text-slate-800">
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-full ${f.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                      {f.type === 'income' ? <ArrowUpCircle size={14} /> : <ArrowDownCircle size={14} />}
                    </div>
                    {f.desc}
                  </div>
                </td>
                <td className="p-4 text-slate-500">{f.category}</td>
                <td className="p-4 text-slate-500">{new Date(f.date).toLocaleDateString('pt-BR')}</td>
                <td className="p-4"><StatusBadge status={f.status} /></td>
                <td className={`p-4 font-semibold ${f.type === 'income' ? 'text-emerald-600' : 'text-slate-700'}`}>
                  {f.type === 'income' ? '+' : '-'} R$ {f.amount.toFixed(2)}
                </td>
                <td className="p-4 text-right pr-6 relative">
                   <button 
                     onClick={() => setOpenActionMenuId(openActionMenuId === f.id ? null : f.id)}
                     className="p-1.5 hover:bg-slate-200 rounded-md text-slate-500 hover:text-slate-700 transition-colors"
                   >
                     <Settings size={16} />
                   </button>
                   {openActionMenuId === f.id && (
                     <div className="absolute right-8 top-8 z-10 w-36 bg-white rounded-lg shadow-xl border border-slate-100 py-1 animate-in fade-in zoom-in-95 duration-100">
                       <button onClick={() => handleStatusChange(f.id, 'pending')} className="w-full text-left px-4 py-2 text-xs font-medium text-amber-600 hover:bg-amber-50">Marcar Pendente</button>
                       <button onClick={() => handleStatusChange(f.id, 'paid')} className="w-full text-left px-4 py-2 text-xs font-medium text-emerald-600 hover:bg-emerald-50">Marcar Pago</button>
                       <button onClick={() => handleStatusChange(f.id, 'overdue')} className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50">Marcar Vencido</button>
                     </div>
                   )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showReportModal && (
        <Modal title="Exportar Relatórios" onClose={() => setShowReportModal(false)}>
           <div className="space-y-5">
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-2">Período</label>
               <div className="grid grid-cols-2 gap-3">
                 <input type="date" className="p-2 bg-white border border-slate-200 rounded-lg text-sm" />
                 <input type="date" className="p-2 bg-white border border-slate-200 rounded-lg text-sm" />
               </div>
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Relatório</label>
               <select className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm">
                 <option>Fluxo de Caixa Detalhado</option>
                 <option>Inadimplência por Unidade</option>
                 <option>Despesas por Categoria</option>
               </select>
             </div>
             <div className="pt-2">
               <label className="block text-sm font-medium text-slate-700 mb-3">Formato</label>
               <div className="flex gap-3">
                 <button 
                   onClick={() => setReportFormat('pdf')}
                   className={`flex-1 py-3 border rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${reportFormat === 'pdf' ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500' : 'border-slate-200 bg-white hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700'}`}
                 >
                   <FileText size={20} />
                   <span className="text-xs font-medium">PDF</span>
                 </button>
                 <button 
                   onClick={() => setReportFormat('excel')}
                   className={`flex-1 py-3 border rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${reportFormat === 'excel' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500' : 'border-slate-200 bg-white hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700'}`}
                 >
                   <File size={20} />
                   <span className="text-xs font-medium">Excel</span>
                 </button>
                 <button 
                   onClick={() => setReportFormat('csv')}
                   className={`flex-1 py-3 border rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${reportFormat === 'csv' ? 'border-slate-500 bg-slate-50 text-slate-700 ring-1 ring-slate-500' : 'border-slate-200 bg-white hover:border-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
                 >
                   <Download size={20} />
                   <span className="text-xs font-medium">CSV</span>
                 </button>
               </div>
             </div>
             <button 
               onClick={() => setShowReportModal(false)}
               className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 mt-2"
             >
               Gerar Relatório
             </button>
           </div>
        </Modal>
      )}

      {isFormOpen && (
        <Modal title="Novo Lançamento" onClose={() => setIsFormOpen(false)}>
          <div className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
               <input 
                 type="text" 
                 value={newEntry.desc}
                 onChange={e => setNewEntry({...newEntry, desc: e.target.value})}
                 className="w-full p-2 bg-white border border-slate-200 rounded-lg" 
                 placeholder="Ex: Pagamento Jardineiro" 
               />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Valor</label>
                   <input 
                     type="number" 
                     value={newEntry.amount}
                     onChange={e => setNewEntry({...newEntry, amount: e.target.value})}
                     className="w-full p-2 bg-white border border-slate-200 rounded-lg" 
                     placeholder="0,00" 
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
                   <select 
                     value={newEntry.type}
                     onChange={e => setNewEntry({...newEntry, type: e.target.value})}
                     className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                   >
                     <option value="expense">Despesa</option>
                     <option value="income">Receita</option>
                   </select>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
                 <input 
                   type="text" 
                   value={newEntry.category}
                   onChange={e => setNewEntry({...newEntry, category: e.target.value})}
                   className="w-full p-2 bg-white border border-slate-200 rounded-lg" 
                   placeholder="Ex: Manutenção, Aluguel" 
                 />
               </div>
               <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Data de Vencimento</label>
                   <input
                     type="date"
                     value={newEntry.date}
                     onChange={e => setNewEntry({...newEntry, date: e.target.value})}
                     className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                   />
                </div>
             </div>
             <button 
               onClick={handleSaveEntry}
               className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 mt-2"
             >
               Salvar Lançamento
             </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

const MaintenanceView = ({ 
  data, 
  onUpdate 
}: { 
  data: typeof MOCK_MAINTENANCE, 
  onUpdate: (data: typeof MOCK_MAINTENANCE) => void 
}) => {
  const [filter, setFilter] = useState<'all' | 'pending'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [openActionMenuId, setOpenActionMenuId] = useState<number | null>(null);
  const [newItem, setNewItem] = useState({ item: '', date: '', type: 'Preventiva', priority: 'medium', assignee: '', validUntil: '' });

  const filteredData = filter === 'all' ? data : data.filter(m => m.status === 'pending');

  const handleSave = () => {
    if (editingItem) {
      onUpdate(data.map(m => m.id === editingItem.id ? { ...m, ...newItem, status: m.status } : m));
    } else {
      onUpdate([...data, { id: Date.now(), ...newItem, status: 'pending' }]);
    }
    setIsModalOpen(false);
    setNewItem({ item: '', date: '', type: 'Preventiva', priority: 'medium', assignee: '', validUntil: '' });
  };

  const handleAction = (id: number, action: 'edit' | 'complete' | 'cancel' | 'schedule' | 'pending') => {
    if (action === 'edit') {
      const item = data.find(m => m.id === id);
      if (item) {
        setEditingItem(item);
        setNewItem({ 
           item: item.item, 
           date: item.date, 
           type: item.type, 
           priority: item.priority, 
           assignee: item.assignee, 
           validUntil: item.validUntil || '' 
        });
        setIsModalOpen(true);
      }
    } else {
      const statusMap: Record<string, string> = { 
        complete: 'completed', 
        cancel: 'cancelled', 
        schedule: 'scheduled',
        pending: 'pending'
      };
      onUpdate(data.map(m => m.id === id ? { ...m, status: statusMap[action] } : m));
    }
    setOpenActionMenuId(null);
  };

  const handleOpenModal = () => {
    setEditingItem(null);
    setNewItem({ item: '', date: '', type: 'Preventiva', priority: 'medium', assignee: '', validUntil: '' });
    setIsModalOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Plano de Manutenção</h2>
        <button onClick={handleOpenModal} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 shadow-sm">
          <Plus size={18} /> Nova O.S.
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
         <div className="border-b border-slate-100 p-4">
          <div className="flex gap-2">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Todas
            </button>
            <button 
               onClick={() => setFilter('pending')}
               className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'pending' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Pendentes
            </button>
          </div>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="text-slate-500 font-medium border-b border-slate-100 bg-slate-50/50">
            <tr>
              <th className="p-4 pl-6 font-medium">Item</th>
              <th className="p-4 font-medium">Data Programada</th>
              <th className="p-4 font-medium">Tipo</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right pr-6">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 pl-6">
                  <div className="font-medium text-slate-800">{m.item}</div>
                  <div className="text-xs text-slate-500">{m.assignee}</div>
                </td>
                <td className="p-4 text-slate-500">{new Date(m.date).toLocaleDateString('pt-BR')}</td>
                <td className="p-4 text-slate-500">{m.type}</td>
                <td className="p-4"><StatusBadge status={m.status} /></td>
                <td className="p-4 text-right pr-6 relative">
                   <button 
                     onClick={() => setOpenActionMenuId(openActionMenuId === m.id ? null : m.id)}
                     className="p-1.5 hover:bg-slate-200 rounded-md text-slate-500 hover:text-slate-700 transition-colors"
                   >
                     <Settings size={16} />
                   </button>
                   {openActionMenuId === m.id && (
                     <div className="absolute right-8 top-8 z-10 w-36 bg-white rounded-lg shadow-xl border border-slate-100 py-1 animate-in fade-in zoom-in-95 duration-100">
                       <button onClick={() => handleAction(m.id, 'edit')} className="w-full text-left px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">Editar</button>
                       <button onClick={() => handleAction(m.id, 'schedule')} className="w-full text-left px-4 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50">Agendar</button>
                       <button onClick={() => handleAction(m.id, 'pending')} className="w-full text-left px-4 py-2 text-xs font-medium text-amber-600 hover:bg-amber-50">Pendente</button>
                       <button onClick={() => handleAction(m.id, 'complete')} className="w-full text-left px-4 py-2 text-xs font-medium text-emerald-600 hover:bg-emerald-50">Concluir</button>
                       <button onClick={() => handleAction(m.id, 'cancel')} className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50">Cancelar</button>
                     </div>
                   )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

       {isModalOpen && (
        <Modal title={editingItem ? "Editar Ordem de Serviço" : "Nova Ordem de Serviço"} onClose={() => setIsModalOpen(false)}>
          <div className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Item / Ativo</label>
               <input 
                 type="text" 
                 value={newItem.item}
                 onChange={e => setNewItem({...newItem, item: e.target.value})}
                 className="w-full p-2 bg-white border border-slate-200 rounded-lg" 
                 placeholder="Ex: Bomba da Piscina" 
               />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Data Execução</label>
                   <input 
                     type="date" 
                     value={newItem.date}
                     onChange={e => setNewItem({...newItem, date: e.target.value})}
                     className="w-full p-2 bg-white border border-slate-200 rounded-lg" 
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
                   <select 
                     value={newItem.type}
                     onChange={e => setNewItem({...newItem, type: e.target.value})}
                     className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                   >
                     <option value="Preventiva">Preventiva</option>
                     <option value="Corretiva">Corretiva</option>
                     <option value="Rotina">Rotina</option>
                   </select>
                </div>
             </div>
             {newItem.type === 'Preventiva' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Validade Legal (Opcional)</label>
                  <input 
                     type="date" 
                     value={newItem.validUntil}
                     onChange={e => setNewItem({...newItem, validUntil: e.target.value})}
                     className="w-full p-2 bg-white border border-slate-200 rounded-lg" 
                   />
                </div>
             )}
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Fornecedor / Responsável</label>
                <select 
                   value={newItem.assignee}
                   onChange={e => setNewItem({...newItem, assignee: e.target.value})}
                   className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                >
                  <option value="">Selecione...</option>
                  {MOCK_SUPPLIERS.map(s => (
                    <option key={s.id} value={s.name}>{s.name} ({s.category})</option>
                  ))}
                  <option value="Zelador">Zelador</option>
                  <option value="Porteiro">Porteiro</option>
                </select>
             </div>
             <button 
               onClick={handleSave}
               className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 mt-2"
             >
               Salvar O.S.
             </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

const SuppliersView = ({ data, onUpdate }: { data: typeof MOCK_SUPPLIERS, onUpdate: (data: typeof MOCK_SUPPLIERS) => void }) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [contractModal, setContractModal] = useState<any>(null);
  const [newItem, setNewItem] = useState({ 
    name: '', category: '', contact: '', service: '', 
    contractStart: '', contractEnd: '', status: 'active' 
  });

  const filteredData = filter === 'all' ? data : data.filter(s => s.status === filter);

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setNewItem({ ...item });
    } else {
      setEditingItem(null);
      setNewItem({ name: '', category: '', contact: '', service: '', contractStart: '', contractEnd: '', status: 'active' });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingItem) {
      onUpdate(data.map(s => s.id === editingItem.id ? { ...s, ...newItem } : s));
    } else {
      onUpdate([...data, { id: Date.now(), ...newItem }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Fornecedores</h2>
        <button onClick={() => handleOpenModal()} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 shadow-sm">
          <Plus size={18} /> Novo Fornecedor
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
         <div className="border-b border-slate-100 p-4">
          <div className="flex gap-2">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Todos
            </button>
            <button 
               onClick={() => setFilter('active')}
               className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'active' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Ativos
            </button>
             <button 
               onClick={() => setFilter('inactive')}
               className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'inactive' ? 'bg-slate-100 text-slate-700' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Inativos
            </button>
          </div>
        </div>

        <table className="w-full text-sm text-left">
          <thead className="text-slate-500 font-medium border-b border-slate-100 bg-slate-50/50">
            <tr>
              <th className="p-4 pl-6 font-medium">Nome</th>
              <th className="p-4 font-medium">Categoria</th>
              <th className="p-4 font-medium">Contato</th>
              <th className="p-4 font-medium">Vigência</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right pr-6">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 pl-6 font-medium text-slate-800">
                  <div>{s.name}</div>
                  <div className="text-xs text-slate-500">{s.service}</div>
                </td>
                <td className="p-4 text-slate-500">{s.category}</td>
                <td className="p-4 text-slate-500">{s.contact}</td>
                <td className="p-4 text-slate-500">
                  {s.contractStart ? `${new Date(s.contractStart).toLocaleDateString('pt-BR')} - ${new Date(s.contractEnd).toLocaleDateString('pt-BR')}` : '-'}
                </td>
                <td className="p-4"><StatusBadge status={s.status} /></td>
                <td className="p-4 text-right pr-6 space-x-2">
                  <button onClick={() => setContractModal(s)} className="text-indigo-600 hover:text-indigo-800 font-medium text-xs">Contrato</button>
                  <button onClick={() => handleOpenModal(s)} className="text-slate-600 hover:text-slate-800 font-medium text-xs">Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

       {isModalOpen && (
        <Modal title={editingItem ? "Editar Fornecedor" : "Novo Fornecedor"} onClose={() => setIsModalOpen(false)}>
          <div className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Empresa</label>
               <input 
                 type="text" 
                 value={newItem.name}
                 onChange={e => setNewItem({...newItem, name: e.target.value})}
                 className="w-full p-2 bg-white border border-slate-200 rounded-lg" 
               />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
                   <input 
                     type="text" 
                     value={newItem.category}
                     onChange={e => setNewItem({...newItem, category: e.target.value})}
                     className="w-full p-2 bg-white border border-slate-200 rounded-lg" 
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Serviço Principal</label>
                   <input 
                     type="text" 
                     value={newItem.service}
                     onChange={e => setNewItem({...newItem, service: e.target.value})}
                     className="w-full p-2 bg-white border border-slate-200 rounded-lg" 
                   />
                </div>
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Contato (Tel/Email)</label>
               <input 
                 type="text" 
                 value={newItem.contact}
                 onChange={e => setNewItem({...newItem, contact: e.target.value})}
                 className="w-full p-2 bg-white border border-slate-200 rounded-lg" 
               />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Início Contrato</label>
                   <input 
                     type="date" 
                     value={newItem.contractStart}
                     onChange={e => setNewItem({...newItem, contractStart: e.target.value})}
                     className="w-full p-2 bg-white border border-slate-200 rounded-lg" 
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Fim Contrato</label>
                   <input 
                     type="date" 
                     value={newItem.contractEnd}
                     onChange={e => setNewItem({...newItem, contractEnd: e.target.value})}
                     className="w-full p-2 bg-white border border-slate-200 rounded-lg" 
                   />
                </div>
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select 
                   value={newItem.status}
                   onChange={e => setNewItem({...newItem, status: e.target.value})}
                   className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
             </div>
             <button 
               onClick={handleSave}
               className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 mt-2"
             >
               Salvar
             </button>
          </div>
        </Modal>
      )}

      {contractModal && (
        <Modal title={`Contrato - ${contractModal.name}`} onClose={() => setContractModal(null)}>
           <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <p className="text-sm text-slate-600"><span className="font-semibold">Objeto:</span> Prestação de serviços de {contractModal.service}</p>
                <p className="text-sm text-slate-600 mt-2"><span className="font-semibold">Vigência:</span> {contractModal.contractStart} até {contractModal.contractEnd}</p>
                <p className="text-sm text-slate-600 mt-2"><span className="font-semibold">Contato:</span> {contractModal.contact}</p>
              </div>
              <div className="flex justify-end">
                <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Baixar PDF do Contrato</button>
              </div>
           </div>
        </Modal>
      )}
    </div>
  );
};

const DocumentsView = ({ 
  data, 
  onUpdate 
}: { 
  data: typeof MOCK_DOCUMENTS, 
  onUpdate: (data: typeof MOCK_DOCUMENTS) => void 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDoc, setNewDoc] = useState({ title: '', category: 'Legal', expiry: '', file: null as File | null });
  const [viewingDoc, setViewingDoc] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewDoc({ ...newDoc, file: e.target.files[0] });
    }
  };

  const handleSave = () => {
    if (!newDoc.title || !newDoc.file) return;

    // Convert file to base64 for preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const fileType = newDoc.file?.type;
      
      const newItem = {
        id: Date.now(),
        title: newDoc.title,
        category: newDoc.category,
        date: new Date().toISOString().split('T')[0],
        expiry: newDoc.expiry || '',
        status: 'valid',
        fileData: base64String,
        fileType: fileType
      };

      onUpdate([...data, newItem]);
      setIsModalOpen(false);
      setNewDoc({ title: '', category: 'Legal', expiry: '', file: null });
    };
    reader.readAsDataURL(newDoc.file);
  };

  const handleDelete = (id: number) => {
    onUpdate(data.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Documentos e Alvarás</h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 shadow-sm">
          <UploadCloud size={18} /> Upload Documento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((doc) => (
          <div key={doc.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                <FileText size={24} />
              </div>
              <StatusBadge status={doc.status} />
            </div>
            <h3 className="font-semibold text-slate-800 mb-1">{doc.title}</h3>
            <p className="text-sm text-slate-500 mb-4">{doc.category}</p>
            
            <div className="text-xs text-slate-400 space-y-1 mb-4">
              <p>Emissão: {new Date(doc.date).toLocaleDateString('pt-BR')}</p>
              {doc.expiry && <p>Validade: {new Date(doc.expiry).toLocaleDateString('pt-BR')}</p>}
            </div>

            <div className="flex gap-2 border-t border-slate-100 pt-3">
              <button 
                onClick={() => setViewingDoc(doc)}
                className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 py-1.5 hover:bg-indigo-50 rounded-md transition-colors"
              >
                <Eye size={14} /> Visualizar
              </button>
              <button 
                onClick={() => handleDelete(doc.id)}
                className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-600 hover:text-red-600 py-1.5 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 size={14} /> Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

       {isModalOpen && (
        <Modal title="Upload de Documento" onClose={() => setIsModalOpen(false)}>
           <div className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Título do Documento</label>
               <input 
                 type="text" 
                 value={newDoc.title}
                 onChange={e => setNewDoc({...newDoc, title: e.target.value})}
                 className="w-full p-2 bg-white border border-slate-200 rounded-lg" 
                 placeholder="Ex: Alvará de Funcionamento" 
               />
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
                <select 
                   value={newDoc.category}
                   onChange={e => setNewDoc({...newDoc, category: e.target.value})}
                   className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                >
                  <option value="Legal">Legal</option>
                  <option value="Seguros">Seguros</option>
                  <option value="Manutenção">Manutenção</option>
                  <option value="Plantas">Plantas</option>
                  <option value="Financeiro">Financeiro</option>
                </select>
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Validade (Opcional)</label>
                <input 
                   type="date" 
                   value={newDoc.expiry}
                   onChange={e => setNewDoc({...newDoc, expiry: e.target.value})}
                   className="w-full p-2 bg-white border border-slate-200 rounded-lg" 
                 />
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Arquivo</label>
                <input 
                  type="file" 
                  onChange={handleFileChange}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
             </div>
             <button 
               onClick={handleSave}
               disabled={!newDoc.file || !newDoc.title}
               className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               Salvar Documento
             </button>
           </div>
        </Modal>
      )}

      {viewingDoc && (
        <Modal title={viewingDoc.title} onClose={() => setViewingDoc(null)}>
           <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg min-h-[300px]">
              {viewingDoc.fileData ? (
                 viewingDoc.fileType?.startsWith('image/') ? (
                    <img src={viewingDoc.fileData} alt={viewingDoc.title} className="max-w-full max-h-[500px] object-contain rounded-lg shadow-sm" />
                 ) : (
                    <iframe src={viewingDoc.fileData} className="w-full h-[500px] border-0 rounded-lg" title={viewingDoc.title}></iframe>
                 )
              ) : (
                 <div className="text-center">
                    <FileText size={48} className="text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500 font-medium">Pré-visualização simulada do arquivo</p>
                    <p className="text-xs text-slate-400 mt-1">Nenhum arquivo real carregado neste mock.</p>
                 </div>
              )}
           </div>
        </Modal>
      )}
    </div>
  );
};

const InfractionsView = ({ 
  data, 
  onUpdate,
  regimentRules,
  onUpdateRegiment
}: { 
  data: typeof MOCK_INFRACTIONS, 
  onUpdate: (data: typeof MOCK_INFRACTIONS) => void,
  regimentRules: typeof MOCK_REGIMENT_RULES,
  onUpdateRegiment: (data: typeof MOCK_REGIMENT_RULES) => void
}) => {
  const [activeTab, setActiveTab] = useState<'occurrences' | 'rules'>('occurrences');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInfraction, setSelectedInfraction] = useState<any>(null);
  const [newInfraction, setNewInfraction] = useState({ unit: '', ruleId: '', date: '', description: '', amount: 0, recurrence: 1 });
  const [manualRecurrence, setManualRecurrence] = useState(false);
  
  // Rule State
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [newRule, setNewRule] = useState({ article: '', description: '', severity: 'Leve', defaultAmount: 0 });

  const getRecurrenceCount = (unit: string, type: string) => {
    if (!unit || !type) return 1;
    // Count previous infractions of same type for this unit
    const count = data.filter(i => i.unit === unit && i.type === type).length;
    return count + 1; // Current one is next
  };

  const handleUnitOrTypeChange = (unit: string, ruleId: string) => {
    const rule = regimentRules.find(r => r.id.toString() === ruleId);
    const type = rule ? rule.description : '';
    
    // Update state
    const currentUnit = unit || newInfraction.unit;
    const currentRuleId = ruleId || newInfraction.ruleId;
    
    let recurrence = 1;
    let description = newInfraction.description;
    let amount = newInfraction.amount;

    if (rule) {
        description = rule.description;
        amount = rule.defaultAmount;
    }

    if (currentUnit && rule) {
       recurrence = getRecurrenceCount(currentUnit, rule.description);
    }
    
    setNewInfraction({ 
        ...newInfraction, 
        unit: currentUnit, 
        ruleId: currentRuleId, 
        description, 
        amount, 
        recurrence: manualRecurrence ? newInfraction.recurrence : recurrence 
    });
  };

  const handleSaveInfraction = () => {
    onUpdate([...data, {
      id: Date.now(),
      unit: newInfraction.unit,
      type: newInfraction.description,
      date: newInfraction.date,
      amount: newInfraction.amount,
      status: 'awaiting_defense',
      recurrence: newInfraction.recurrence
    }]);
    setIsModalOpen(false);
    setNewInfraction({ unit: '', ruleId: '', date: '', description: '', amount: 0, recurrence: 1 });
    setManualRecurrence(false);
  };

  const handleSaveRule = () => {
    onUpdateRegiment([...regimentRules, {
      id: Date.now(),
      ...newRule
    }]);
    setIsRuleModalOpen(false);
    setNewRule({ article: '', description: '', severity: 'Leve', defaultAmount: 0 });
  };

  const handleDeleteRule = (id: number) => {
     onUpdateRegiment(regimentRules.filter(r => r.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Infrações e Regulação</h2>
        {activeTab === 'occurrences' ? (
           <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 shadow-sm">
             <Plus size={18} /> Registrar Infração
           </button>
        ) : (
           <button onClick={() => setIsRuleModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 shadow-sm">
             <Plus size={18} /> Nova Regra
           </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-100 p-4">
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('occurrences')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'occurrences' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Ocorrências
            </button>
            <button 
               onClick={() => setActiveTab('rules')}
               className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'rules' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Regimento Interno
            </button>
          </div>
        </div>
        
        {activeTab === 'occurrences' ? (
          <table className="w-full text-sm text-left">
            <thead className="text-slate-500 font-medium border-b border-slate-100 bg-slate-50/50">
              <tr>
                <th className="p-4 pl-6 font-medium">Unidade</th>
                <th className="p-4 font-medium">Tipo de Infração</th>
                <th className="p-4 font-medium">Data</th>
                <th className="p-4 font-medium">Reincidência</th>
                <th className="p-4 font-medium">Valor Multa</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right pr-6">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((i) => (
                <tr key={i.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 pl-6 font-medium text-slate-800">Unit {i.unit}</td>
                  <td className="p-4 text-slate-600">{i.type}</td>
                  <td className="p-4 text-slate-500">{new Date(i.date).toLocaleDateString('pt-BR')}</td>
                  <td className="p-4">
                     <span className={`px-2 py-0.5 rounded text-xs font-semibold ${i.recurrence > 1 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                        {i.recurrence}ª vez
                     </span>
                  </td>
                  <td className="p-4 font-medium text-slate-700">R$ {i.amount.toFixed(2)}</td>
                  <td className="p-4"><StatusBadge status={i.status} /></td>
                  <td className="p-4 text-right pr-6">
                    <button 
                      onClick={() => setSelectedInfraction(i)} 
                      className="text-indigo-600 hover:text-indigo-800 font-medium text-xs px-3 py-1.5 rounded-md hover:bg-indigo-50"
                    >
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-sm text-left">
             <thead className="text-slate-500 font-medium border-b border-slate-100 bg-slate-50/50">
              <tr>
                <th className="p-4 pl-6 font-medium">Artigo</th>
                <th className="p-4 font-medium">Descrição</th>
                <th className="p-4 font-medium">Gravidade</th>
                <th className="p-4 font-medium">Valor Padrão</th>
                <th className="p-4 font-medium text-right pr-6">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {regimentRules.map((rule) => (
                 <tr key={rule.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 pl-6 font-medium text-slate-800">{rule.article}</td>
                    <td className="p-4 text-slate-600">{rule.description}</td>
                    <td className="p-4"><StatusBadge status={rule.severity === 'Grave' ? 'high' : rule.severity === 'Média' ? 'medium' : 'low'} /></td>
                    <td className="p-4 text-slate-700">R$ {rule.defaultAmount.toFixed(2)}</td>
                    <td className="p-4 text-right pr-6">
                       <button onClick={() => handleDeleteRule(rule.id)} className="text-red-600 hover:text-red-800 font-medium">Excluir</button>
                    </td>
                 </tr>
               ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedInfraction && (
        <Modal title="Detalhes da Infração" onClose={() => setSelectedInfraction(null)}>
          <div className="space-y-4">
             <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
               <div className="flex justify-between items-center mb-2">
                 <span className="text-sm font-semibold text-slate-500">Unidade</span>
                 <span className="text-lg font-bold text-slate-800">{selectedInfraction.unit}</span>
               </div>
               <div className="flex justify-between items-center mb-2">
                 <span className="text-sm font-semibold text-slate-500">Tipo</span>
                 <span className="text-sm font-medium text-slate-700">{selectedInfraction.type}</span>
               </div>
               <div className="flex justify-between items-center mb-2">
                 <span className="text-sm font-semibold text-slate-500">Data</span>
                 <span className="text-sm font-medium text-slate-700">{new Date(selectedInfraction.date).toLocaleDateString('pt-BR')}</span>
               </div>
               <div className="flex justify-between items-center mb-2">
                 <span className="text-sm font-semibold text-slate-500">Reincidência</span>
                 <span className="text-sm font-bold text-red-600">{selectedInfraction.recurrence}ª Ocorrência</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-sm font-semibold text-slate-500">Valor Multa</span>
                 <span className="text-lg font-bold text-slate-800">R$ {selectedInfraction.amount.toFixed(2)}</span>
               </div>
             </div>
             <div>
                <h4 className="font-semibold text-slate-800 mb-2">Status do Processo</h4>
                <div className="flex items-center gap-2">
                   <StatusBadge status={selectedInfraction.status} />
                   <span className="text-sm text-slate-500">
                      {selectedInfraction.status === 'awaiting_defense' ? '- Aguardando defesa do morador (Prazo: 5 dias)' : ''}
                   </span>
                </div>
             </div>
          </div>
        </Modal>
      )}

      {isModalOpen && (
        <Modal title="Registrar Infração" onClose={() => setIsModalOpen(false)}>
           <div className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Unidade</label>
                   <input 
                     type="text" 
                     value={newInfraction.unit}
                     onChange={e => handleUnitOrTypeChange(e.target.value, newInfraction.ruleId)}
                     className="w-full p-2 bg-white border border-slate-200 rounded-lg" 
                     placeholder="Ex: 102"
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Data</label>
                   <input 
                     type="date" 
                     value={newInfraction.date}
                     onChange={e => setNewInfraction({...newInfraction, date: e.target.value})}
                     className="w-full p-2 bg-white border border-slate-200 rounded-lg" 
                   />
                </div>
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Infração (Regimento)</label>
                <select 
                   value={newInfraction.ruleId}
                   onChange={e => handleUnitOrTypeChange(newInfraction.unit, e.target.value)}
                   className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                >
                   <option value="">Selecione...</option>
                   {regimentRules.map(r => (
                      <option key={r.id} value={r.id}>{r.article} - {r.description}</option>
                   ))}
                </select>
             </div>
             
             {newInfraction.unit && newInfraction.description && (
                <div className={`p-3 rounded-lg border flex items-start gap-3 ${newInfraction.recurrence > 1 ? 'bg-red-50 border-red-100 text-red-700' : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
                   <AlertCircle size={20} className="shrink-0 mt-0.5" />
                   <div>
                      <p className="font-semibold text-sm">
                         {newInfraction.recurrence > 1 ? 'Reincidência Detectada!' : 'Primeira Ocorrência'}
                      </p>
                      <p className="text-xs mt-1">
                         Esta é a {newInfraction.recurrence}ª vez que esta unidade comete esta infração.
                      </p>
                   </div>
                </div>
             )}

             <div className="flex items-center gap-2 py-2">
                <input 
                   type="checkbox" 
                   id="manualRecurrence"
                   checked={manualRecurrence}
                   onChange={(e) => {
                      setManualRecurrence(e.target.checked);
                      if (e.target.checked) {
                         // If checked, allow manual edit (or increment) - for simplicity, just increment visual
                         setNewInfraction({...newInfraction, recurrence: newInfraction.recurrence + 1});
                      } else {
                         // Reset to calc
                         handleUnitOrTypeChange(newInfraction.unit, newInfraction.ruleId);
                      }
                   }}
                   className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="manualRecurrence" className="text-sm text-slate-600">Marcar como Reincidente Manualmente (Forçar +1)</label>
             </div>

             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Valor da Multa</label>
                <input 
                  type="number" 
                  value={newInfraction.amount}
                  onChange={e => setNewInfraction({...newInfraction, amount: parseFloat(e.target.value)})}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg" 
                />
             </div>
             <button 
               onClick={handleSaveInfraction}
               className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 mt-2"
             >
               Registrar
             </button>
           </div>
        </Modal>
      )}

      {isRuleModalOpen && (
         <Modal title="Nova Regra" onClose={() => setIsRuleModalOpen(false)}>
            <div className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Artigo</label>
                  <input 
                     type="text" 
                     value={newRule.article}
                     onChange={e => setNewRule({...newRule, article: e.target.value})}
                     className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                     placeholder="Ex: Art. 10"
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                  <input 
                     type="text" 
                     value={newRule.description}
                     onChange={e => setNewRule({...newRule, description: e.target.value})}
                     className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                     placeholder="Ex: Proibido animais na piscina"
                  />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Gravidade</label>
                     <select 
                        value={newRule.severity}
                        onChange={e => setNewRule({...newRule, severity: e.target.value})}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                     >
                        <option>Leve</option>
                        <option>Média</option>
                        <option>Grave</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Valor Padrão</label>
                     <input 
                        type="number" 
                        value={newRule.defaultAmount}
                        onChange={e => setNewRule({...newRule, defaultAmount: parseFloat(e.target.value)})}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                     />
                  </div>
               </div>
               <button 
                  onClick={handleSaveRule}
                  className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 mt-2"
               >
                  Salvar Regra
               </button>
            </div>
         </Modal>
      )}
    </div>
  );
};

const SettingsView = ({
  usersData,
  onUpdateUsers,
  tenantData,
  onUpdateTenant
}: {
  usersData: typeof MOCK_SYSTEM_USERS,
  onUpdateUsers: (data: typeof MOCK_SYSTEM_USERS) => void,
  tenantData: typeof TENANTS,
  onUpdateTenant: (data: typeof TENANTS) => void
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'users' | 'notifications'>('general');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'Porteiro', password: '' });
  
  // Tenant State (simulated)
  const [tenantForm, setTenantForm] = useState({ ...tenantData[0] });

  const handleOpenUserModal = (user?: any) => {
    if (user) {
      setEditingUser(user);
      setUserForm({ name: user.name, email: user.email, role: user.role, password: '' });
    } else {
      setEditingUser(null);
      setUserForm({ name: '', email: '', role: 'Porteiro', password: '' });
    }
    setIsUserModalOpen(true);
  };

  const handleSaveUser = () => {
    if (editingUser) {
      onUpdateUsers(usersData.map(u => u.id === editingUser.id ? { ...u, ...userForm, status: u.status } : u));
    } else {
      onUpdateUsers([...usersData, { id: Date.now(), ...userForm, status: 'active' }]);
    }
    setIsUserModalOpen(false);
  };

  const handleToggleStatus = (id: number) => {
    onUpdateUsers(usersData.map(u => 
      u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
    ));
  };

  const handleSaveTenant = () => {
     onUpdateTenant(tenantData.map(t => t.id === tenantForm.id ? tenantForm : t));
     alert('Dados do condomínio atualizados com sucesso!');
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Configurações</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="flex border-b border-slate-100 p-4 gap-2 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'general' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Dados do Condomínio
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'users' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Usuários e Permissões
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'notifications' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Notificações
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-slate-800">Usuários do Sistema</h3>
                <button onClick={() => handleOpenUserModal()} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 shadow-sm text-sm">
                  <Plus size={16} /> Novo Usuário
                </button>
              </div>
              <table className="w-full text-sm text-left">
                <thead className="text-slate-500 font-medium border-b border-slate-100 bg-slate-50/50">
                  <tr>
                    <th className="p-3 pl-4">Nome</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Função</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right pr-4">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usersData.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 pl-4 font-medium text-slate-800">{u.name}</td>
                      <td className="p-3 text-slate-600">{u.email}</td>
                      <td className="p-3 text-slate-600">{u.role}</td>
                      <td className="p-3"><StatusBadge status={u.status} /></td>
                      <td className="p-3 text-right pr-4 space-x-2">
                        <button onClick={() => handleOpenUserModal(u)} className="text-indigo-600 hover:text-indigo-800 font-medium text-xs">Editar</button>
                        <button 
                          onClick={() => handleToggleStatus(u.id)} 
                          className={`font-medium text-xs ${u.status === 'active' ? 'text-red-600 hover:text-red-800' : 'text-emerald-600 hover:text-emerald-800'}`}
                        >
                          {u.status === 'active' ? 'Desativar' : 'Ativar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'general' && (
             <div className="max-w-2xl space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Razão Social</label>
                      <input 
                         type="text" 
                         value={tenantForm.name} 
                         onChange={e => setTenantForm({...tenantForm, name: e.target.value})}
                         className="w-full p-2 bg-white border border-slate-200 rounded-lg" 
                       />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">CNPJ</label>
                      <input 
                         type="text" 
                         value={tenantForm.cnpj} 
                         onChange={e => setTenantForm({...tenantForm, cnpj: e.target.value})}
                         className="w-full p-2 bg-white border border-slate-200 rounded-lg" 
                       />
                   </div>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Endereço</label>
                   <input type="text" defaultValue="Rua das Flores, 123 - Centro" className="w-full p-2 bg-white border border-slate-200 rounded-lg" />
                </div>
                <button onClick={handleSaveTenant} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">Salvar Alterações</button>
             </div>
          )}

          {activeTab === 'notifications' && (
             <div className="max-w-xl space-y-6">
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                   <div>
                      <h4 className="font-medium text-slate-800">Alertas de Manutenção</h4>
                      <p className="text-xs text-slate-500">Receber emails sobre vencimento de preventivas</p>
                   </div>
                   <input type="checkbox" defaultChecked className="toggle-checkbox text-indigo-600 rounded" />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                   <div>
                      <h4 className="font-medium text-slate-800">Resumo Financeiro Semanal</h4>
                      <p className="text-xs text-slate-500">Receber relatório de fluxo de caixa toda segunda-feira</p>
                   </div>
                   <input type="checkbox" defaultChecked className="toggle-checkbox text-indigo-600 rounded" />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                   <div>
                      <h4 className="font-medium text-slate-800">Novas Infrações</h4>
                      <p className="text-xs text-slate-500">Notificar imediatamente ao registrar ocorrência</p>
                   </div>
                   <input type="checkbox" defaultChecked className="toggle-checkbox text-indigo-600 rounded" />
                </div>
             </div>
          )}
        </div>
      </div>

      {isUserModalOpen && (
        <Modal title={editingUser ? "Editar Usuário" : "Novo Usuário"} onClose={() => setIsUserModalOpen(false)}>
          <div className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
               <input 
                 type="text" 
                 value={userForm.name}
                 onChange={e => setUserForm({...userForm, name: e.target.value})}
                 className="w-full p-2 bg-white border border-slate-200 rounded-lg" 
               />
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
               <input 
                 type="email" 
                 value={userForm.email}
                 onChange={e => setUserForm({...userForm, email: e.target.value})}
                 className="w-full p-2 bg-white border border-slate-200 rounded-lg" 
               />
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Função</label>
               <select 
                 value={userForm.role}
                 onChange={e => setUserForm({...userForm, role: e.target.value})}
                 className="w-full p-2 bg-white border border-slate-200 rounded-lg"
               >
                 <option>Síndico</option>
                 <option>Administradora</option>
                 <option>Porteiro</option>
                 <option>Zelador</option>
               </select>
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Senha {editingUser && '(Deixe em branco para manter)'}</label>
               <input 
                 type="password" 
                 value={userForm.password}
                 onChange={e => setUserForm({...userForm, password: e.target.value})}
                 className="w-full p-2 bg-white border border-slate-200 rounded-lg" 
               />
             </div>
             <button 
               onClick={handleSaveUser}
               className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 mt-2"
             >
               Salvar Usuário
             </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// --- APP COMPONENT ---

const App = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [currentTenantId, setCurrentTenantId] = useState(1);
  const [isTenantDropdownOpen, setIsTenantDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Notification State
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({...n, read: true})));
    setIsNotifOpen(false);
  };

  const currentTenant = TENANTS.find(t => t.id === currentTenantId) || TENANTS[0];

  // CENTRALIZED STATE
  const [financeData, setFinanceData] = useState(MOCK_FINANCE);
  const [unitsData, setUnitsData] = useState(MOCK_UNITS);
  const [maintenanceData, setMaintenanceData] = useState(MOCK_MAINTENANCE);
  const [suppliersData, setSuppliersData] = useState(MOCK_SUPPLIERS);
  const [documentsData, setDocumentsData] = useState(MOCK_DOCUMENTS);
  const [infractionsData, setInfractionsData] = useState(MOCK_INFRACTIONS);
  const [usersData, setUsersData] = useState(MOCK_SYSTEM_USERS);
  const [regimentData, setRegimentData] = useState(MOCK_REGIMENT_RULES);
  const [tenantsData, setTenantsData] = useState(TENANTS);

  const renderView = () => {
    switch(currentView) {
      case 'dashboard': 
        return <DashboardView 
                  onNavigate={setCurrentView} 
                  data={{ finance: financeData, units: unitsData, maintenance: maintenanceData }} 
               />;
      case 'units': 
        return <UnitsView 
                  data={unitsData} 
                  onUpdate={setUnitsData} 
               />;
      case 'finance': 
        return <FinanceView 
                  data={financeData} 
                  onUpdate={setFinanceData} 
               />;
      case 'maintenance': 
        return <MaintenanceView 
                  data={maintenanceData} 
                  onUpdate={setMaintenanceData} 
               />;
      case 'suppliers': 
        return <SuppliersView 
                  data={suppliersData} 
                  onUpdate={setSuppliersData} 
               />;
      case 'documents':
        return <DocumentsView 
                  data={documentsData}
                  onUpdate={setDocumentsData}
               />;
      case 'infractions':
        return <InfractionsView 
                  data={infractionsData}
                  onUpdate={setInfractionsData}
                  regimentRules={regimentData}
                  onUpdateRegiment={setRegimentData}
               />;
      case 'settings':
        return <SettingsView 
                  usersData={usersData} 
                  onUpdateUsers={setUsersData}
                  tenantData={tenantsData}
                  onUpdateTenant={setTenantsData}
               />;
      default: return <div>View not found</div>;
    }
  };

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setIsMobileMenuOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        currentView === view 
          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' 
          : 'text-slate-400 hover:text-white hover:bg-slate-800'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden animate-in fade-in duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-72 bg-slate-900 text-white flex-shrink-0 fixed h-full z-30 transition-transform duration-300 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:static'}`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-indigo-600 p-2.5 rounded-lg shadow-lg shadow-indigo-500/30">
              <Building2 size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight">GestorCondo</h1>
              <p className="text-xs text-slate-400 font-medium">PRO 360</p>
            </div>
          </div>

          <nav className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-200px)]">
            <NavItem view="dashboard" icon={PieChart} label="Visão Geral" />
            <div className="pt-4 pb-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Principal</div>
            <NavItem view="units" icon={User} label="Unidades" />
            <NavItem view="maintenance" icon={Wrench} label="Manutenção" />
            <div className="pt-4 pb-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Administrativo</div>
            <NavItem view="finance" icon={DollarSign} label="Financeiro" />
            <NavItem view="suppliers" icon={Truck} label="Fornecedores" />
            <NavItem view="infractions" icon={AlertTriangle} label="Infrações" />
            <NavItem view="documents" icon={FileText} label="Documentos" />
            <div className="pt-4 pb-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Sistema</div>
            <NavItem view="settings" icon={Settings} label="Configurações" />
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold shadow-lg">
              CS
            </div>
            <div>
              <p className="font-medium text-sm">Carlos Síndico</p>
              <p className="text-xs text-slate-400">Gestor Principal</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen w-full lg:w-auto">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-10 px-4 md:px-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
             <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
             >
                <Menu size={24} />
             </button>
             
             <div className="relative">
                <button 
                    onClick={() => setIsTenantDropdownOpen(!isTenantDropdownOpen)}
                    className="flex items-center gap-2 hover:bg-slate-50 p-2 rounded-lg transition-colors"
                >
                    <div className="text-left">
                    <h2 className="font-bold text-slate-800 leading-tight text-sm md:text-base">{currentTenant.name}</h2>
                    <p className="text-xs text-slate-500 hidden md:block">{currentTenant.cnpj}</p>
                    </div>
                    <ChevronDown size={16} className="text-slate-400" />
                </button>

                {isTenantDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-in fade-in zoom-in-95 duration-100">
                    {tenantsData.map(t => (
                        <button 
                            key={t.id}
                            onClick={() => {
                                setCurrentTenantId(t.id);
                                setIsTenantDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 hover:bg-slate-50 text-sm ${currentTenantId === t.id ? 'font-semibold text-indigo-600 bg-indigo-50' : 'text-slate-700'}`}
                        >
                            {t.name}
                        </button>
                    ))}
                    </div>
                )}
             </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
               <button 
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all relative"
               >
                 <Bell size={20} />
                 {unreadCount > 0 && (
                   <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                 )}
               </button>

               {isNotifOpen && (
                 <div className="absolute top-full right-0 mt-4 w-80 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-4 border-b border-slate-50 flex justify-between items-center">
                       <h3 className="font-semibold text-slate-800">Notificações</h3>
                       {unreadCount > 0 && (
                          <button onClick={markAllAsRead} className="text-xs text-indigo-600 font-medium hover:text-indigo-800">Marcar lidas</button>
                       )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                       {notifications.length === 0 ? (
                          <div className="p-6 text-center text-slate-500 text-sm">Nenhuma notificação nova.</div>
                       ) : (
                          notifications.map(n => (
                             <div key={n.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!n.read ? 'bg-indigo-50/50' : ''}`}>
                                <div className="flex justify-between items-start mb-1">
                                   <p className={`text-sm ${!n.read ? 'font-semibold text-slate-800' : 'font-medium text-slate-700'}`}>{n.title}</p>
                                   <span className="text-[10px] text-slate-400">{n.time}</span>
                                </div>
                                <p className="text-xs text-slate-500">{n.message}</p>
                             </div>
                          ))
                       )}
                    </div>
                 </div>
               )}
            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="p-4 md:p-8 overflow-x-hidden">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}