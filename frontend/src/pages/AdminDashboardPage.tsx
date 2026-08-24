import React, { useState, useEffect } from 'react';
import { Shield, Users, FileText, LayoutDashboard, RefreshCw, Search, CheckCircle2, Lock, UserCheck, Activity } from 'lucide-react';
import api from '../api/client';
import { User, AuditLog, Role } from '../types';
import ManagerDashboardPage from './ManagerDashboardPage';
import { useToast } from '../context/ToastContext';

const AdminDashboardPage: React.FC = () => {
  const { success, error } = useToast();
  const [adminTab, setAdminTab] = useState<'manager-view' | 'users' | 'audit'>('manager-view');
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [auditSearch, setAuditSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (adminTab === 'users') fetchUsers();
    if (adminTab === 'audit') fetchAuditLogs();
  }, [adminTab]);

  const fetchUsers = async () => {
    try {
      setIsRefreshing(true);
      const res = await api.get<User[]>('/users');
      setUsers(res.data);
    } catch {
      setUsers([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      setIsRefreshing(true);
      const res = await api.get<AuditLog[]>('/admin/audit-logs');
      setAuditLogs(res.data);
    } catch {
      setAuditLogs([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleUpdateRole = async (userId: number, newRole: Role) => {
    try {
      await api.patch(`/users/${userId}/role`, { role: newRole });
      success('Role Assigned', `User assigned role ${newRole}`);
      fetchUsers();
    } catch (err: any) {
      error('Role Update Error', err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleToggleUser = async (userId: number) => {
    try {
      await api.patch(`/users/${userId}/toggle`);
      success('User Status Updated', 'Account access permission updated');
      fetchUsers();
    } catch (err: any) {
      error('Toggle Error', err.response?.data?.message || 'Failed to toggle user status');
    }
  };

  const handleGlobalRefresh = () => {
    if (adminTab === 'users') fetchUsers();
    else if (adminTab === 'audit') fetchAuditLogs();
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredAuditLogs = auditLogs.filter(
    (log) =>
      log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      (log.userEmail && log.userEmail.toLowerCase().includes(auditSearch.toLowerCase())) ||
      log.entityName.toLowerCase().includes(auditSearch.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(auditSearch.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/80 px-3 py-1 rounded-full">
            Super Administrator Portal
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2">
            Enterprise Security, RBAC & Store Control
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {adminTab !== 'manager-view' && (
            <button
              onClick={handleGlobalRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-1.5 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition shadow-2xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-purple-600' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          )}

          <button
            onClick={() => setAdminTab('manager-view')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition ${
              adminTab === 'manager-view'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Store Operations & Catalog</span>
          </button>

          <button
            onClick={() => setAdminTab('users')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition ${
              adminTab === 'users'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User RBAC Control</span>
          </button>

          <button
            onClick={() => setAdminTab('audit')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition ${
              adminTab === 'audit'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Audit Logs</span>
          </button>
        </div>
      </div>

      {adminTab === 'manager-view' && <ManagerDashboardPage />}

      {/* Tab 2: User RBAC Management */}
      {adminTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user by name, email, or role..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-slate-100"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Total Users: <span className="font-bold text-slate-900 dark:text-slate-100">{users.length}</span>
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 uppercase font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">User Details</th>
                  <th className="p-4">Registered Email</th>
                  <th className="p-4">Assigned Role (RBAC)</th>
                  <th className="p-4">Account Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center shrink-0">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100">{u.name}</p>
                          <p className="text-[10px] text-slate-400">{u.phone || 'No phone number'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-slate-700 dark:text-slate-300">{u.email}</td>
                    <td className="p-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleUpdateRole(u.id, e.target.value as Role)}
                        className="p-1.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="CUSTOMER">CUSTOMER</option>
                        <option value="STAFF">STAFF</option>
                        <option value="MANAGER">MANAGER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          u.active
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                        }`}
                      >
                        {u.active ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleUser(u.id)}
                        className={`px-3 py-1 rounded-xl font-bold text-xs transition ${
                          u.active
                            ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100 border border-rose-200 dark:border-rose-800'
                            : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800'
                        }`}
                      >
                        {u.active ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Audit Logs Stream */}
      {adminTab === 'audit' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                placeholder="Filter audit by action, actor, or entity..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-slate-100"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Logged Events: <span className="font-bold text-slate-900 dark:text-slate-100">{auditLogs.length}</span>
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 uppercase font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Actor (Role)</th>
                  <th className="p-4">Target Entity</th>
                  <th className="p-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredAuditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      No audit events matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                      <td className="p-4 font-mono text-slate-500 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span className="font-mono font-bold bg-purple-50 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800 px-2 py-0.5 rounded-lg">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-slate-900 dark:text-slate-100">{log.userEmail || 'System'}</p>
                        <p className="text-[10px] text-slate-400">{log.role || 'SYSTEM'}</p>
                      </td>
                      <td className="p-4 font-medium text-slate-700 dark:text-slate-300">
                        {log.entityName} {log.entityId && `(#${log.entityId})`}
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">{log.details || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
