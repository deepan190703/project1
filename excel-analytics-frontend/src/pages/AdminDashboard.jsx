import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAnalyses: 0,
    recentAnalyses: [],
    userStats: { totalUsers: 0, adminUsers: 0, regularUsers: 0 }
  })
  const [users, setUsers] = useState([])
  const [analyses, setAnalyses] = useState([])
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard')
      return
    }
    
    fetchStats()
    fetchUsers()
    fetchAnalyses()
  }, [user, navigate])

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users')
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchAnalyses = async () => {
    try {
      const response = await api.get('/admin/analyses')
      setAnalyses(response.data)
    } catch (error) {
      console.error('Error fetching analyses:', error)
    }
  }

  const updateUserRole = async (userId, newRole) => {
    try {
      await api.patch(`/admin/users/${userId}/role`, { role: newRole })
      fetchUsers()
    } catch (error) {
      console.error('Error updating user role:', error)
    }
  }

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${userId}`)
        fetchUsers()
        fetchStats()
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">System administration and user management</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-secondary"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('analyses')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analyses'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Analyses
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Users</h3>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
                </div>
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Analyses</h3>
                  <p className="text-3xl font-bold text-green-600">{stats.totalAnalyses}</p>
                </div>
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Admin Users</h3>
                  <p className="text-3xl font-bold text-purple-600">{stats.userStats.adminUsers}</p>
                </div>
              </div>

              {/* Recent Analyses */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Analyses</h3>
                {stats.recentAnalyses.length === 0 ? (
                  <p className="text-gray-500">No analyses yet</p>
                ) : (
                  <div className="space-y-4">
                    {stats.recentAnalyses.map((analysis) => (
                      <div
                        key={analysis._id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium">{analysis.originalName}</h4>
                          <p className="text-sm text-gray-500">
                            by {analysis.userId?.name} • {new Date(analysis.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {analysis.rowCount} rows
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">User Management</h3>
              {users.length === 0 ? (
                <p className="text-gray-500">No users found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={user.role}
                              onChange={(e) => updateUserRole(user._id, e.target.value)}
                              className="text-sm border-gray-300 rounded-md"
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => deleteUser(user._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'analyses' && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">All Analyses</h3>
              {analyses.length === 0 ? (
                <p className="text-gray-500">No analyses found</p>
              ) : (
                <div className="space-y-4">
                  {analyses.map((analysis) => (
                    <div
                      key={analysis._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{analysis.originalName}</h4>
                        <p className="text-sm text-gray-500">
                          by {analysis.userId?.name} • {analysis.rowCount} rows, {analysis.columns.length} columns
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(analysis.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard