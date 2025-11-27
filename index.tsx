import React, { useState, useMemo } from 'react';
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
  Download
} from 'lucide-react';

// Types
type ViewState = 'dashboard' | 'units' | 'finance' | 'maintenance' | 'settings' | 'suppliers' | 'documents' | 'infractions';

// Mock Data Initial State
const MOCK_UNITS = [
  { id: 1, unit: '101', block: 'A', owner: 'João Silva', status: 'occupied', type: 'owner' },
  { id: 2, unit: '102', block: 'A', owner: 'Maria Souza', status: 'debt', type: 'tenant' },
  { id: 3, unit: '103', block: 'B', owner: '', status: 'vacant', type: 'vacant' },
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
  { id: 1, unit: '102', type: 'Barulho Excessivo', date: '2023-11-20', amount: 250.00, status: 'awaiting_defense' },
  { id: 2, unit: '106', type: 'Estacionamento Irregular', date: '2023-11-18', amount: 150.00, status: 'fined' },
  { id: 3, unit: '101', type: 'Mudança fora de horário', date: '2023-11-10', amount: 500.00, status: 'appealing' },
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
  { id: 1, title: 'AVCB - Auto de Vistoria', category: 'Legal', date: '2023-05-10', expiry: '2024-05-10', status: 'valid' },
  { id: 2, title: 'Apólice de Seguro Predial', category: 'Seguros', date: '2023-01-15', expiry: '2024-01-15', status: 'valid' },
  { id: 3, title: 'Laudo SPDA (Para-raios)', category: 'Manutenção', date: '2022-10-20', expiry: '2023-10-20', status: 'expired' },
  { id: 4, title: 'Planta Hidráulica', category: 'Plantas', date: '2010-01-01', expiry: '', status: 'permanent' },
];

const TENANTS = [
  { id: 1, name: 'Residencial Horizonte', cnpj: '12.345.678/0001-90' },
  { id: 2, name: 'Edifício Bela Vista', cnpj: '98.765.432/0001-10' },
];

