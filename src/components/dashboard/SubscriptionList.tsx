import { useFinance } from '../../hooks/useFinance';
import { FAMILY_MEMBERS } from '../../utils/constants';
import { formatCurrency } from '../../utils/currency-helpers';
import { Trash2, Power, PowerOff, Repeat } from 'lucide-react';

export function SubscriptionList() {
  const { subscriptions, deleteSubscription, toggleSubscription } = useFinance();

  if (subscriptions.length === 0) {
    return (
      <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <h3 className="font-bold text-lg text-slate-800 text-left">Assinaturas Ativas</h3>
        </div>
        <div className="p-12 text-center">
          <div className="max-w-xs mx-auto space-y-3">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
              <Repeat size={32} />
            </div>
            <p className="text-slate-500 font-medium">
              Nenhuma assinatura cadastrada ainda.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const handleDelete = (id: string, description: string) => {
    if (window.confirm(`Deseja excluir a assinatura "${description}"?\n\nTodos os gastos futuros relacionados também serão removidos.`)) {
      deleteSubscription(id);
    }
  };

  const totalMonthly = subscriptions
    .filter(sub => sub.isActive)
    .reduce((acc, sub) => acc + sub.amount, 0);

  return (
    <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-50 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg text-slate-800 text-left">Assinaturas Recorrentes</h3>
          <p className="text-sm text-slate-500">Total mensal: {formatCurrency(totalMonthly)}</p>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Descrição</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Responsável</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Categoria</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Dia Cobrança</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Valor</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {subscriptions.map((subscription) => {
              const memberConfig = FAMILY_MEMBERS.find(m => m.name === subscription.member);
              const MemberIcon = memberConfig?.icon;

              return (
                <tr key={subscription.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-4">
                    <button
                      onClick={() => toggleSubscription(subscription.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        subscription.isActive
                          ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                          : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                      }`}
                      title={subscription.isActive ? 'Ativa' : 'Pausada'}
                    >
                      {subscription.isActive ? <Power size={16} /> : <PowerOff size={16} />}
                    </button>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Repeat size={14} className="text-purple-500" />
                      <span className="text-sm font-semibold text-slate-800">{subscription.description}</span>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {MemberIcon && (
                        <div 
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs"
                          style={{ backgroundColor: memberConfig?.color }}
                        >
                          <MemberIcon size={12} />
                        </div>
                      )}
                      <span className="text-sm font-medium text-slate-700">{subscription.member}</span>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-[11px] font-bold text-slate-600">
                      {subscription.category || 'Geral'}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="text-sm font-medium text-slate-500">Dia {subscription.dayOfMonth}</span>
                  </td>

                  <td className="p-4">
                    <span className="text-sm font-bold text-slate-900">
                      {formatCurrency(subscription.amount)}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleDelete(subscription.id, subscription.description)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}