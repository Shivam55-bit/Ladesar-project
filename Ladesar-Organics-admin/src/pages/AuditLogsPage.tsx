import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { INITIAL_AUDIT_LOGS } from '../data/mockData';
import { AuditLog } from '../types';
import { 
  ShieldCheck, 
  Clock, 
  User, 
  FileText, 
  Search, 
  Lock, 
  CheckCircle2, 
  XCircle,
  Key
} from 'lucide-react';

const ROLES_PERMISSIONS_MATRIX = [
  {
    role: 'Super Admin',
    desc: 'Full unrestricted governance of products, orders, audit logs, staff and financials',
    permissions: ['Products (Full)', 'Orders (Full)', 'Inventory (Full)', 'Coupons (Full)', 'Roles & Staff', 'Settings', 'Database Sync'],
    badge: 'bg-amber-100 text-amber-900 border-amber-300'
  },
  {
    role: 'Inventory & Catalog Manager',
    desc: 'Manage organic product listings, prices, SKU stock replenishment, and categories',
    permissions: ['Products (Create/Edit)', 'Inventory (Restock)', 'Categories (View/Edit)', 'AI Studio (Use)'],
    badge: 'bg-emerald-100 text-emerald-900 border-emerald-300'
  },
  {
    role: 'Order Fulfillment Staff',
    desc: 'Order verification, packaging status updates, courier dispatch tracking, and invoice printing',
    permissions: ['Orders (Inspect/Status Update)', 'Invoice Slips (Print)', 'Inventory (View)'],
    badge: 'bg-blue-100 text-blue-900 border-blue-300'
  }
];

export const AuditLogsPage: React.FC = () => {
  const { auditLogs } = useStore();
  const logs = auditLogs && auditLogs.length > 0 ? auditLogs : INITIAL_AUDIT_LOGS;
  const [search, setSearch] = useState('');

  const filteredLogs = logs.filter(l => 
    !search || 
    l.user.toLowerCase().includes(search.toLowerCase()) ||
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.details.toLowerCase().includes(search.toLowerCase()) ||
    l.module.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-1.5 border border-emerald-200">
          <ShieldCheck className="w-3 h-3" />
          <span>Security & Accountability</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F3823]">
          Audit Trail & Role Governance
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 font-sans-clean">
          Immutable event log of administrative actions, price modifications, and staff permissions
        </p>
      </div>

      {/* Role Permission Matrix */}
      <div>
        <h3 className="font-serif font-bold text-base text-[#0F3823] mb-3">
          Role-Based Access Control (RBAC) Architecture
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ROLES_PERMISSIONS_MATRIX.map(r => (
            <div key={r.role} className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-block mb-2 ${r.badge}`}>
                  {r.role}
                </span>
                <p className="text-xs text-stone-600 mb-4 font-sans-clean leading-relaxed">
                  {r.desc}
                </p>
                <div className="space-y-1.5 border-t border-stone-100 pt-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Granted Capabilities:</p>
                  {r.permissions.map((p, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs text-stone-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Logs Stream */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="font-serif font-bold text-base text-[#0F3823]">
            Recent Administrative Event Logs ({filteredLogs.length})
          </h3>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search audit trail..."
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-stone-500 font-bold uppercase tracking-wider text-[10px] border-b border-stone-200">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Admin Persona</th>
                <th className="p-3">Role</th>
                <th className="p-3">Module</th>
                <th className="p-3">Action</th>
                <th className="p-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-stone-50 transition-colors">
                  <td className="p-3 font-mono text-stone-500 text-[11px] whitespace-nowrap">
                    {log.timestamp}
                  </td>

                  <td className="p-3 font-bold text-stone-900">
                    {log.user}
                  </td>

                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-700">
                      {log.role}
                    </span>
                  </td>

                  <td className="p-3 font-semibold text-[#0F3823]">
                    {log.module}
                  </td>

                  <td className="p-3 font-mono font-bold text-[11px] text-[#B8860B]">
                    {log.action}
                  </td>

                  <td className="p-3 text-stone-700">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
