import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Building2, 
  MessageSquare, 
  Star, 
  Settings, 
  Bell, 
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  LogOut,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  UserCheck,
  Percent,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Check,
  XCircle,
  MoreVertical,
  Send,
  Image,
  Phone,
  Mail,
  MapPin,
  Star as StarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  Home,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import { 
  dashboardStats, 
  revenueData, 
  categoryData, 
  products, 
  categories,
  orders, 
  users, 
  vendors, 
  messages, 
  reviews,
  settings 
} from './data/dummyData';

// Utility function for classNames
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// ============ COMPONENTS ============

// Sidebar Component
function Sidebar({ isOpen, setIsOpen, activePage }) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { id: 'products', icon: Package, label: 'Products', path: '/products' },
    { id: 'orders', icon: ShoppingCart, label: 'Orders', path: '/orders' },
    { id: 'users', icon: Users, label: 'Users', path: '/users' },
    { id: 'vendors', icon: Building2, label: 'Vendors', path: '/vendors' },
    { id: 'messages', icon: MessageSquare, label: 'Messages', path: '/messages' },
    { id: 'reviews', icon: Star, label: 'Reviews', path: '/reviews' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-200 transition-all duration-300",
        isOpen ? "w-64" : "w-0 lg:w-20",
        "lg:relative"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className={cn("font-bold text-lg text-gray-900", !isOpen && "lg:hidden")}>
                TradeHub
              </span>
            </Link>
            <button 
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                    isActive 
                      ? "bg-primary-50 text-primary-600" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className={cn("text-sm font-medium", !isOpen && "lg:hidden")}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40" 
                alt="Admin" 
                className="w-9 h-9 rounded-full object-cover"
              />
              <div className={cn("flex-1 min-w-0", !isOpen && "lg:hidden")}>
                <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
                <p className="text-xs text-gray-500 truncate">admin@tradehub.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// Navbar Component
function Navbar({ setSidebarOpen, activePage }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifications = [
    { id: 1, title: 'New Order', message: 'Order #ORD-001234 placed', time: '2 min ago', unread: true },
    { id: 2, title: 'New Vendor', message: 'TechWorld Inc. pending verification', time: '1 hour ago', unread: true },
    { id: 3, title: 'Review', message: 'New review on Wireless Headphones', time: '3 hours ago', unread: false },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 capitalize">
            {activePage}
          </h1>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
              className="relative p-2 hover:bg-gray-100 rounded-lg"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                {notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={cn(
                      "px-4 py-3 hover:bg-gray-50 cursor-pointer",
                      notif.unread && "bg-primary-50/50"
                    )}
                  >
                    <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                    <p className="text-xs text-gray-500">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                  </div>
                ))}
                <div className="px-4 py-2 border-t border-gray-100">
                  <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
            >
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32" 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover"
              />
              <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  My Profile
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <hr className="my-2" />
                <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// Card Component
function Card({ children, className = '' }) {
  return (
    <div className={cn("bg-white rounded-xl border border-gray-200 p-6", className)}>
      {children}
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, change, changeType, icon: Icon, prefix = '' }) {
  const isPositive = changeType === 'positive';
  
  return (
    <Card className="card-hover">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
        <div className="p-3 bg-primary-50 rounded-lg">
          <Icon className="w-6 h-6 text-primary-600" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1">
        {isPositive ? (
          <TrendingUp className="w-4 h-4 text-green-500" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-500" />
        )}
        <span className={cn("text-sm font-medium", isPositive ? "text-green-500" : "text-red-500")}>
          {Math.abs(change)}%
        </span>
        <span className="text-sm text-gray-400">vs last month</span>
      </div>
    </Card>
  );
}

// Modal Component
function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;
  
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className={cn("modal-content", sizes[size])} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

// Table Component
function Table({ columns, data, onRowClick }) {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className={col.headerClassName || ''}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr 
              key={rowIdx} 
              onClick={() => onRowClick && onRowClick(row)}
              className={cn(onRowClick && "cursor-pointer")}
            >
              {columns.map((col, colIdx) => (
                <td key={colIdx} className={col.cellClassName || ''}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Pagination Component
function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-b-xl">
      <p className="text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }) {
  const statusConfig = {
    active: { label: 'Active', className: 'badge-success' },
    inactive: { label: 'Inactive', className: 'badge-gray' },
    pending: { label: 'Pending', className: 'badge-warning' },
    verified: { label: 'Verified', className: 'badge-success' },
    processing: { label: 'Processing', className: 'badge-info' },
    shipped: { label: 'Shipped', className: 'badge-info' },
    delivered: { label: 'Delivered', className: 'badge-success' },
    cancelled: { label: 'Cancelled', className: 'badge-danger' },
    out_of_stock: { label: 'Out of Stock', className: 'badge-danger' },
    paid: { label: 'Paid', className: 'badge-success' },
    refunded: { label: 'Refunded', className: 'badge-warning' },
    approved: { label: 'Approved', className: 'badge-success' },
    rejected: { label: 'Rejected', className: 'badge-danger' },
    buyer: { label: 'Buyer', className: 'badge-info' },
    seller: { label: 'Seller', className: 'badge-warning' },
    suspended: { label: 'Suspended', className: 'badge-danger' },
  };

  const config = statusConfig[status] || { label: status, className: 'badge-gray' };

  return (
    <span className={cn("badge", config.className)}>
      {config.label}
    </span>
  );
}

// ============ PAGES ============

// Dashboard Page
function DashboardPage() {
  const [timeRange, setTimeRange] = useState('12m');

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={dashboardStats.totalRevenue} 
          change={dashboardStats.revenueChange}
          changeType="positive"
          icon={DollarSign}
          prefix="$"
        />
        <StatCard 
          title="Orders" 
          value={dashboardStats.ordersCount} 
          change={dashboardStats.ordersChange}
          changeType="positive"
          icon={ShoppingBag}
        />
        <StatCard 
          title="Active Users" 
          value={dashboardStats.activeUsers} 
          change={dashboardStats.usersChange}
          changeType="positive"
          icon={UserCheck}
        />
        <StatCard 
          title="Conversion Rate" 
          value={dashboardStats.conversionRate} 
          change={dashboardStats.conversionChange}
          changeType="negative"
          icon={Percent}
          prefix=""
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="12m">Last 12 months</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#0ea5e9" 
                  strokeWidth={2}
                  dot={{ fill: '#0ea5e9', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Distribution */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Category Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Share']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Orders Chart */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Orders by Month</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="orders" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent Orders */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          <Link to="/orders" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Order ID</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Products</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Total</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-primary-600">{order.id}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <img src={order.customer.avatar} alt="" className="w-8 h-8 rounded-full" />
                      <span className="text-sm text-gray-900">{order.customer.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {order.products.length} item{order.products.length > 1 ? 's' : ''}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">${order.total.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// Products Page
function ProductsPage() {
  const [productsData, setProductsData] = useState(products);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredProducts = productsData.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    {
      header: 'Product',
      key: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.image} alt={row.name} className="w-12 h-12 rounded-lg object-cover" />
          <div>
            <p className="font-medium text-gray-900">{row.name}</p>
            <p className="text-xs text-gray-500">SKU: {row.sku}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      key: 'category',
    },
    {
      header: 'Price',
      key: 'price',
      render: (row) => `$${row.price.toFixed(2)}`,
    },
    {
      header: 'Stock',
      key: 'stock',
      render: (row) => (
        <span className={cn(
          "font-medium",
          row.stock === 0 ? "text-red-600" : row.stock < 50 ? "text-yellow-600" : "text-green-600"
        )}>
          {row.stock}
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(row);
              setShowEditModal(true);
            }}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setProductsData(productsData.filter(p => p.id !== row.id));
            }}
            className="p-1.5 hover:bg-red-50 rounded-lg text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your product inventory</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input w-40"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input w-36"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Products Table */}
      <Card className="p-0 overflow-hidden">
        <Table 
          columns={columns} 
          data={paginatedProducts}
          onRowClick={(row) => {
            setSelectedProduct(row);
            setShowEditModal(true);
          }}
        />
        <Pagination 
          currentPage={currentPage}
          totalPages={Math.ceil(filteredProducts.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      </Card>

      {/* Add Product Modal */}
      <Modal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        title="Add New Product"
        size="lg"
      >
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input type="text" className="input" placeholder="Enter product name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input type="text" className="input" placeholder="Enter SKU" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select className="input">
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input type="number" className="input" placeholder="0.00" step="0.01" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input type="number" className="input" placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input type="text" className="input" placeholder="https://..." />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Product
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Product Modal */}
      <Modal 
        isOpen={showEditModal} 
        onClose={() => {
          setShowEditModal(false);
          setSelectedProduct(null);
        }} 
        title="Edit Product"
        size="lg"
      >
        {selectedProduct && (
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input type="text" className="input" defaultValue={selectedProduct.name} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <input type="text" className="input" defaultValue={selectedProduct.sku} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select className="input" defaultValue={selectedProduct.category}>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input type="number" className="input" defaultValue={selectedProduct.price} step="0.01" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input type="number" className="input" defaultValue={selectedProduct.stock} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select className="input" defaultValue={selectedProduct.status}>
                  <option value="active">Active</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={() => setShowEditModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

// Orders Page
function OrdersPage() {
  const [ordersData, setOrdersData] = useState(orders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredOrders = ordersData.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    {
      header: 'Order ID',
      key: 'id',
      render: (row) => (
        <span className="font-medium text-primary-600">{row.id}</span>
      ),
    },
    {
      header: 'Customer',
      key: 'customer',
      render: (row) => (
        <div className="flex items-center gap-2">
          <img src={row.customer.avatar} alt="" className="w-8 h-8 rounded-full" />
          <span className="text-sm text-gray-900">{row.customer.name}</span>
        </div>
      ),
    },
    {
      header: 'Items',
      key: 'products',
      render: (row) => (
        <span className="text-sm text-gray-600">
          {row.products.length} item{row.products.length > 1 ? 's' : ''}
        </span>
      ),
    },
    {
      header: 'Total',
      key: 'total',
      render: (row) => <span className="font-medium">${row.total.toFixed(2)}</span>,
    },
    {
      header: 'Payment',
      key: 'payment',
      render: (row) => <StatusBadge status={row.payment} />,
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Date',
      key: 'date',
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setSelectedOrder(row);
            setShowOrderModal(true);
          }}
          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  const updateOrderStatus = (orderId, newStatus) => {
    setOrdersData(ordersData.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    setShowOrderModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
        <p className="text-sm text-gray-500 mt-1">Manage and track customer orders</p>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input w-40"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </Card>

      {/* Orders Table */}
      <Card className="p-0 overflow-hidden">
        <Table 
          columns={columns} 
          data={paginatedOrders}
          onRowClick={(row) => {
            setSelectedOrder(row);
            setShowOrderModal(true);
          }}
        />
        <Pagination 
          currentPage={currentPage}
          totalPages={Math.ceil(filteredOrders.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      </Card>

      {/* Order Details Modal */}
      <Modal 
        isOpen={showOrderModal} 
        onClose={() => {
          setShowOrderModal(false);
          setSelectedOrder(null);
        }} 
        title="Order Details"
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Order Info */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{selectedOrder.id}</h4>
                <p className="text-sm text-gray-500">{selectedOrder.date}</p>
              </div>
              <StatusBadge status={selectedOrder.status} />
            </div>

            {/* Customer Info */}
            <div>
              <h5 className="text-sm font-semibold text-gray-500 uppercase mb-3">Customer</h5>
              <div className="flex items-center gap-3">
                <img src={selectedOrder.customer.avatar} alt="" className="w-12 h-12 rounded-full" />
                <div>
                  <p className="font-medium text-gray-900">{selectedOrder.customer.name}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.customer.email}</p>
                </div>
              </div>
            </div>

            {/* Products */}
            <div>
              <h5 className="text-sm font-semibold text-gray-500 uppercase mb-3">Products</h5>
              <div className="space-y-2">
                {selectedOrder.products.map((product, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
                    </div>
                    <p className="font-medium">${(product.price * product.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4 mt-4">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-xl font-bold text-primary-600">${selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h5 className="text-sm font-semibold text-gray-500 uppercase mb-3">Shipping Address</h5>
              <p className="text-gray-700">{selectedOrder.shippingAddress}</p>
            </div>

            {/* Update Status */}
            <div>
              <h5 className="text-sm font-semibold text-gray-500 uppercase mb-3">Update Status</h5>
              <div className="flex flex-wrap gap-2">
                {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateOrderStatus(selectedOrder.id, status)}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-lg border transition-all",
                      selectedOrder.status === status
                        ? "bg-primary-50 border-primary-200 text-primary-700"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    <StatusBadge status={status} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// Users Page
function UsersPage() {
  const [usersData, setUsersData] = useState(users);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredUsers = usersData.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    {
      header: 'User',
      key: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.avatar} alt="" className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-medium text-gray-900">{row.name}</p>
            <p className="text-xs text-gray-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      key: 'role',
      render: (row) => <StatusBadge status={row.role} />,
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Joined',
      key: 'joinedDate',
    },
    {
      header: row => row.role === 'buyer' ? 'Total Orders' : 'Total Products',
      key: row => row.role === 'buyer' ? 'totalOrders' : 'totalProducts',
      render: (row) => row.role === 'buyer' ? row.totalOrders : row.totalProducts,
    },
    {
      header: row => row.role === 'buyer' ? 'Total Spent' : 'Total Sales',
      key: row => row.role === 'buyer' ? 'totalSpent' : 'totalSales',
      render: (row) => row.role === 'buyer' 
        ? `$${row.totalSpent.toFixed(2)}`
        : `$${row.totalSales.toLocaleString()}`,
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600">
            <Eye className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setUsersData(usersData.map(u => 
                u.id === row.id 
                  ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' }
                  : u
              ));
            }}
            className={cn(
              "p-1.5 rounded-lg",
              row.status === 'active' 
                ? "hover:bg-red-50 text-red-600" 
                : "hover:bg-green-50 text-green-600"
            )}
          >
            {row.status === 'active' ? <XCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Users</h2>
        <p className="text-sm text-gray-500 mt-1">Manage buyers and sellers</p>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="input w-36"
          >
            <option value="all">All Roles</option>
            <option value="buyer">Buyers</option>
            <option value="seller">Sellers</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input w-36"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="p-0 overflow-hidden">
        <Table columns={columns} data={paginatedUsers} />
        <Pagination 
          currentPage={currentPage}
          totalPages={Math.ceil(filteredUsers.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      </Card>
    </div>
  );
}

// Vendors Page
function VendorsPage() {
  const [vendorsData, setVendorsData] = useState(vendors);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredVendors = vendorsData.filter(vendor => {
    const matchesSearch = vendor.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vendor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedVendors = filteredVendors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    {
      header: 'Company',
      key: 'companyName',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.avatar} alt="" className="w-10 h-10 rounded-lg" />
          <div>
            <p className="font-medium text-gray-900">{row.companyName}</p>
            <p className="text-xs text-gray-500">{row.category}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Contact',
      key: 'contactPerson',
      render: (row) => (
        <div>
          <p className="text-sm text-gray-900">{row.contactPerson}</p>
          <p className="text-xs text-gray-500">{row.email}</p>
        </div>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Rating',
      key: 'rating',
      render: (row) => (
        <div className="flex items-center gap-1">
          <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium">{row.rating}</span>
        </div>
      ),
    },
    {
      header: 'Products',
      key: 'totalProducts',
    },
    {
      header: 'Sales',
      key: 'totalSales',
      render: (row) => `$${row.totalSales.toLocaleString()}`,
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setSelectedVendor(row);
            setShowVendorModal(true);
          }}
          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  const verifyVendor = (vendorId) => {
    setVendorsData(vendorsData.map(v => 
      v.id === vendorId 
        ? { ...v, status: 'verified', verifiedAt: new Date().toISOString().split('T')[0] }
        : v
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Vendors</h2>
        <p className="text-sm text-gray-500 mt-1">Manage supplier accounts and verification</p>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input w-40"
          >
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </Card>

      {/* Vendors Table */}
      <Card className="p-0 overflow-hidden">
        <Table 
          columns={columns} 
          data={paginatedVendors}
          onRowClick={(row) => {
            setSelectedVendor(row);
            setShowVendorModal(true);
          }}
        />
        <Pagination 
          currentPage={currentPage}
          totalPages={Math.ceil(filteredVendors.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      </Card>

      {/* Vendor Details Modal */}
      <Modal 
        isOpen={showVendorModal} 
        onClose={() => {
          setShowVendorModal(false);
          setSelectedVendor(null);
        }} 
        title="Vendor Details"
        size="lg"
      >
        {selectedVendor && (
          <div className="space-y-6">
            {/* Company Info */}
            <div className="flex items-start gap-4">
              <img src={selectedVendor.avatar} alt="" className="w-16 h-16 rounded-xl" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-900">{selectedVendor.companyName}</h4>
                  <StatusBadge status={selectedVendor.status} />
                </div>
                <p className="text-sm text-gray-500 mt-1">{selectedVendor.category}</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <UserCheck className="w-4 h-4" />
                <span className="text-sm">{selectedVendor.contactPerson}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{selectedVendor.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span className="text-sm">{selectedVendor.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{selectedVendor.address}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-gray-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{selectedVendor.totalProducts}</p>
                <p className="text-sm text-gray-500">Products</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">${selectedVendor.totalSales.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Total Sales</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-2xl font-bold text-gray-900">{selectedVendor.rating}</span>
                </div>
                <p className="text-sm text-gray-500">Rating</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h5 className="text-sm font-semibold text-gray-500 uppercase mb-2">Description</h5>
              <p className="text-gray-700">{selectedVendor.description}</p>
            </div>

            {/* Actions */}
            {selectedVendor.status === 'pending' && (
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => verifyVendor(selectedVendor.id)}
                  className="btn btn-primary flex-1"
                >
                  <Check className="w-4 h-4" />
                  Verify Vendor
                </button>
                <button className="btn btn-danger flex-1">
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

// Messages Page
function MessagesPage() {
  const [messagesData, setMessagesData] = useState(messages);
  const [selectedMessage, setSelectedMessage] = useState(messages[0]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const updatedMessages = messagesData.map(m => {
      if (m.id === selectedMessage.id) {
        return {
          ...m,
          messages: [
            ...m.messages,
            {
              id: m.messages.length + 1,
              sender: 'You',
              content: newMessage,
              time: 'Just now',
              isOwn: true,
            }
          ]
        };
      }
      return m;
    });
    
    setMessagesData(updatedMessages);
    setSelectedMessage(updatedMessages.find(m => m.id === selectedMessage.id));
    setNewMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
        <p className="text-sm text-gray-500 mt-1">Communicate with customers and vendors</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
        {/* Message List */}
        <Card className="lg:col-span-1 p-0 overflow-hidden">
          <div className="h-full overflow-y-auto">
            {messagesData.map((message) => (
              <div
                key={message.id}
                onClick={() => setSelectedMessage(message)}
                className={cn(
                  "flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100",
                  selectedMessage?.id === message.id && "bg-primary-50"
                )}
              >
                <div className="relative">
                  <img src={message.sender.avatar} alt="" className="w-10 h-10 rounded-full" />
                  {message.unread && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-primary-500 rounded-full border-2 border-white"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={cn("text-sm font-medium truncate", message.unread && "text-gray-900")}>
                      {message.sender.name}
                    </p>
                    <span className="text-xs text-gray-400">{message.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{message.subject}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{message.preview}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Message Thread */}
        <Card className="lg:col-span-2 p-0 flex flex-col">
          {/* Thread Header */}
          {selectedMessage && (
            <>
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <img src={selectedMessage.sender.avatar} alt="" className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-medium text-gray-900">{selectedMessage.sender.name}</p>
                    <p className="text-sm text-gray-500">{selectedMessage.subject}</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedMessage.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex",
                      msg.isOwn ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[70%] rounded-2xl px-4 py-2",
                        msg.isOwn
                          ? "bg-primary-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      )}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className={cn(
                        "text-xs mt-1",
                        msg.isOwn ? "text-primary-200" : "text-gray-400"
                      )}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                    <Image className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 input"
                  />
                  <button 
                    onClick={sendMessage}
                    className="btn btn-primary"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

// Reviews Page
function ReviewsPage() {
  const [reviewsData, setReviewsData] = useState(reviews);
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredReviews = reviewsData.filter(review => {
    return statusFilter === 'all' || review.status === statusFilter;
  });

  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const updateReviewStatus = (reviewId, newStatus) => {
    setReviewsData(reviewsData.map(r => 
      r.id === reviewId ? { ...r, status: newStatus } : r
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
        <p className="text-sm text-gray-500 mt-1">Manage product reviews and ratings</p>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input w-40"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {paginatedReviews.map((review) => (
          <Card key={review.id} className="card-hover">
            <div className="flex flex-col lg:flex-row lg:items-start gap-4">
              {/* Product Image */}
              <img 
                src={review.product.image} 
                alt={review.product.name} 
                className="w-16 h-16 rounded-lg object-cover"
              />

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{review.product.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <img src={review.user.avatar} alt="" className="w-5 h-5 rounded-full" />
                      <span className="text-sm text-gray-500">{review.user.name}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-400">{review.date}</span>
                    </div>
                  </div>
                  <StatusBadge status={review.status} />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mt-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={cn(
                        "w-5 h-5",
                        star <= review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                      )}
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-1">({review.rating}/5)</span>
                </div>

                {/* Comment */}
                <p className="text-gray-600 mt-2">{review.comment}</p>

                {/* Actions */}
                {review.status === 'pending' && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => updateReviewStatus(review.id, 'approved')}
                      className="btn btn-primary text-sm py-1.5"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => updateReviewStatus(review.id, 'rejected')}
                      className="btn btn-danger text-sm py-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={Math.ceil(filteredReviews.length / itemsPerPage)}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

// Settings Page
function SettingsPage() {
  const [settingsData, setSettingsData] = useState(settings);
  const [activeTab, setActiveTab] = useState('store');

  const tabs = [
    { id: 'store', label: 'Store Settings', icon: Home },
    { id: 'payment', label: 'Payment', icon: DollarSign },
    { id: 'profile', label: 'Admin Profile', icon: UserCheck },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500 mt-1">Manage your store and account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <Card className="lg:col-span-1 p-2">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    activeTab === tab.id
                      ? "bg-primary-50 text-primary-600"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </Card>

        {/* Content */}
        <Card className="lg:col-span-3">
          {activeTab === 'store' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Store Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                  <input type="text" className="input" defaultValue={settingsData.store.name} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" className="input" defaultValue={settingsData.store.email} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="text" className="input" defaultValue={settingsData.store.phone} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                  <input type="text" className="input" defaultValue={settingsData.store.logo} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input type="text" className="input" defaultValue={settingsData.store.address} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="input" rows={3} defaultValue={settingsData.store.description} />
              </div>
              <button className="btn btn-primary">Save Changes</button>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Payment Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <select className="input" defaultValue={settingsData.payment.currency}>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                  <input type="number" className="input" defaultValue={settingsData.payment.taxRate} step="0.1" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Cost ($)</label>
                  <input type="number" className="input" defaultValue={settingsData.payment.shippingCost} step="0.01" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Free Shipping Threshold ($)</label>
                  <input type="number" className="input" defaultValue={settingsData.payment.freeShippingThreshold} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Methods</label>
                <div className="space-y-2">
                  {settingsData.payment.paymentMethods.map((method) => (
                    <label key={method} className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                      <span className="text-sm text-gray-700">{method}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button className="btn btn-primary">Save Changes</button>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Admin Profile</h3>
              <div className="flex items-center gap-4">
                <img 
                  src={settingsData.admin.avatar} 
                  alt={settingsData.admin.name} 
                  className="w-20 h-20 rounded-full"
                />
                <div>
                  <button className="btn btn-secondary text-sm">Change Photo</button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" className="input" defaultValue={settingsData.admin.name} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" className="input" defaultValue={settingsData.admin.email} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input type="text" className="input bg-gray-50" defaultValue={settingsData.admin.role} disabled />
                </div>
              </div>
              <button className="btn btn-primary">Update Profile</button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

// ============ MAIN APP ============

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getActivePage = () => {
    const path = location.pathname;
    if (path === '/') return 'dashboard';
    return path.replace('/', '');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        activePage={getActivePage()}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          setSidebarOpen={setSidebarOpen} 
          activePage={getActivePage()}
        />
        
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/vendors" element={<VendorsPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// Wrap with Router
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
