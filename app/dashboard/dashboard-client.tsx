'use client'

import {
  LayoutDashboard,
  BarChart3,
  Target,
  Users,
  Settings,
  Bell,
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  MousePointer,
  LogOut,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  Activity,
  Globe,
  Menu,
  X,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import type { Session } from '@/lib/auth'
import { signOutCurrentUser } from '@/services/auth.service'
import { useUiStore } from '@/stores/useUiStore'

interface DashboardClientProps {
  session: Session
}

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', active: true },
  { icon: BarChart3, label: 'Analytics', active: false },
  { icon: Target, label: 'Campaigns', active: false },
  { icon: Users, label: 'Audience', active: false },
  { icon: Globe, label: 'Channels', active: false },
  { icon: Settings, label: 'Settings', active: false },
]

const statsCards = [
  {
    label: 'Total Revenue',
    value: '$84,290',
    change: '+18.2%',
    positive: true,
    icon: DollarSign,
    color: 'var(--stat-green)',
    bg: 'var(--stat-green-bg)',
  },
  {
    label: 'Impressions',
    value: '2.4M',
    change: '+12.5%',
    positive: true,
    icon: Eye,
    color: 'var(--stat-blue)',
    bg: 'var(--stat-blue-bg)',
  },
  {
    label: 'Click-through Rate',
    value: '3.68%',
    change: '-0.4%',
    positive: false,
    icon: MousePointer,
    color: 'var(--stat-orange)',
    bg: 'var(--stat-orange-bg)',
  },
  {
    label: 'Active Campaigns',
    value: '24',
    change: '+3 new',
    positive: true,
    icon: Activity,
    color: 'var(--stat-purple)',
    bg: 'var(--stat-purple-bg)',
  },
]

const campaigns = [
  {
    name: 'Summer Sale 2025',
    channel: 'Google Ads',
    budget: '$4,200',
    spent: 78,
    status: 'active',
    roas: '4.2x',
  },
  {
    name: 'Brand Awareness Q2',
    channel: 'Meta Ads',
    budget: '$2,800',
    spent: 52,
    status: 'active',
    roas: '2.8x',
  },
  {
    name: 'Product Launch',
    channel: 'LinkedIn',
    budget: '$1,500',
    spent: 94,
    status: 'ending',
    roas: '3.1x',
  },
  {
    name: 'Retargeting Flow',
    channel: 'Google Ads',
    budget: '$900',
    spent: 31,
    status: 'active',
    roas: '6.7x',
  },
  {
    name: 'Newsletter Promo',
    channel: 'Email',
    budget: '$300',
    spent: 100,
    status: 'completed',
    roas: '9.2x',
  },
]

const barData = [42, 68, 55, 81, 63, 74, 89, 72, 58, 93, 76, 88]
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    active: { label: 'Active', className: 'badge-active' },
    ending: { label: 'Ending Soon', className: 'badge-ending' },
    completed: { label: 'Completed', className: 'badge-completed' },
  }
  const s = map[status] || { label: status, className: 'badge-active' }
  return <span className={`db-badge ${s.className}`}>{s.label}</span>
}

