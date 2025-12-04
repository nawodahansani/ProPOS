"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { apiGet } from "@/lib/api";
import { 
  ShoppingBagIcon, 
  MagnifyingGlassIcon, 
  PlusIcon,
  CurrencyRupeeIcon,
  UserIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import { ArrowUpIcon } from "@heroicons/react/24/solid";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Order {
  id: number;
  customer_id: number;
  total: number;
  created_at: string;
  items: Array<{
    id: number;
    product_id: number;
    quantity: number;
    price: number;
  }>;
}

interface ResponseDTO<T> {
  status: string;
  message: string;
  data: T;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    async function loadData() {
      try {
        // Load both orders and customers
        const [ordersRes, customersRes] = await Promise.all([
          apiGet<ResponseDTO<Order[]>>("/orders"),
          apiGet<ResponseDTO<Customer[]>>("/customers")
        ]);
        setOrders(ordersRes.data);
        setCustomers(customersRes.data);
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Find customer name by ID
  const getCustomerName = (customerId: number) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : "Unknown Customer";
  };

  // Find customer details by ID
  const getCustomerDetails = (customerId: number) => {
    return customers.find(c => c.id === customerId);
  };

  // Sort orders by date (newest first) and filter by search term
  const filteredAndSortedOrders = useMemo(() => {
    return orders
      .filter(order => {
        const customerName = getCustomerName(order.customer_id);
        const matchesSearch = 
          customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id.toString().includes(searchTerm);
        
        return matchesSearch;
      })
      .sort((a, b) => {
        // Sort by created_at descending (newest first)
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [orders, customers, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredAndSortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Calculate totals for stats
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = orders.length > 0 
    ? orders.reduce((sum, o) => sum + o.total, 0) / orders.length 
    : 0;

  // Calculate items count from items array
  const getItemsCount = (order: Order) => {
    return order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // Pagination controls
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 3;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show limited pages with ellipsis
      if (currentPage <= 2) {
        pageNumbers.push(1, 2, 3);
      } else if (currentPage >= totalPages - 1) {
        pageNumbers.push(totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
      }
    }
    
    return pageNumbers;
  };

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-1">View and track customer orders</p>
        </div>
        <Link 
          href="/orders/create"
          className="btn-primary flex items-center gap-2 self-start"
        >
          <PlusIcon className="w-5 h-5" />
          New Order
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{orders.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <ShoppingBagIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">Rs. {totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-full">
              <CurrencyRupeeIcon className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-emerald-200">
            <p className="text-xs text-emerald-600 flex items-center gap-1">
              <ArrowUpIcon className="w-3 h-3" />
              +15% from last month
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-100 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Order Value</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">Rs. {avgOrderValue.toFixed(0)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders by ID or customer name..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Recent Orders</h3>
            <p className="text-sm text-gray-600 mt-1">
              Showing {indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, filteredAndSortedOrders.length)} of {filteredAndSortedOrders.length} orders
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Sorted by: <span className="font-medium text-gray-700">Date (Newest First)</span>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-2">Loading orders...</p>
          </div>
        ) : filteredAndSortedOrders.length === 0 ? (
          <div className="p-8 text-center">
            <ShoppingBagIcon className="w-12 h-12 text-gray-300 mx-auto" />
            <p className="text-gray-600 mt-2">No orders found</p>
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-3 inline-block text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear search
              </button>
            ) : (
              <Link 
                href="/orders/create"
                className="mt-3 inline-block text-blue-600 hover:text-blue-700 font-medium"
              >
                Create your first order
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-4 text-sm font-medium text-gray-700">Order ID</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">Customer</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">Date & Time</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">Items</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentOrders.map((order) => {
                    const customer = getCustomerDetails(order.customer_id);
                    
                    return (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="font-medium text-gray-900">#{order.id}</div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                              <UserIcon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {customer?.name || "Unknown Customer"}
                              </p>
                              <p className="text-sm text-gray-500">CID: {order.customer_id}</p>
                              {customer?.phone && (
                                <p className="text-xs text-gray-500">{customer.phone}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-gray-900">{formatDate(order.created_at)}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(order.created_at).getTime() > Date.now() - 24 * 60 * 60 * 1000 
                              ? "Today" 
                              : new Date(order.created_at).getTime() > Date.now() - 48 * 60 * 60 * 1000
                                ? "Yesterday"
                                : ""}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-gray-900">{getItemsCount(order)} items</div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <CurrencyRupeeIcon className="w-4 h-4 text-gray-600" />
                            <span className="font-bold text-gray-900">{order.total?.toLocaleString() || "0"}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredAndSortedOrders.length > ordersPerPage && (
              <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                    
                    {/* Show ellipsis if there are more pages */}
                    {totalPages > 3 && currentPage < totalPages - 1 && (
                      <span className="px-2 text-gray-500">...</span>
                    )}
                    
                    {/* Always show last page if not already shown */}
                    {totalPages > 3 && !getPageNumbers().includes(totalPages) && (
                      <button
                        onClick={() => goToPage(totalPages)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          currentPage === totalPages
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {totalPages}
                      </button>
                    )}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}