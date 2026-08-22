import React, { useState, useEffect } from 'react';
import { Shield, Users, FileText, LayoutDashboard, RefreshCw } from 'lucide-react';
import api from '../api/client';
import { User, AuditLog, Role } from '../types';
import ManagerDashboardPage from './ManagerDashboardPage';

const AdminDashboardPage: React.FC = () => {
  const [adminTab, setAdminTab] = useState<'manager-view' | 'users' | 'audit'>('manager-view');
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
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
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleToggleUser = async (userId: number) => {
    try {
      await api.patch(`/users/${userId}/toggle`);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to toggle user status');
    }
  };

  const handleGlobalRefresh = () => {
    if (adminTab === 'users') fetchUsers();
    else if (adminTab === 'audit') fetchAuditLogs();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
            Super Administrator Portal
          </span>
          <h1 className="text-2xl font-black text-gray-900 mt-1">Enterprise System & Security Control</h1>
        </div>

        <div className="flex items-center space-x-2">
          {adminTab !== 'manager-view' && (
            <button
              onClick={handleGlobalRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-1.5 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-700 transition shadow-2xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-purple-600' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          )}

          <button
            onClick={() => setAdminTab('manager-view')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
              adminTab === 'manager-view'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Store Operations & Catalog</span>
          </button>

          <button
            onClick={() => setAdminTab('users')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
              adminTab === 'users'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User RBAC Control</span>
          </button>

          <button
            onClick={() => setAdminTab('audit')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
              adminTab === 'audit'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Audit Logs</span>
          </button>
        </div>
      </div>

      {adminTab === 'manager-view' && <ManagerDashboardPage />}

      {adminTab === 'users' && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">User Accounts & Role Permissions ({users.length})</h3>
            <button
              onClick={fetchUsers}
              disabled={isRefreshing}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600"
              title="Refresh Users"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-purple-600' : ''}`} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 uppercase font-bold border-b border-gray-200">
                <tr>
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Assigned Role (RBAC)</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/80 transition">
                    <td className="p-3.5">
                      <p className="font-bold text-gray-900">{u.name}</p>
                      <p className="text-[10px] text-gray-400">{u.phone || 'No phone'}</p>
                    </td>
                    <td className="p-3.5 font-mono text-gray-700">{u.email}</td>
                    <td className="p-3.5">
                      <select
                        value={u.role}
                        onChange={(e) => handleUpdateRole(u.id, e.target.value as Role)}
                        className="p-1.5 border border-gray-300 rounded-lg text-xs font-bold bg-white focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="CUSTOMER">CUSTOMER</option>
                        <option value="STAFF">STAFF</option>
                        <option value="MANAGER">MANAGER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          u.active
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {u.active ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleToggleUser(u.id)}
                        className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
                          u.active
                            ? 'bg-red-50 text-red-700 hover:bg-red-100'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
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

      {adminTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Security & Operational Audit Log Stream ({auditLogs.length})</h3>
            <button
              onClick={fetchAuditLogs}
              disabled={isRefreshing}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600"
              title="Refresh Audit Logs"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-purple-600' : ''}`} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 uppercase font-bold border-b border-gray-200">
                <tr>
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">Action</th>
                  <th className="p-3.5">Actor (Role)</th>
                  <th className="p-3.5">Target Entity</th>
                  <th className="p-3.5">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400">
                      No audit events recorded yet.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/80 transition">
                      <td className="p-3.5 font-mono text-gray-500 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="p-3.5">
                        <span className="font-mono font-bold bg-purple-50 text-purple-800 px-2 py-0.5 rounded">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <p className="font-bold text-gray-900">{log.userEmail || 'System'}</p>
                        <p className="text-[10px] text-gray-400">{log.role || 'SYSTEM'}</p>
                      </td>
                      <td className="p-3.5 font-medium text-gray-700">
                        {log.entityName} {log.entityId && `(#${log.entityId})`}
                      </td>
                      <td className="p-3.5 text-gray-600 max-w-xs truncate">{log.details || '—'}</td>
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
