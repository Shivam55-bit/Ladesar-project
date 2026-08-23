import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { CustomerUser, UserRole, UserStatus } from '../types';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Crown, 
  Briefcase, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Ban, 
  Edit3, 
  Trash2, 
  Download, 
  Sparkles, 
  ArrowUpDown, 
  MapPin, 
  Phone, 
  Mail, 
  X, 
  Wallet, 
  Award,
  MoreVertical,
  Plus
} from 'lucide-react';

export const UsersPage: React.FC = () => {
  const { users, createUser, updateUser, deleteUser, toggleUserStatus, showToast } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'spend' | 'orders' | 'joined'>('joined');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<CustomerUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<CustomerUser | null>(null);

  // Form Data State for Add / Edit
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    status: UserStatus;
    walletBalance: number;
    loyaltyPoints: number;
    street: string;
    city: string;
    state: string;
    pincode: string;
  }>({
    name: '',
    email: '',
    phone: '',
    role: 'Customer',
    status: 'Active',
    walletBalance: 100,
    loyaltyPoints: 50,
    street: '',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122001'
  });

  // KPI calculations
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'Active').length;
  const vipUsers = users.filter(u => u.role === 'VIP Member').length;
  const wholesaleUsers = users.filter(u => u.role === 'Wholesale Partner').length;
  const totalCustomerSpend = users.reduce((sum, u) => sum + (u.totalSpent || 0), 0);

  // Filtered & Sorted Users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone.includes(searchQuery) ||
        (user.referralCode && user.referralCode.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRole = roleFilter === 'all' || (user.role?.toLowerCase() === roleFilter.toLowerCase());
      const matchesStatus = statusFilter === 'all' || (user.status?.toLowerCase() === statusFilter.toLowerCase());

      return matchesSearch && matchesRole && matchesStatus;
    }).sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
      if (sortBy === 'spend') {
        const valA = a.totalSpent || 0;
        const valB = b.totalSpent || 0;
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      if (sortBy === 'orders') {
        const valA = a.totalOrders || 0;
        const valB = b.totalOrders || 0;
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      return sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
    });
  }, [users, searchQuery, roleFilter, statusFilter, sortBy, sortOrder]);

  const openAddModal = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'Customer',
      status: 'Active',
      walletBalance: 100,
      loyaltyPoints: 50,
      street: '',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122001'
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (user: CustomerUser) => {
    setEditingUser(user);
    const primaryAddr = user.addresses?.[0];
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role || 'Customer',
      status: user.status || 'Active',
      walletBalance: user.walletBalance || 0,
      loyaltyPoints: user.loyaltyPoints || 0,
      street: primaryAddr?.street || '',
      city: primaryAddr?.city || 'Gurugram',
      state: primaryAddr?.state || 'Haryana',
      pincode: primaryAddr?.pincode || '122001'
    });
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      showToast('Name and Email are required', 'warning');
      return;
    }

    const addresses = formData.street ? [{
      id: `addr-${Date.now()}`,
      fullName: formData.name,
      phone: formData.phone,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      type: 'Home' as const,
      isDefault: true
    }] : [];

    await createUser({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || '+91 98000 00000',
      role: formData.role,
      status: formData.status,
      walletBalance: Number(formData.walletBalance) || 0,
      loyaltyPoints: Number(formData.loyaltyPoints) || 0,
      addresses
    });

    setIsAddModalOpen(false);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    let addresses = editingUser.addresses || [];
    if (formData.street) {
      if (addresses.length > 0) {
        addresses[0] = {
          ...addresses[0],
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        };
      } else {
        addresses = [{
          id: `addr-${Date.now()}`,
          fullName: formData.name,
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          type: 'Home',
          isDefault: true
        }];
      }
    }

    await updateUser({
      ...editingUser,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      status: formData.status,
      walletBalance: Number(formData.walletBalance),
      loyaltyPoints: Number(formData.loyaltyPoints),
      addresses
    });

    setEditingUser(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingUser) return;
    await deleteUser(deletingUser.id);
    setDeletingUser(null);
  };

  const exportToCSV = () => {
    const headers = ['ID,Name,Email,Phone,Role,Status,Orders,Spent,Wallet,Points,Joined Date\n'];
    const rows = filteredUsers.map(u => 
      `"${u.id}","${u.name}","${u.email}","${u.phone}","${u.role || 'Customer'}","${u.status || 'Active'}","${u.totalOrders || 0}","${u.totalSpent || 0}","${u.walletBalance || 0}","${u.loyaltyPoints || 0}","${u.joinedDate}"`
    );
    const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `ladesar_users_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Customer directory exported as CSV', 'success');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header & Quick Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#0F3823] text-[#D4AF37] flex items-center justify-center shadow-md">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-serif-luxury text-[#0F3823]">
                Users & Vedic Customers
              </h1>
              <p className="text-xs text-stone-500">
                Manage registered customer profiles, wholesale accounts, VIP loyalty wallets & security statuses.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportToCSV}
            className="px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs border border-stone-200"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-2xl bg-[#0F3823] hover:bg-[#164E31] text-[#FAF7F2] text-xs font-bold transition-all flex items-center gap-2 shadow-md hover:shadow-lg cursor-pointer active:scale-95"
          >
            <UserPlus className="w-4 h-4 text-[#D4AF37]" /> Add New User
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Total Registered</span>
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-[#0F3823]">
            {totalUsers}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> {activeUsers} Active Accounts
          </div>
        </div>

        {/* VIP Members */}
        <div className="p-5 rounded-3xl bg-white border border-amber-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">VIP Club Members</span>
            <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Crown className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-amber-900">
            {vipUsers}
          </div>
          <div className="text-[11px] text-amber-800 font-semibold">
            Premium A2 Bilona & Vedic Gold Tier
          </div>
        </div>

        {/* Wholesale Partners */}
        <div className="p-5 rounded-3xl bg-white border border-purple-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-800">Wholesale / B2B</span>
            <span className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-purple-950">
            {wholesaleUsers}
          </div>
          <div className="text-[11px] text-purple-700 font-semibold">
            Bulk Ayurvedic clinics & organic retailers
          </div>
        </div>

        {/* Customer Lifetime Spend */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Customer LTV Value</span>
            <span className="w-8 h-8 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-[#0F3823]">
            ₹{totalCustomerSpend.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-stone-600 font-semibold">
            Cumulative orders across all customers
          </div>
        </div>
      </div>

      {/* Filter, Search & Sorting Strip */}
      <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, phone, referral code..."
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#0F3823] focus:bg-white transition-all"
            />
          </div>

          {/* Filter Pills & Selects */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-start lg:justify-end">
            
            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-semibold text-stone-700 focus:outline-none focus:border-[#0F3823] cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="Customer">Customer</option>
              <option value="VIP Member">VIP Member</option>
              <option value="Wholesale Partner">Wholesale Partner</option>
              <option value="Staff">Staff</option>
              <option value="Super Admin">Super Admin</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-semibold text-stone-700 focus:outline-none focus:border-[#0F3823] cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Blocked">Blocked</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('-');
                setSortBy(sb as any);
                setSortOrder(so as any);
              }}
              className="px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-semibold text-stone-700 focus:outline-none focus:border-[#0F3823] cursor-pointer"
            >
              <option value="joined-desc">Newest First</option>
              <option value="joined-asc">Oldest First</option>
              <option value="spend-desc">Highest Lifetime Spend</option>
              <option value="orders-desc">Most Orders</option>
              <option value="name-asc">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                <th className="py-4 px-5">Customer / User</th>
                <th className="py-4 px-4">Contact Details</th>
                <th className="py-4 px-4">Role & Tier</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-center">Orders & Spend</th>
                <th className="py-4 px-4">Wallet & Points</th>
                <th className="py-4 px-4">Joined Date</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    No customer accounts match your search query or filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const role = u.role || 'Customer';
                  const status = u.status || 'Active';

                  return (
                    <tr key={u.id} className="hover:bg-stone-50/80 transition-colors">
                      {/* Customer Info */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-2xl bg-[#0F3823] text-[#D4AF37] flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <strong className="block text-stone-900 font-bold text-xs sm:text-sm">
                              {u.name}
                            </strong>
                            <span className="text-[10.5px] font-mono text-stone-500">
                              Ref: {u.referralCode || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact Details */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-stone-800 font-medium">
                            <Mail className="w-3 h-3 text-stone-400" /> {u.email}
                          </div>
                          <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
                            <Phone className="w-3 h-3 text-stone-400" /> {u.phone}
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-4 px-4">
                        {role === 'VIP Member' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <Crown className="w-3 h-3" /> VIP Member
                          </span>
                        )}
                        {role === 'Wholesale Partner' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                            <Briefcase className="w-3 h-3" /> Wholesale
                          </span>
                        )}
                        {role === 'Super Admin' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-800 border border-red-200">
                            <ShieldCheck className="w-3 h-3" /> Super Admin
                          </span>
                        )}
                        {role === 'Staff' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
                            Staff
                          </span>
                        )}
                        {role === 'Customer' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Customer
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {status === 'Active' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" /> Active
                          </span>
                        )}
                        {status === 'Suspended' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <AlertTriangle className="w-3 h-3" /> Suspended
                          </span>
                        )}
                        {status === 'Blocked' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                            <Ban className="w-3 h-3" /> Blocked
                          </span>
                        )}
                      </td>

                      {/* Orders & Spend */}
                      <td className="py-4 px-4 text-center">
                        <strong className="block text-stone-900 font-bold">
                          {u.totalOrders || 0} Orders
                        </strong>
                        <span className="text-[11px] text-[#0F3823] font-semibold">
                          ₹{(u.totalSpent || 0).toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* Wallet & Points */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <span className="block font-bold text-emerald-800">
                            ₹{u.walletBalance || 0} Cash
                          </span>
                          <span className="text-[11px] text-[#B8860B] font-semibold">
                            {u.loyaltyPoints || 0} Points
                          </span>
                        </div>
                      </td>

                      {/* Joined Date */}
                      <td className="py-4 px-4 text-stone-600">
                        <div>{u.joinedDate}</div>
                        <div className="text-[10px] text-stone-400">{u.lastLogin || 'Recent'}</div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => toggleUserStatus(u.id)}
                            title={status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                            className={`p-2 rounded-xl border transition-all cursor-pointer ${
                              status === 'Active'
                                ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
                            }`}
                          >
                            {status === 'Active' ? <Ban className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => openEditModal(u)}
                            title="Edit User"
                            className="p-2 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-[#0F3823] border border-stone-200 transition-all cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setDeletingUser(u)}
                            title="Delete User"
                            className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* ADD USER MODAL */}
      {/* ------------------------------------------------------------- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2 text-[#0F3823] font-bold text-base">
                <UserPlus className="w-5 h-5 text-[#D4AF37]" /> Create Customer / User Account
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-800 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Anand Rathi"
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-800 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. anand@example.com"
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-stone-800 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-800 block mb-1">Role / Tier</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                  >
                    <option value="Customer">Customer</option>
                    <option value="VIP Member">VIP Member</option>
                    <option value="Wholesale Partner">Wholesale Partner</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-800 block mb-1">Account Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as UserStatus })}
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-800 block mb-1">Initial Wallet Credit (₹)</label>
                  <input
                    type="number"
                    value={formData.walletBalance}
                    onChange={(e) => setFormData({ ...formData, walletBalance: Number(e.target.value) })}
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-800 block mb-1">Reward Points</label>
                  <input
                    type="number"
                    value={formData.loyaltyPoints}
                    onChange={(e) => setFormData({ ...formData, loyaltyPoints: Number(e.target.value) })}
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Primary Address */}
              <div className="pt-2 border-t border-stone-100 space-y-2">
                <label className="font-bold text-stone-800 block">Primary Delivery Address (Optional)</label>
                <input
                  type="text"
                  placeholder="Street / Flat / Colony"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0F3823] hover:bg-[#164E31] text-[#FAF7F2] font-bold shadow-md cursor-pointer"
                >
                  Create User Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* EDIT USER MODAL */}
      {/* ------------------------------------------------------------- */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2 text-[#0F3823] font-bold text-base">
                <Edit3 className="w-5 h-5 text-[#D4AF37]" /> Edit User Profile ({editingUser.name})
              </div>
              <button 
                onClick={() => setEditingUser(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-800 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-800 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-stone-800 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-800 block mb-1">Role / Tier</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                  >
                    <option value="Customer">Customer</option>
                    <option value="VIP Member">VIP Member</option>
                    <option value="Wholesale Partner">Wholesale Partner</option>
                    <option value="Staff">Staff</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-800 block mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as UserStatus })}
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-800 block mb-1">Wallet Cash (₹)</label>
                  <input
                    type="number"
                    value={formData.walletBalance}
                    onChange={(e) => setFormData({ ...formData, walletBalance: Number(e.target.value) })}
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl font-semibold text-emerald-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-800 block mb-1">Loyalty Points</label>
                  <input
                    type="number"
                    value={formData.loyaltyPoints}
                    onChange={(e) => setFormData({ ...formData, loyaltyPoints: Number(e.target.value) })}
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl font-semibold text-amber-800"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 space-y-2">
                <label className="font-bold text-stone-800 block">Primary Address</label>
                <input
                  type="text"
                  placeholder="Street Address"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0F3823] hover:bg-[#164E31] text-[#FAF7F2] font-bold shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ------------------------------------------------------------- */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in zoom-in-95 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">
              Delete User Account?
            </h3>
            <p className="text-xs text-stone-500">
              Are you sure you want to delete <strong className="text-stone-800">"{deletingUser.name}"</strong> ({deletingUser.email})? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
