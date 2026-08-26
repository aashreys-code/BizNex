import { useState } from 'react'
import { motion } from 'motion/react'
import {
  Users, FileText, TrendingUp, Search, Download,
  Shield, Settings, BarChart3, Plus, Edit, Trash2,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from 'recharts'
import { ScrollReveal, GlowCard, CountUp } from '../../components/react-bits'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import TextArea from '../../components/ui/TextArea'

const dashboardStats = [
  { label: 'Total Users', value: 1250, icon: Users, color: 'text-primary-400', bg: 'bg-primary-500/20' },
  { label: 'Reports Generated', value: 3840, icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  { label: 'Loan Applications', value: 520, icon: TrendingUp, color: 'text-accent-400', bg: 'bg-accent-500/20' },
  { label: 'Popular Categories', value: 15, icon: Search, color: 'text-purple-400', bg: 'bg-purple-500/20' },
]

const userActivityData = [
  { month: 'Jan', users: 200, reports: 450 },
  { month: 'Feb', users: 350, reports: 680 },
  { month: 'Mar', users: 500, reports: 920 },
  { month: 'Apr', users: 720, reports: 1200 },
  { month: 'May', users: 950, reports: 2100 },
  { month: 'Jun', users: 1250, reports: 3840 },
]

const popularCategoriesData = [
  { category: 'Dairy Farm', count: 320 },
  { category: 'Grocery Store', count: 280 },
  { category: 'Tailoring', count: 210 },
  { category: 'Food Processing', count: 180 },
  { category: 'Agriculture', count: 150 },
]

const mockUsers = [
  { id: 1, name: 'Priya Sharma', email: 'priya@email.com', village: 'Jaipur', state: 'Rajasthan', role: 'user' },
  { id: 2, name: 'Ravi Kumar', email: 'ravi@email.com', village: 'Anantapur', state: 'AP', role: 'user' },
  { id: 3, name: 'Sunita Devi', email: 'sunita@email.com', village: 'Patna', state: 'Bihar', role: 'user' },
  { id: 4, name: 'Amit Singh', email: 'amit@email.com', village: 'Lucknow', state: 'UP', role: 'admin' },
]

const mockSchemes = [
  { id: 1, name: 'PMEGP', status: 'active', applications: 120 },
  { id: 2, name: 'MUDRA Loan', status: 'active', applications: 250 },
  { id: 3, name: 'Stand-Up India', status: 'active', applications: 80 },
  { id: 4, name: 'PM SVANidhi', status: 'active', applications: 70 },
]

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'schemes' | 'prompts'>('overview')
  const [showAddScheme, setShowAddScheme] = useState(false)

  const tabs = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'users', label: 'Users', icon: Users },
    { key: 'schemes', label: 'Schemes', icon: Shield },
    { key: 'prompts', label: 'AI Prompts', icon: Settings },
  ] as const

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <ScrollReveal>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500 to-red-500 flex items-center justify-center">
              <Shield size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
              <p className="text-gray-400 text-sm">Manage users, schemes, and analytics</p>
            </div>
          </div>
          <Button variant="secondary" size="sm">
            <Download size={16} />
            Export Data
          </Button>
        </div>
      </ScrollReveal>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {dashboardStats.map((stat, i) => (
              <GlowCard key={i} className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon size={20} className={stat.color} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">{stat.label}</p>
                    <p className={`text-xl font-bold ${stat.color}`}>
                      <CountUp to={stat.value} duration={2} />
                    </p>
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">User Growth</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={userActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  />
                  <Line type="monotone" dataKey="users" stroke="#22c55e" strokeWidth={2} name="Users" />
                  <Line type="monotone" dataKey="reports" stroke="#f97316" strokeWidth={2} name="Reports" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">Popular Categories</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={popularCategoriesData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis type="number" stroke="#64748b" />
                  <YAxis dataKey="category" type="category" stroke="#64748b" fontSize={12} width={100} />
                  <Tooltip
                    contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">User Management</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Village</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">State</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Role</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.map((user) => (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4 text-white font-medium">{user.name}</td>
                      <td className="py-3 px-4 text-gray-300">{user.email}</td>
                      <td className="py-3 px-4 text-gray-300">{user.village}</td>
                      <td className="py-3 px-4 text-gray-300">{user.state}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          user.role === 'admin' ? 'bg-accent-500/20 text-accent-400' : 'bg-primary-500/20 text-primary-400'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button className="p-1 text-gray-400 hover:text-primary-400">
                            <Edit size={14} />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-400">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Schemes Tab */}
      {activeTab === 'schemes' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Scheme Management</h3>
              <Button size="sm" onClick={() => setShowAddScheme(true)}>
                <Plus size={16} />
                Add Scheme
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Scheme Name</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Applications</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockSchemes.map((scheme) => (
                    <tr key={scheme.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4 text-white font-medium">{scheme.name}</td>
                      <td className="py-3 px-4">
                        <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                          {scheme.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-300">{scheme.applications}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button className="p-1 text-gray-400 hover:text-primary-400">
                            <Edit size={14} />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-400">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Modal isOpen={showAddScheme} onClose={() => setShowAddScheme(false)} title="Add Government Scheme" size="lg">
            <div className="space-y-4">
              <Input label="Scheme Name" placeholder="e.g., PMEGP" />
              <TextArea label="Eligibility Criteria" placeholder="Describe eligibility..." />
              <TextArea label="Benefits" placeholder="Describe benefits..." />
              <Input label="Maximum Loan Amount" placeholder="e.g., ₹25 Lakh" />
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="secondary" onClick={() => setShowAddScheme(false)}>Cancel</Button>
                <Button onClick={() => setShowAddScheme(false)}>Save Scheme</Button>
              </div>
            </div>
          </Modal>
        </motion.div>
      )}

      {/* AI Prompts Tab */}
      {activeTab === 'prompts' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">AI Prompt Management</h3>
            <div className="space-y-4">
              {[
                { name: 'Market Analysis', prompt: 'Analyze market demand for the given business in the specified location...' },
                { name: 'Business Plan', prompt: 'Generate a comprehensive business plan for a rural Indian entrepreneur...' },
                { name: 'Scheme Recommender', prompt: 'Based on the user profile, recommend government schemes...' },
                { name: 'Loan Calculator', prompt: 'Calculate loan eligibility based on financial profile...' },
              ].map((item, i) => (
                <div key={i} className="p-4 glass rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">{item.name}</h4>
                    <button className="text-sm text-primary-400 hover:text-primary-300">
                      <Edit size={14} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2">{item.prompt}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
