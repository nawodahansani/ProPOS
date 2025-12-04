"use client";

import { useEffect, useState, useMemo } from "react";
import ProtectedRoute from '@/components/ProtectedRoute';
import CustomerForm from "@/components/CustomerForm";
import { apiGet, apiDelete } from "@/lib/api";
import DeleteCustomerModal from "@/components/DeleteCustomerModal";
import { 
  UserGroupIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  UserCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowUpIcon
} from "@heroicons/react/24/outline";
import { UserIcon, EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/solid";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface ResponseDTO<T> {
  status: string;
  message: string;
  data: T;
}

function CustomersPageContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>(undefined);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 5;

  useEffect(() => {
    async function loadData() {
      try {
        const res: ResponseDTO<Customer[]> = await apiGet<ResponseDTO<Customer[]>>("/customers");
        setCustomers(res.data);
      } catch (err) {
        console.error("Failed to load customers", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter and sort customers
  const filteredAndSortedCustomers = useMemo(() => {
    return customers
      .filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
      )
      .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically by name
  }, [customers, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedCustomers.length / customersPerPage);
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredAndSortedCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  // Calculate stats
  const activeCustomers = useMemo(() => {
    // This would come from your API, for now we'll use a mock calculation
    return Math.floor(customers.length * 0.6); // 60% of customers are "active"
  }, [customers]);

  const avgOrdersPerCustomer = 3.2; // This would come from your API

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
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
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

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsOpen(true);
  };

  const handleDelete = (customer: Customer) => {
    setDeletingCustomer(customer);
  };

  const confirmDelete = async () => {
    if (!deletingCustomer) return;

    try {
      await apiDelete(`/customers/${deletingCustomer.id}`);
      setCustomers(customers.filter((c) => c.id !== deletingCustomer.id));
      setDeletingCustomer(undefined);
    } catch (err) {
      console.error("Failed to delete customer", err);
      alert("Failed to delete customer");
    }
  };

  const handleSubmit = (customer: Customer) => {
    if (editingCustomer) {
      setCustomers(customers.map((c) => (c.id === customer.id ? customer : c)));
      setEditingCustomer(undefined);
    } else {
      setCustomers([...customers, customer]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600 mt-1">Manage your customer database and relationships</p>
        </div>
        <button
          onClick={() => {
            setEditingCustomer(undefined);
            setIsOpen(true);
          }}
          className="btn-primary flex items-center gap-2 self-start"
        >
          <PlusIcon className="w-5 h-5" />
          Add New Customer
        </button>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{customers.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <UserGroupIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-blue-200">
            <p className="text-xs text-blue-600 flex items-center gap-1">
              <ArrowUpIcon className="w-3 h-3" />
              +12% from last month
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active This Month</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{activeCustomers}</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-full">
              <UserIcon className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-emerald-200">
            <p className="text-xs text-emerald-600">Recent activity tracked</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Orders/Customer</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{avgOrdersPerCustomer}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-full">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-amber-200">
            <p className="text-xs text-amber-600">Loyalty metrics</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers by name, email, or phone..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
            <FunnelIcon className="w-5 h-5" />
            Filter
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">All Customers</h3>
            <p className="text-sm text-gray-600 mt-1">
              Showing {indexOfFirstCustomer + 1}-{Math.min(indexOfLastCustomer, filteredAndSortedCustomers.length)} of {filteredAndSortedCustomers.length} customers
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Sorted by: <span className="font-medium text-gray-700">Name (A-Z)</span>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-2">Loading customers...</p>
          </div>
        ) : filteredAndSortedCustomers.length === 0 ? (
          <div className="p-8 text-center">
            <UserCircleIcon className="w-12 h-12 text-gray-300 mx-auto" />
            <p className="text-gray-600 mt-2">No customers found</p>
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-3 inline-block text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear search
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditingCustomer(undefined);
                  setIsOpen(true);
                }}
                className="mt-3 inline-block text-blue-600 hover:text-blue-700 font-medium"
              >
                Add your first customer
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-4 text-sm font-medium text-gray-700">Customer</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">Contact Info</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">Customer ID</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                            {customer.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{customer.name}</p>
                            <p className="text-sm text-gray-500">Customer since 2024</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700">{customer.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <PhoneIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700">{customer.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          ID: {customer.id}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(customer)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors"
                          >
                            <PencilIcon className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(customer)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 transition-colors"
                          >
                            <TrashIcon className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredAndSortedCustomers.length > customersPerPage && (
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

      {/* Customer Form Modal */}
      <CustomerForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingCustomer}
      />

      {/* Delete Confirmation Modal */}
      <DeleteCustomerModal
        isOpen={!!deletingCustomer}
        customer={deletingCustomer}
        onClose={() => setDeletingCustomer(undefined)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default function CustomersPage() {
  return (
    <ProtectedRoute>
      <CustomersPageContent />
    </ProtectedRoute>
  );
}