export default function DashboardClient({ session }: DashboardClientProps) {
  const router = useRouter()
  const sidebarOpen = useUiStore(s => s.sidebarOpen)
  const setSidebarOpen = useUiStore(s => s.setSidebarOpen)
  const toggleSidebar = useUiStore(s => s.toggleSidebar)
  const [activeNav, setActiveNav] = useState('Overview')
  const [signingOut, setSigningOut] = useState(false)

  const user = session.user

  const handleSignOut = async () => {
    setSigningOut(true)
    await signOutCurrentUser()
    router.push('/sign-in')
    router.refresh()
  }

  return (
    <div className="db-root">
      {/* Sidebar Overlay */}
      {sidebarOpen && <div className="db-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`db-sidebar ${sidebarOpen ? 'db-sidebar-open' : ''}`}>
        <div className="db-sidebar-header">
          <div className="db-brand">
            <span className="db-brand-name">Signalor</span>
          </div>
          <button className="db-close-btn" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav className="db-nav">
          {navItems.map(item => (
            <button
              key={item.label}
              className={`db-nav-item ${activeNav === item.label ? 'db-nav-item-active' : ''}`}
              onClick={() => {
                setActiveNav(item.label)
                setSidebarOpen(false)
              }}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              {activeNav === item.label && <ChevronRight size={14} className="db-nav-arrow" />}
            </button>
          ))}
        </nav>

        <div className="db-sidebar-footer">
          <div className="db-user-card">
            <div className="db-user-avatar">{getInitials(user.name || 'User')}</div>
            <div className="db-user-info">
              <p className="db-user-name">{user.name}</p>
              <p className="db-user-email">{user.email}</p>
            </div>
          </div>
          <button className="db-signout-btn" onClick={handleSignOut} disabled={signingOut}>
            <LogOut size={16} />
            <span>{signingOut ? 'Signing out…' : 'Sign out'}</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="db-main">
        {/* Top Bar */}
        <header className="db-topbar">
          <div className="db-topbar-left">
            <button className="db-menu-btn" onClick={toggleSidebar}>
              <Menu size={20} />
            </button>
            <div className="db-search">
              <Search size={16} className="db-search-icon" />
              <input type="text" placeholder="Search campaigns…" className="db-search-input" />
            </div>
          </div>
          <div className="db-topbar-right">
            <button className="db-notif-btn">
              <Bell size={18} />
              <span className="db-notif-dot" />
            </button>
            <div className="db-topbar-avatar">{getInitials(user.name || 'U')}</div>
          </div>
        </header>

        {/* Content */}
        <div className="db-content">
          {/* Page Header */}
          <div className="db-page-header">
            <div>
              <h1 className="db-page-title">
                Good morning, {user.name?.split(' ')[0] || 'there'} 👋
              </h1>
              <p className="db-page-subtitle">
                Here&apos;s what&apos;s happening with your campaigns today.
              </p>
            </div>
            <button className="db-new-campaign-btn">
              <Sparkles size={16} />
              New Campaign
            </button>
          </div>

          {/* Stats Grid */}
          <div className="db-stats-grid">
            {statsCards.map(stat => (
              <div key={stat.label} className="db-stat-card">
                <div className="db-stat-header">
                  <span className="db-stat-label">{stat.label}</span>
                  <div className="db-stat-icon" style={{ background: stat.bg }}>
                    <stat.icon size={18} style={{ color: stat.color }} />
                  </div>
                </div>
                <div className="db-stat-value">{stat.value}</div>
                <div className={`db-stat-change ${stat.positive ? 'positive' : 'negative'}`}>
                  {stat.positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  <span>{stat.change} vs last month</span>
                </div>
              </div>
            ))}
          </div>

          {/* Charts + Quick Insights Row */}
          <div className="db-charts-row">
            {/* Bar Chart */}
            <div className="db-chart-card">
              <div className="db-card-header">
                <div>
                  <h2 className="db-card-title">Revenue Overview</h2>
                  <p className="db-card-sub">Monthly revenue for 2025</p>
                </div>
                <div className="db-card-badge">
                  <ArrowUpRight size={14} />
                  +18.2%
                </div>
              </div>
              <div className="db-bar-chart">
                {barData.map((val, i) => (
                  <div key={i} className="db-bar-col">
                    <div
                      className="db-bar"
                      style={{ height: `${val}%` }}
                      title={`${months[i]}: $${(val * 950).toLocaleString()}`}
                    />
                    <span className="db-bar-label">{months[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Insights */}
            <div className="db-insights-card">
              <div className="db-card-header">
                <h2 className="db-card-title">Quick Insights</h2>
              </div>
              <div className="db-insights-list">
                {[
                  {
                    label: 'Best Performing',
                    value: 'Google Ads',
                    sub: '67% of total revenue',
                    color: 'var(--stat-green)',
                  },
                  {
                    label: 'Top Campaign',
                    value: 'Summer Sale',
                    sub: '4.2x ROAS',
                    color: 'var(--stat-blue)',
                  },
                  {
                    label: 'Avg. CPC',
                    value: '$1.42',
                    sub: '↓ $0.18 vs last week',
                    color: 'var(--stat-orange)',
                  },
                  {
                    label: 'Conversions',
                    value: '1,284',
                    sub: '+22% this month',
                    color: 'var(--stat-purple)',
                  },
                ].map(insight => (
                  <div key={insight.label} className="db-insight-item">
                    <div className="db-insight-dot" style={{ background: insight.color }} />
                    <div className="db-insight-text">
                      <span className="db-insight-label">{insight.label}</span>
                      <span className="db-insight-value">{insight.value}</span>
                      <span className="db-insight-sub">{insight.sub}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Campaigns Table */}
          <div className="db-table-card">
            <div className="db-card-header">
              <div>
                <h2 className="db-card-title">Active Campaigns</h2>
                <p className="db-card-sub">Monitor and manage your running campaigns</p>
              </div>
              <button className="db-view-all-btn">
                View all <ArrowUpRight size={14} />
              </button>
            </div>
            <div className="db-table-wrapper">
              <table className="db-table">
                <thead>
                  <tr>
                    <th>Campaign</th>
                    <th>Channel</th>
                    <th>Budget</th>
                    <th>Spent</th>
                    <th>ROAS</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map(c => (
                    <tr key={c.name} className="db-table-row">
                      <td className="db-table-name">{c.name}</td>
                      <td className="db-table-channel">{c.channel}</td>
                      <td>{c.budget}</td>
                      <td>
                        <div className="db-progress-wrapper">
                          <div className="db-progress-bar">
                            <div
                              className="db-progress-fill"
                              style={{
                                width: `${c.spent}%`,
                                opacity: c.status === 'completed' ? 0.5 : 1,
                              }}
                            />
                          </div>
                          <span className="db-progress-label">{c.spent}%</span>
                        </div>
                      </td>
                      <td className="db-table-roas">{c.roas}</td>
                      <td>
                        <StatusBadge status={c.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
