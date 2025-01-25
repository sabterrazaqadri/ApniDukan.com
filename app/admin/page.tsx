/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */  

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
}

interface Order {
  id: string;
  customer: CustomerDetails;
  items: OrderItem[];
  total: number;
  orderDate: string;
  status: 'pending' | 'completed' | 'returned';
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'returned'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const loadOrders = () => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders).map((order: any) => ({
        ...order,
        id: order.id || Math.random().toString(36).substr(2, 9),
        status: order.status || 'pending'
      }));
      setOrders(parsedOrders);
      localStorage.setItem('orders', JSON.stringify(parsedOrders));
    }
  };

  const checkAuth = () => {
    const authStatus = localStorage.getItem('adminAuthenticated');
    if (authStatus !== 'true') {
      router.replace('/admin/login');
    } else {
      setIsAuthenticated(true);
      loadOrders();
    }
    setIsLoading(false);
  };

  // useEffect(() => {
  //   checkAuth();
  // }, [router] );

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    router.replace('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const updateOrderStatus = (orderId: string, newStatus: 'pending' | 'completed' | 'returned') => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const deleteOrder = (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      const updatedOrders = orders.filter(order => order.id !== orderId);
      setOrders(updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
    }
  };

  const getOrderStats = () => {
    const filteredOrders = getFilteredOrders();
    return {
      total: filteredOrders.length,
      completed: filteredOrders.filter(o => o.status === 'completed').length,
      pending: filteredOrders.filter(o => o.status === 'pending').length,
      returned: filteredOrders.filter(o => o.status === 'returned').length,
      totalRevenue: filteredOrders
        .filter(o => o.status === 'completed')
        .reduce((sum, order) => sum + order.total, 0)
    };
  };

  const isWithinDateRange = (date: string) => {
    const orderDate = new Date(date);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(today.getMonth() - 1);

    switch (dateFilter) {
      case 'today':
        return orderDate >= today;
      case 'week':
        return orderDate >= weekAgo;
      case 'month':
        return orderDate >= monthAgo;
      default:
        return true;
    }
  };

  const getFilteredOrders = () => {
    return orders
      .filter(order => filterStatus === 'all' || order.status === filterStatus)
      .filter(order => isWithinDateRange(order.orderDate))
      .sort((a, b) => {
        const dateA = new Date(a.orderDate).getTime();
        const dateB = new Date(b.orderDate).getTime();
        return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
      });
  };

  const stats = getOrderStats();
  const filteredOrders = getFilteredOrders();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Pending Orders</h3>
          <p className="mt-2 text-3xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Completed Orders</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Returned Orders</h3>
          <p className="mt-2 text-3xl font-bold text-red-600">{stats.returned}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="mt-2 text-3xl font-bold text-pink-600">Rs{stats.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Order Management</h2>
            <div className="flex space-x-4">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as any)}
                className="rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="returned">Returned</option>
              </select>
              <button
                onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                Sort {sortDirection === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.orderDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customer.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Rs{order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="returned">Returned</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-pink-600 hover:text-pink-900 mr-4"
                      >
                        View
                      </button>
                      <button
                        onClick={() => deleteOrder(order.id)}
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
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900">Customer Information</h3>
                <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedOrder.customer.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedOrder.customer.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedOrder.customer.phone}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Address</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedOrder.customer.address}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">City</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedOrder.customer.city}</dd>
                  </div>
                  {selectedOrder.customer.notes && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Notes</dt>
                      <dd className="mt-1 text-sm text-gray-900">{selectedOrder.customer.notes}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
                <ul className="mt-2 divide-y divide-gray-200">
                  {selectedOrder.items.map((item, index) => (
                    <li key={index} className="py-3 flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        Rs{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex justify-between border-t pt-4">
                  <p className="text-base font-medium text-gray-900">Total</p>
                  <p className="text-base font-medium text-pink-600">
                    Rs{selectedOrder.total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
