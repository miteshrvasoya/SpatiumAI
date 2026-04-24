'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Calendar, 
  Mail, 
  LogOut, 
  TrendingUp, 
  Download,
  Search,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface WaitlistUser {
  id: string;
  email: string;
  name?: string;
  joinedAt: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<WaitlistUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/waitlist');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        router.push('/admin');
      }
    } catch (err) {
      toast.error('Failed to fetch waitlist');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = () => {
    // In a real app, you'd call an API to clear the cookie
    document.cookie = 'admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/admin');
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      {/* Header */}
      <header className="border-b border-[var(--bg-border)] bg-[var(--bg-elevated)]/50 backdrop-blur-md sticky top-0 z-10">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-primary)] text-white">
              <Users className="h-4 w-4" />
            </div>
            <h1 className="text-lg font-bold tracking-tight">Waitlist Admin</h1>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-[var(--bg-border)] bg-[var(--bg-elevated)] p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[var(--text-secondary)]">Total Signups</p>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="mt-2 text-3xl font-bold">{users.length}</p>
          </div>
          <div className="rounded-2xl border border-[var(--bg-border)] bg-[var(--bg-elevated)] p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[var(--text-secondary)]">Last 24 Hours</p>
              <Calendar className="h-4 w-4 text-[var(--accent-primary)]" />
            </div>
            <p className="mt-2 text-3xl font-bold">
              {users.filter(u => new Date(u.joinedAt) > new Date(Date.now() - 86400000)).length}
            </p>
          </div>
          <div className="hidden lg:block rounded-2xl border border-[var(--bg-border)] bg-[var(--bg-elevated)] p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[var(--text-secondary)]">Retention Rate</p>
              <RefreshCw className="h-4 w-4 text-sky-500" />
            </div>
            <p className="mt-2 text-3xl font-bold">99.2%</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[var(--bg-elevated)]/30 p-4 rounded-xl border border-[var(--bg-border)]">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-tertiary)]" />
            <input 
              type="text" 
              placeholder="Search signups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-[var(--bg-border)] bg-[var(--bg-base)] py-2 pl-9 pr-4 text-sm outline-none focus:border-[var(--accent-primary)]"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={fetchUsers}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[var(--bg-border)] px-4 py-2 text-sm hover:bg-[var(--bg-elevated)] transition-all"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--text-primary)] px-4 py-2 text-sm text-[var(--bg-base)] hover:opacity-90 transition-all">
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-hidden rounded-2xl border border-[var(--bg-border)] bg-[var(--bg-elevated)] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--bg-border)] bg-[var(--bg-elevated)]/50">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">User</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Joined Date</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--bg-border)]">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={4} className="px-6 py-8 h-16 bg-[var(--bg-base)]/10" />
                    </tr>
                  ))
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-[var(--bg-base)]/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-bold text-xs uppercase">
                            {user.email[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{user.name || 'Anonymous'}</p>
                            <p className="text-xs text-[var(--text-secondary)]">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-500 uppercase tracking-tight">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                        {format(new Date(user.joinedAt), 'MMM dd, yyyy HH:mm')}
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-[var(--accent-primary)] hover:underline text-xs font-medium">
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-[var(--text-secondary)]">
                      No signups found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