// Components
const Card = ({ title, children, className = '', action = null }: { title: string, children: React.ReactNode, className?: string, action?: React.ReactNode }) => (
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
    occupied: 'bg-blue-100 text-blue-700 border-blue-200',
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

  // Cálculos Dinâmicos baseados nas props recebidas
  const financialData = useMemo(() => {
    const income = data.finance.filter(t => t.type === 'income' && t.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0);
    const expense = data.finance.filter(t => t.type === 'expense' && t.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0);
    return { balance: income - expense };
  }, [data.finance]);

  const delinquencyRate = useMemo(() => {
      const totalUnits = data.units.length;
      const debtUnits = data.units.filter(u => u.status === 'debt').length;
      return totalUnits > 0 ? ((debtUnits / totalUnits) * 100).toFixed(1) : "0";
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
            title="Saldo em Caixa" 
            value={`R$ ${financialData.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
            trend="Atualizado hoje" 
            icon={DollarSign} 
            trendType="neutral" 
        />
        <StatCard 
            title="Inadimplência" 
            value={`${delinquencyRate}%`} 
            trend="Média do mês" 
            icon={AlertTriangle} 
            trendType={Number(delinquencyRate) > 5 ? "down" : "up"} 
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
        <h2 className="text-2xl font-bold text-slate-800">Unidades e Moradores</h2>
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
              <th className="p-4 font-medium">Situação</th>
              <th className="p-4 font-medium text-right pr-6">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 pl-6 font-medium text-slate-800">{u.unit} {u.block && `- Bloco ${u.block}`}</td>
                <td className="p-4 text-slate-600">{u.owner || '-'}</td>
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
                  <option value="vacant">Vaga</option>
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
  
  // New entry state
  const [newEntry, setNewEntry] = useState({ desc: '', amount: '', type: 'expense', category: 'Outros' });
  
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
      date: new Date().toISOString()
    }, ...data]);
    
    setIsFormOpen(false);
    setNewEntry({ desc: '', amount: '', type: 'expense', category: 'Outros' });
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
              <th className="p-4 font-medium text-right pr-6">Valor</th>
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
                <td className={`p-4 text-right pr-6 font-semibold ${f.type === 'income' ? 'text-emerald-600' : 'text-slate-700'}`}>
                  {f.type === 'income' ? '+' : '-'} R$ {f.amount.toFixed(2)}
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
                 <button className="flex-1 py-3 border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl flex flex-col items-center justify-center gap-2 transition-all bg-white">
                   <FileText size={20} />
                   <span className="text-xs font-medium">PDF</span>
                 </button>
                 <button className="flex-1 py-3 border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl flex flex-col items-center justify-center gap-2 transition-all bg-white">
                   <File size={20} />
                   <span className="text-xs font-medium">Excel</span>
                 </button>
                 <button className="flex-1 py-3 border border-slate-200 hover:border-slate-500 hover:bg-slate-50 hover:text-slate-700 rounded-xl flex flex-col items-center justify-center gap-2 transition-all bg-white">
                   <Download size={20} />
                   <span className="text-xs font-medium">CSV</span>
                 </button>
               </div>
             </div>
             <button className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 mt-2">
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
  
  // Menu de ações
  const [openActionMenuId, setOpenActionMenuId] = useState<number | null>(null);

  const filteredItems = filter === 'all' ? data : data.filter(i => i.status === 'pending' || i.status === 'late');

  const handleAction = (id: number, action: 'complete' | 'cancel') => {
    onUpdate(data.map(i => {
      if (i.id === id) {
        return { ...i, status: action === 'complete' ? 'completed' : 'cancelled' };
      }
      return i;
    }));
    setOpenActionMenuId(null);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
    setOpenActionMenuId(null);
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const item = (form.elements.namedItem('item') as HTMLInputElement).value;
    const assignee = (form.elements.namedItem('assignee') as HTMLSelectElement).value;
    const type = (form.elements.namedItem('type') as HTMLSelectElement).value;
    const date = (form.elements.namedItem('date') as HTMLInputElement).value;
    const validUntil = (form.elements.namedItem('validUntil') as HTMLInputElement).value;

    const newItem = {
      id: editingItem ? editingItem.id : Date.now(),
      item,
      assignee,
      type,
      date: date || new Date().toISOString(),
      status: editingItem ? editingItem.status : 'pending',
      priority: editingItem ? editingItem.priority : 'medium',
      validUntil
    };

    if (editingItem) {
      onUpdate(data.map(i => i.id === editingItem.id ? newItem : i));
    } else {
      onUpdate([newItem, ...data]);
    }
    setIsModalOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Plano de Manutenção</h2>
        <button 
          onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 shadow-sm"
        >
          <Plus size={18} /> Nova O.S.
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-100 p-4 flex gap-2">
           <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-md text-sm font-medium ${filter === 'all' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>Todas</button>
           <button onClick={() => setFilter('pending')} className={`px-3 py-1.5 rounded-md text-sm font-medium ${filter === 'pending' ? 'bg-amber-50 text-amber-700' : 'text-slate-500 hover:text-slate-900'}`}>Pendentes</button>
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
            {filteredItems.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 pl-6 font-medium text-slate-800">
                  {m.item}
                  <div className="text-xs text-slate-500 mt-0.5">{m.assignee}</div>
                </td>
                <td className="p-4 text-slate-600">{new Date(m.date).toLocaleDateString('pt-BR')}</td>
                <td className="p-4 text-slate-600">{m.type}</td>
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
                       <button onClick={() => handleEdit(m)} className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">Editar</button>
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
           <form className="space-y-4" onSubmit={handleSave}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Item / Ativo</label>
                <input name="item" defaultValue={editingItem?.item} className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm" placeholder="Ex: Bomba Piscina" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Fornecedor</label>
                   <select name="assignee" defaultValue={editingItem?.assignee} className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm">
                      <option value="">Selecione...</option>
                      {MOCK_SUPPLIERS.map(s => <option key={s.id} value={s.name}>{s.name} - {s.service}</option>)}
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
                   <select name="type" defaultValue={editingItem?.type || 'Preventiva'} className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm">
                     <option value="Preventiva">Preventiva</option>
                     <option value="Corretiva">Corretiva</option>
                   </select>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Data Execução</label>
                   <input name="date" type="date" defaultValue={editingItem?.date?.split('T')[0]} className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Validade Legal</label>
                   <input name="validUntil" type="date" defaultValue={editingItem?.validUntil} className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm" />
                 </div>
              </div>
              <div className="pt-2">
                 <button className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700">Salvar O.S.</button>
              </div>
           </form>
        </Modal>
      )}
    </div>
  );
};

const SuppliersView = ({
  data,
  onUpdate
}: {
  data: typeof MOCK_SUPPLIERS,
  onUpdate: (data: typeof MOCK_SUPPLIERS) => void
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);

  const filtered = filter === 'all' ? data : data.filter(s => s.status === filter);

  const handleEdit = (supplier: any) => {
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  }

  const handleViewContract = (supplier: any) => {
    setSelectedSupplier(supplier);
    setIsContractModalOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Fornecedores</h2>
        <button 
          onClick={() => { setSelectedSupplier(null); setIsModalOpen(true); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 shadow-sm"
        >
          <Plus size={18} /> Novo Fornecedor
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-100 p-4 flex gap-2">
           <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-md text-sm font-medium ${filter === 'all' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>Todos</button>
           <button onClick={() => setFilter('active')} className={`px-3 py-1.5 rounded-md text-sm font-medium ${filter === 'active' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:text-slate-900'}`}>Ativos</button>
           <button onClick={() => setFilter('inactive')} className={`px-3 py-1.5 rounded-md text-sm font-medium ${filter === 'inactive' ? 'bg-slate-100 text-slate-600' : 'text-slate-500 hover:text-slate-900'}`}>Inativos</button>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="text-slate-500 font-medium border-b border-slate-100 bg-slate-50/50">
            <tr>
              <th className="p-4 pl-6 font-medium">Empresa</th>
              <th className="p-4 font-medium">Categoria</th>
              <th className="p-4 font-medium">Contato</th>
              <th className="p-4 font-medium">Vigência</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right pr-6">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 pl-6 font-medium text-slate-800">
                  {s.name}
                  <div className="text-xs text-slate-500 mt-0.5">{s.service}</div>
                </td>
                <td className="p-4 text-slate-600">{s.category}</td>
                <td className="p-4 text-slate-600">{s.contact}</td>
                <td className="p-4 text-slate-600 text-xs">
                  {new Date(s.contractStart).toLocaleDateString('pt-BR')} até {new Date(s.contractEnd).toLocaleDateString('pt-BR')}
                </td>
                <td className="p-4"><StatusBadge status={s.status} /></td>
                <td className="p-4 text-right pr-6 flex justify-end gap-2">
                  <button onClick={() => handleEdit(s)} className="text-indigo-600 hover:text-indigo-800 text-xs font-medium px-2 py-1 rounded hover:bg-indigo-50">Editar</button>
                  <button onClick={() => handleViewContract(s)} className="text-slate-600 hover:text-slate-800 text-xs font-medium px-2 py-1 rounded hover:bg-slate-100">Contrato</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal title={selectedSupplier ? "Editar Fornecedor" : "Novo Fornecedor"} onClose={() => setIsModalOpen(false)}>
           <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome Fantasia</label>
                <input defaultValue={selectedSupplier?.name} className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
                   <input defaultValue={selectedSupplier?.category} className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
                   <input defaultValue={selectedSupplier?.contact} className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm" />
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Início Contrato</label>
                   <input type="date" defaultValue={selectedSupplier?.contractStart} className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Fim Contrato</label>
                   <input type="date" defaultValue={selectedSupplier?.contractEnd} className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm" />
                 </div>
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                 <select defaultValue={selectedSupplier?.status || 'active'} className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm">
                   <option value="active">Ativo</option>
                   <option value="inactive">Inativo</option>
                 </select>
              </div>
              <div className="pt-2">
                 <button className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700">Salvar</button>
              </div>
           </form>
        </Modal>
      )}

      {isContractModalOpen && selectedSupplier && (
        <Modal title={`Contrato - ${selectedSupplier.name}`} onClose={() => setIsContractModalOpen(false)}>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <h4 className="font-semibold text-slate-800 mb-2">Detalhes da Vigência</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500 block">Início</span>
                  <span className="font-medium text-slate-700">{new Date(selectedSupplier.contractStart).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Término</span>
                  <span className="font-medium text-slate-700">{new Date(selectedSupplier.contractEnd).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-2">Objeto do Contrato</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Prestação de serviços de {selectedSupplier.service} e manutenção preventiva mensal, conforme cláusulas padrão...
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1">
                <Download size={16} /> Baixar PDF do Contrato
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

const SettingsView = ({
  users,
  onUpdateUsers
}: {
  users: typeof MOCK_SYSTEM_USERS,
  onUpdateUsers: (users: typeof MOCK_SYSTEM_USERS) => void
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'users' | 'notifications'>('general');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  // Estado local para dados do condomínio
  const [condoData, setCondoData] = useState({
    name: 'Condomínio Edifício Solar',
    cnpj: '12.345.678/0001-90',
    address: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP'
  });

  const handleToggleStatus = (id: number) => {
    onUpdateUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUserModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Configurações</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-100">
           <button 
             onClick={() => setActiveTab('general')}
             className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'general' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
           >
             Dados do Condomínio
           </button>
           <button 
             onClick={() => setActiveTab('users')}
             className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'users' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
           >
             Usuários e Permissões
           </button>
           <button 
             onClick={() => setActiveTab('notifications')}
             className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'notifications' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
           >
             Notificações
           </button>
        </div>

        <div className="p-6">
           {activeTab === 'general' && (
             <form className="max-w-2xl space-y-5 animate-in fade-in duration-300">
                <div className="grid grid-cols-2 gap-5">
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Razão Social</label>
                     <input 
                       className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm" 
                       value={condoData.name}
                       onChange={e => setCondoData({...condoData, name: e.target.value})}
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">CNPJ</label>
                     <input 
                       className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm" 
                       value={condoData.cnpj}
                       onChange={e => setCondoData({...condoData, cnpj: e.target.value})}
                     />
                   </div>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Endereço Completo</label>
                   <input 
                     className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm" 
                     value={condoData.address}
                     onChange={e => setCondoData({...condoData, address: e.target.value})}
                   />
                </div>
                <div className="pt-4">
                  <button type="button" className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 font-medium">Salvar Alterações</button>
                </div>
             </form>
           )}

           {activeTab === 'users' && (
             <div className="space-y-4 animate-in fade-in duration-300">
               <div className="flex justify-end">
                 <button 
                   onClick={() => { setEditingUser(null); setIsUserModalOpen(true); }}
                   className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium"
                 >
                   Adicionar Usuário
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
                   {users.map(u => (
                     <tr key={u.id} className="hover:bg-slate-50">
                       <td className="p-3 pl-4 font-medium text-slate-800">{u.name}</td>
                       <td className="p-3 text-slate-600">{u.email}</td>
                       <td className="p-3 text-slate-600">{u.role}</td>
                       <td className="p-3"><StatusBadge status={u.status} /></td>
                       <td className="p-3 text-right pr-4">
                         <button 
                           onClick={() => { setEditingUser(u); setIsUserModalOpen(true); }}
                           className="text-indigo-600 hover:text-indigo-800 font-medium mr-3"
                         >
                           Editar
                         </button>
                         <button 
                           onClick={() => handleToggleStatus(u.id)}
                           className={`${u.status === 'active' ? 'text-red-600 hover:text-red-800' : 'text-emerald-600 hover:text-emerald-800'} font-medium`}
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

           {activeTab === 'notifications' && (
             <div className="max-w-xl space-y-6 animate-in fade-in duration-300">
               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                 <div>
                   <h4 className="font-medium text-slate-800">Alertas de Manutenção</h4>
                   <p className="text-sm text-slate-500">Receber emails sobre preventivas vencendo.</p>
                 </div>
                 <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full bg-emerald-500 cursor-pointer">
                    <span className="absolute left-6 top-1 bg-white w-4 h-4 rounded-full shadow-sm transition-all"></span>
                 </div>
               </div>
               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                 <div>
                   <h4 className="font-medium text-slate-800">Infrações e Multas</h4>
                   <p className="text-sm text-slate-500">Notificar quando houver defesa ou recurso.</p>
                 </div>
                 <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full bg-emerald-500 cursor-pointer">
                    <span className="absolute left-6 top-1 bg-white w-4 h-4 rounded-full shadow-sm transition-all"></span>
                 </div>
               </div>
               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                 <div>
                   <h4 className="font-medium text-slate-800">Relatório Semanal</h4>
                   <p className="text-sm text-slate-500">Resumo financeiro toda segunda-feira.</p>
                 </div>
                 <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full bg-slate-200 cursor-pointer">
                    <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-sm transition-all"></span>
                 </div>
               </div>
             </div>
           )}
        </div>
      </div>

      {isUserModalOpen && (
        <Modal title={editingUser ? "Editar Usuário" : "Novo Usuário"} onClose={() => setIsUserModalOpen(false)}>
           <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
                <input defaultValue={editingUser?.name} className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input defaultValue={editingUser?.email} type="email" className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Função</label>
                <select defaultValue={editingUser?.role || 'Porteiro'} className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm">
                  <option>Síndico</option>
                  <option>Administradora</option>
                  <option>Porteiro</option>
                  <option>Zelador</option>
                </select>
              </div>
              <div className="pt-2 border-t border-slate-100 mt-2">
                 <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
                 <input type="password" placeholder={editingUser ? "Preencher apenas para alterar" : ""} className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm" />
              </div>
              <button className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 mt-2">Salvar Usuário</button>
           </form>
        </Modal>
      )}
    </div>
  );
};

const DocumentsView = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Documentos e Alvarás</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 shadow-sm">
          <UploadCloud size={18} /> Upload Documento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_DOCUMENTS.map(doc => (
          <div key={doc.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative group">
             <div className="flex justify-between items-start mb-3">
               <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
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

             <div className="flex gap-2 pt-3 border-t border-slate-50">
               <button className="flex-1 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-md flex items-center justify-center gap-1 transition-colors">
                 <Eye size={14} /> Visualizar
               </button>
               <button className="flex-1 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md flex items-center justify-center gap-1 transition-colors">
                 <Trash2 size={14} /> Excluir
               </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const InfractionsView = ({
  data,
  onUpdate
}: {
  data: typeof MOCK_INFRACTIONS,
  onUpdate: (data: typeof MOCK_INFRACTIONS) => void
}) => {
  const [activeTab, setActiveTab] = useState<'occurrences' | 'regiment'>('occurrences');
  const [regimentRules, setRegimentRules] = useState(MOCK_REGIMENT_RULES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInfraction, setSelectedInfraction] = useState<any>(null);
  
  // States for new infraction form
  const [newInfractionUnit, setNewInfractionUnit] = useState('');
  const [selectedRuleId, setSelectedRuleId] = useState('');
  
  const handleOpenNewInfraction = () => {
    setSelectedInfraction(null); 
    setNewInfractionUnit('');
    setSelectedRuleId('');
    setIsModalOpen(true);
  }

  const handleSaveInfraction = (e: React.FormEvent) => {
    e.preventDefault();
    const rule = regimentRules.find(r => r.id.toString() === selectedRuleId);
    if (rule) {
      onUpdate([{
        id: Date.now(),
        unit: newInfractionUnit,
        type: rule.description,
        amount: rule.defaultAmount,
        date: new Date().toISOString(),
        status: 'awaiting_defense'
      }, ...data]);
    }
    setIsModalOpen(false);
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Infrações e Regulação</h2>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-100">
           <button 
             onClick={() => setActiveTab('occurrences')}
             className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'occurrences' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
           >
             Ocorrências e Multas
           </button>
           <button 
             onClick={() => setActiveTab('regiment')}
             className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'regiment' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
           >
             Regimento Interno
           </button>
        </div>

        <div className="p-6">
          {activeTab === 'occurrences' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex justify-end">
                <button 
                   onClick={handleOpenNewInfraction}
                   className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2 shadow-sm text-sm font-medium"
                >
                  <AlertTriangle size={16} /> Registrar Infração
                </button>
              </div>
              <table className="w-full text-sm text-left">
                <thead className="text-slate-500 font-medium border-b border-slate-100 bg-slate-50/50">
                  <tr>
                    <th className="p-3 pl-4">Unidade</th>
                    <th className="p-3">Infração</th>
                    <th className="p-3">Data</th>
                    <th className="p-3">Valor</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right pr-4">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.map(i => (
                    <tr key={i.id} className="hover:bg-slate-50">
                      <td className="p-3 pl-4 font-bold text-slate-800">{i.unit}</td>
                      <td className="p-3 text-slate-700">{i.type}</td>
                      <td className="p-3 text-slate-500">{new Date(i.date).toLocaleDateString('pt-BR')}</td>
                      <td className="p-3 font-medium text-slate-700">R$ {i.amount.toFixed(2)}</td>
                      <td className="p-3"><StatusBadge status={i.status} /></td>
                      <td className="p-3 text-right pr-4">
                        <button 
                          onClick={() => { setSelectedInfraction(i); setIsModalOpen(true); }}
                          className="text-indigo-600 hover:text-indigo-800 font-medium text-xs border border-indigo-100 hover:bg-indigo-50 px-2 py-1 rounded"
                        >
                          Detalhes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'regiment' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-slate-500">Regras cadastradas para autuação automática.</p>
                <button className="text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg text-sm font-medium">
                  + Nova Regra
                </button>
              </div>
              <table className="w-full text-sm text-left">
                <thead className="text-slate-500 font-medium border-b border-slate-100 bg-slate-50/50">
                  <tr>
                    <th className="p-3 pl-4">Artigo</th>
                    <th className="p-3">Descrição</th>
                    <th className="p-3">Gravidade</th>
                    <th className="p-3">Valor Padrão</th>
                    <th className="p-3 text-right pr-4">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {regimentRules.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="p-3 pl-4 font-medium text-slate-800">{r.article}</td>
                      <td className="p-3 text-slate-700">{r.description}</td>
                      <td className="p-3"><StatusBadge status={r.severity === 'Grave' ? 'high' : r.severity === 'Média' ? 'medium' : 'low'} /></td>
                      <td className="p-3 font-medium text-slate-700">R$ {r.defaultAmount.toFixed(2)}</td>
                      <td className="p-3 text-right pr-4">
                         <button className="text-slate-400 hover:text-indigo-600"><Settings size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <Modal title={selectedInfraction ? "Detalhes da Infração" : "Registrar Nova Infração"} onClose={() => setIsModalOpen(false)}>
           {selectedInfraction ? (
             <div className="space-y-5">
               <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                 <span className="text-red-800 font-bold text-lg">Unidade {selectedInfraction.unit}</span>
                 <StatusBadge status={selectedInfraction.status} />
               </div>
               <div>
                 <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Motivo / Tipo</label>
                 <p className="text-slate-800 font-medium">{selectedInfraction.type}</p>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Data Ocorrência</label>
                   <p className="text-slate-700">{new Date(selectedInfraction.date).toLocaleDateString('pt-BR')}</p>
                 </div>
                 <div>
                   <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Valor Multa</label>
                   <p className="text-slate-700 font-bold">R$ {selectedInfraction.amount.toFixed(2)}</p>
                 </div>
               </div>
               <div className="pt-4 border-t border-slate-100">
                 <h4 className="font-semibold text-slate-800 mb-2">Histórico</h4>
                 <div className="space-y-3">
                   <div className="flex gap-3 text-sm">
                      <div className="min-w-[80px] text-slate-400 text-xs mt-0.5">{new Date(selectedInfraction.date).toLocaleDateString('pt-BR')}</div>
                      <div className="text-slate-600">Infração registrada pelo porteiro.</div>
                   </div>
                   {selectedInfraction.status === 'awaiting_defense' && (
                     <div className="flex gap-3 text-sm">
                        <div className="min-w-[80px] text-slate-400 text-xs mt-0.5">Hoje</div>
                        <div className="text-amber-600 font-medium">Aguardando defesa do morador (prazo: 5 dias).</div>
                     </div>
                   )}
                 </div>
               </div>
             </div>
           ) : (
             <form onSubmit={handleSaveInfraction} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Unidade Infratora</label>
                  <input 
                    value={newInfractionUnit}
                    onChange={(e) => setNewInfractionUnit(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm" 
                    placeholder="Ex: 102"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Infração (Regimento)</label>
                  <select 
                    value={selectedRuleId}
                    onChange={(e) => setSelectedRuleId(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm"
                    required
                  >
                    <option value="">Selecione a regra violada...</option>
                    {regimentRules.map(r => (
                      <option key={r.id} value={r.id}>{r.article} - {r.description} (R$ {r.defaultAmount})</option>
                    ))}
                  </select>
                </div>
                {selectedRuleId && (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-600">
                    <span className="font-semibold">Multa Prevista:</span> R$ {regimentRules.find(r => r.id.toString() === selectedRuleId)?.defaultAmount.toFixed(2)}
                  </div>
                )}
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Observações / Evidências</label>
                   <textarea className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm h-24" placeholder="Descreva os detalhes..."></textarea>
                </div>
                <button className="w-full bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 mt-2">Registrar Multa</button>
             </form>
           )}
        </Modal>
      )}
    </div>
  );
}

// --- APP SHELL (State Holder) ---

const App = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [tenant, setTenant] = useState(TENANTS[0]);
  const [isTenantMenuOpen, setIsTenantMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  
  // Centralized State
  const [finance, setFinance] = useState(MOCK_FINANCE);
  const [units, setUnits] = useState(MOCK_UNITS);
  const [maintenance, setMaintenance] = useState(MOCK_MAINTENANCE);
  const [suppliers, setSuppliers] = useState(MOCK_SUPPLIERS);
  const [infractions, setInfractions] = useState(MOCK_INFRACTIONS);
  const [users, setUsers] = useState(MOCK_SYSTEM_USERS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-600">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-20 shadow-xl">
        <div className="p-6 flex items-center gap-3 text-white mb-2">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-900/50">
            <Building2 size={24} />
          </div>
          <div>
             <h1 className="font-bold text-lg leading-tight">GestorCondo</h1>
             <span className="text-xs text-slate-400 font-medium">PRO 360</span>
          </div>
        </div>
        
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {[
            { id: 'dashboard', label: 'Visão Geral', icon: Menu },
            { id: 'units', label: 'Unidades e Moradores', icon: User },
            { id: 'maintenance', label: 'Manutenção', icon: Wrench },
            { id: 'finance', label: 'Financeiro', icon: DollarSign },
            { id: 'suppliers', label: 'Fornecedores', icon: Truck },
            { id: 'infractions', label: 'Infrações', icon: AlertTriangle },
            { id: 'documents', label: 'Documentos', icon: FileText },
            { id: 'settings', label: 'Configurações', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as ViewState)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium ${
                currentView === item.id 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} className={currentView === item.id ? 'text-white' : 'text-slate-400'} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-900 flex items-center justify-center text-indigo-200 font-bold border border-indigo-700">
              CS
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Carlos Síndico</p>
              <p className="text-xs text-slate-500">Gestor Principal</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm/50 backdrop-blur-md bg-white/90">
           <div className="relative">
             <button 
               onClick={() => setIsTenantMenuOpen(!isTenantMenuOpen)}
               className="flex items-center gap-2 hover:bg-slate-50 py-1.5 px-3 rounded-lg transition-colors group"
             >
               <div className="text-left">
                 <h2 className="font-bold text-slate-800 text-sm leading-tight group-hover:text-indigo-600 transition-colors">{tenant.name}</h2>
                 <p className="text-xs text-slate-400">{tenant.cnpj}</p>
               </div>
               <ChevronDown size={16} className="text-slate-400" />
             </button>
             
             {isTenantMenuOpen && (
               <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                 {TENANTS.map(t => (
                   <button 
                     key={t.id}
                     onClick={() => { setTenant(t); setIsTenantMenuOpen(false); }}
                     className={`w-full text-left px-4 py-3 hover:bg-slate-50 text-sm border-b border-slate-50 last:border-0 ${tenant.id === t.id ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600'}`}
                   >
                     {t.name}
                   </button>
                 ))}
                 <button className="w-full text-left px-4 py-2.5 bg-slate-50 text-xs font-semibold text-indigo-600 hover:text-indigo-800">
                   + Adicionar Condomínio
                 </button>
               </div>
             )}
           </div>

           <div className="flex items-center gap-4">
             <div className="relative">
               <button 
                 onClick={() => setNotificationsOpen(!notificationsOpen)} 
                 className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all relative"
               >
                 <Bell size={20} />
                 {unreadCount > 0 && (
                   <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                 )}
               </button>

               {notificationsOpen && (
                 <div className="absolute right-0 top-full mt-3 w-80 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-3 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                      <h4 className="font-semibold text-sm text-slate-700">Notificações</h4>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-xs text-indigo-600 font-medium hover:underline">
                          Marcar lidas
                        </button>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-center text-sm text-slate-400">Nenhuma notificação.</p>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} className={`p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors ${!n.read ? 'bg-indigo-50/30' : ''}`}>
                             <div className="flex justify-between items-start mb-1">
                               <p className={`text-sm ${!n.read ? 'font-semibold text-slate-800' : 'font-medium text-slate-600'}`}>{n.title}</p>
                               <span className="text-[10px] text-slate-400">{n.time}</span>
                             </div>
                             <p className="text-xs text-slate-500 leading-relaxed">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                 </div>
               )}
             </div>
           </div>
        </header>

        {/* Content Area */}
        <div className="p-8 overflow-y-auto flex-1 bg-slate-50/50 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {currentView === 'dashboard' && <DashboardView onNavigate={setCurrentView} data={{finance, units, maintenance}} />}
            {currentView === 'units' && <UnitsView data={units} onUpdate={setUnits} />}
            {currentView === 'finance' && <FinanceView data={finance} onUpdate={setFinance} />}
            {currentView === 'maintenance' && <MaintenanceView data={maintenance} onUpdate={setMaintenance} />}
            {currentView === 'suppliers' && <SuppliersView data={suppliers} onUpdate={setSuppliers} />}
            {currentView === 'infractions' && <InfractionsView data={infractions} onUpdate={setInfractions} />}
            {currentView === 'documents' && <DocumentsView />}
            {currentView === 'settings' && <SettingsView users={users} onUpdateUsers={setUsers} />}
          </div>
        </div>
      </main>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);