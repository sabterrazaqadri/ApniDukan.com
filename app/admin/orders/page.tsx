'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { logoutAdmin } from '../../../utils/adminAuth';
import { FiLogOut, FiPackage, FiRefreshCw, FiEye, FiCheck, FiX, FiCalendar } from 'react-icons/fi';
import { groq } from 'next-sanity';
import client from '@/sanity/lib/client';
import Image from 'next/image';
import { format } from 'date-fns';

interface OrderItem {
  _key: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  _id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  totalAmount: number;
  items: OrderItem[];
  status: 'pending' | 'completed' | 'cancelled';
  orderDate: string;
}

type TabType = 'all' | 'pending' | 'completed' | 'cancelled';
type DateFilterType = 'all' | 'today' | 'week' | 'month' | 'custom';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dateFilter, setDateFilter] = useState<DateFilterType>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showStatusConfirm, setShowStatusConfirm] = useState<{
    orderId: string;
    newStatus: 'completed' | 'cancelled';
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('adminAuthenticated');
      if (token !== 'true') {
        router.replace('/admin/login');
        return;
      }
      fetchOrders();
    }
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const result = await client.fetch(
        groq`*[_type == "order"] | order(orderDate desc) {
          _id,
          orderId,
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress,
          totalAmount,
          "orderItems": orderItems[] {
            _key,
            quantity,
            "product": product-> {
              _id,
              name,
              price,
              "imageUrl": image.asset->url
            }
          },
          status,
          orderDate
        }`
      );

      // Log the raw data for debugging
      console.log('Raw order data:', JSON.stringify(result, null, 2));

      const ordersWithFormattedItems = result.map((order: any) => {
        // Add debug logging
        console.log('Processing order:', order.orderId);
        console.log('Order items:', order.orderItems);

        return {
          ...order,
          items: Array.isArray(order.orderItems) 
            ? order.orderItems
                .filter((item: any) => item.product) // Filter out items with null products
                .map((item: any) => ({
                  _key: item._key,
                  name: item.product?.name || 'Product Not Found',
                  price: item.product?.price || 0,
                  quantity: item.quantity || 0,
                  image: item.product?.imageUrl || '/placeholder-image.jpg' // Use the resolved image URL
                }))
            : []
        };
      });

      setOrders(ordersWithFormattedItems);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    router.replace('/admin/login');
  };

  const updateOrderStatus = async (orderId: string, newStatus: 'completed' | 'cancelled') => {
    try {
      await client.patch(orderId).set({ status: newStatus }).commit();
      
      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      // Close confirmation modal
      setShowStatusConfirm(null);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getFilteredOrders = () => {
    let filtered = orders;

    // Status filter
    if (activeTab !== 'all') {
      filtered = filtered.filter(order => order.status === activeTab);
    }

    // Date filter
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    switch (dateFilter) {
      case 'today':
        filtered = filtered.filter(order => 
          new Date(order.orderDate).toDateString() === today.toDateString()
        );
        break;
      case 'week':
        filtered = filtered.filter(order => 
          new Date(order.orderDate) >= weekAgo
        );
        break;
      case 'month':
        filtered = filtered.filter(order => 
          new Date(order.orderDate) >= monthAgo
        );
        break;
      case 'custom':
        if (startDate && endDate) {
          filtered = filtered.filter(order => {
            const orderDate = new Date(order.orderDate);
            return orderDate >= new Date(startDate) && 
                   orderDate <= new Date(endDate);
          });
        }
        break;
    }

    return filtered;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50"
            >
              <span className="h-5 w-5">
                <FiRefreshCw />
              </span>
              <span>Refresh</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700"
            >
              <span className="h-5 w-5">
                <FiLogOut />
              </span>
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Status Tabs */}
          <div className="flex gap-4">
            {(['all', 'pending', 'completed', 'cancelled'] as TabType[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium rounded-lg ${
                  activeTab === tab
                    ? 'bg-pink-600 text-white'
                    : 'text-gray-600 hover:bg-pink-50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Date Filter */}
          <div className="flex gap-4 items-center">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as DateFilterType)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="custom">Custom Range</option>
            </select>

            {dateFilter === 'custom' && (
              <div className="flex gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300"
                />
              </div>
            )}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getFilteredOrders().map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {order.orderId}
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(order.orderDate), 'PPp')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{order.customerName}</div>
                    <div className="text-sm text-gray-500">{order.customerEmail}</div>
                    <div className="text-sm text-gray-500">{order.customerPhone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex -space-x-2 overflow-hidden">
                      {Array.isArray(order.items) && order.items.length > 0 ? (
                        order.items.map((item, index) => (
                          <div
                            key={item._key}
                            className="relative w-8 h-8 rounded-full border-2 border-white"
                            style={{ zIndex: order.items.length - index }}
                          >
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="rounded-full object-cover"
                            />
                          </div>
                        ))
                      ) : (
                        <span>No items</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {order.items ? order.items.length : 0} items
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      Rs{order.totalAmount.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <span className="h-5 w-5">
                          <FiEye />
                        </span>
                      </button>
                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={() => setShowStatusConfirm({
                              orderId: order._id,
                              newStatus: 'completed'
                            })}
                            className="text-green-600 hover:text-green-900"
                            title="Mark as Completed"
                          >
                            <span className="h-5 w-5">
                              <FiCheck />
                            </span>
                          </button>
                          <button
                            onClick={() => setShowStatusConfirm({
                              orderId: order._id,
                              newStatus: 'cancelled'
                            })}
                            className="text-red-600 hover:text-red-900"
                            title="Cancel Order"
                          >
                            <span className="h-5 w-5">
                              <FiX />
                            </span>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Order Details - {selectedOrder.orderId}
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <span className="h-6 w-6">
                      <FiX />
                    </span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="font-medium text-gray-900">Customer Information</h3>
                    <p className="text-gray-600">{selectedOrder.customerName}</p>
                    <p className="text-gray-600">{selectedOrder.customerEmail}</p>
                    <p className="text-gray-600">{selectedOrder.customerPhone}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Shipping Address</h3>
                    <p className="text-gray-600">{selectedOrder.shippingAddress}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium text-gray-900 mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((item) => (
                        <div
                          key={item._key}
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="relative h-16 w-16">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <p className="text-gray-600">
                              Rs{item.price.toFixed(2)} x {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              Rs{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 text-center py-4">No items found</div>
                    )}
                  </div>
                </div>

                <div className="border-t mt-6 pt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-900">Total Amount</h3>
                    <p className="text-xl font-bold text-gray-900">
                      Rs{selectedOrder.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Confirmation Modal */}
        {showStatusConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Confirm Status Change
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to mark this order as{' '}
                {showStatusConfirm.newStatus}?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowStatusConfirm(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updateOrderStatus(
                    showStatusConfirm.orderId,
                    showStatusConfirm.newStatus
                  )}
                  className={`px-4 py-2 text-white rounded-lg ${
                    showStatusConfirm.newStatus === 'completed'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
