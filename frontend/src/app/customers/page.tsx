// "use client";

// import { useEffect, useState } from "react";
// import CustomerForm from "@/components/CustomerForm";
// import { apiGet, apiDelete } from "@/lib/api"; // make sure apiDelete exists
// import DeleteCustomerModal from "@/components/DeleteCustomerModal";

// interface Customer {
//   id: number;
//   name: string;
//   email: string;
//   phone: string;
// }

// interface ResponseDTO<T> {
//   status: string;
//   message: string;
//   data: T;
// }

// export default function CustomersPage() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>(undefined);
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [loading, setLoading] = useState(true);
//   // state for delete modal
//   const [deletingCustomer, setDeletingCustomer] = useState<Customer | undefined>(undefined);

//   useEffect(() => {
//     async function loadData() {
//       try {
//         const res: ResponseDTO<Customer[]> = await apiGet<ResponseDTO<Customer[]>>("/customers");
//         setCustomers(res.data);
//       } catch (err) {
//         console.error("Failed to load customers", err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     loadData();
//   }, []);

//   const handleEdit = (customer: Customer) => {
//     setEditingCustomer(customer);
//     setIsOpen(true);
//   };

//   const handleDelete = (customer: Customer) => {
//   setDeletingCustomer(customer); // open modal
// };

// // function to confirm deletion
// const confirmDelete = async () => {
//   if (!deletingCustomer) return;

//   try {
//     await apiDelete(`/customers/${deletingCustomer.id}`);
//     setCustomers(customers.filter((c) => c.id !== deletingCustomer.id));
//     setDeletingCustomer(undefined); // close modal
//   } catch (err) {
//     console.error("Failed to delete customer", err);
//     alert("Failed to delete customer");
//   }
// };

//   const handleSubmit = (customer: Customer) => {
//     if (editingCustomer) {
//       // update existing
//       setCustomers(customers.map((c) => (c.id === customer.id ? customer : c)));
//       setEditingCustomer(undefined);
//     } else {
//       // add new
//       setCustomers([...customers, customer]);
//     }
//   };

//   return (
//     <div className="p-4">
//       <div className="flex justify-between mb-6">
//         <h1 className="text-2xl font-semibold text-black">Customers</h1>
//         <button
//           onClick={() => {
//             setEditingCustomer(undefined);
//             setIsOpen(true);
//           }}
//           className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-semibold shadow hover:bg-yellow-300 transition"
//         >
//           + Add New Customer
//         </button>
//       </div>

//       {loading && <p className="text-gray-500">Loading...</p>}

//       {!loading && (
//         <div className="overflow-x-auto">
//           <table className="w-full bg-white shadow rounded-lg">
//             <thead>
//               <tr className="bg-gray-900 text-white text-left">
//                 <th className="p-3">ID</th>
//                 <th className="p-3">Name</th>
//                 <th className="p-3">Email</th>
//                 <th className="p-3">Phone</th>
//                 <th className="p-3">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {customers.map((c) => (
//                 <tr key={c.id} className="border-b hover:bg-gray-50">
//                   <td className="p-3">{c.id}</td>
//                   <td className="p-3">{c.name}</td>
//                   <td className="p-3">{c.email}</td>
//                   <td className="p-3">{c.phone}</td>
//                   <td className="p-3 flex gap-2">
//                     <button
//                       className="px-2 py-1 bg-blue-900 text-white rounded hover:bg-blue-800"
//                       onClick={() => handleEdit(c)}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-500"
//                       onClick={() => handleDelete(c)}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       <CustomerForm
//         isOpen={isOpen}
//         onClose={() => setIsOpen(false)}
//         onSubmit={handleSubmit}
//         initialData={editingCustomer}
//       />

//       <DeleteCustomerModal
//       isOpen={!!deletingCustomer}
//       customer={deletingCustomer}
//       onClose={() => setDeletingCustomer(undefined)}
//       onConfirm={confirmDelete}
// />

//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import CustomerForm from "@/components/CustomerForm";
import { apiGet, apiDelete } from "@/lib/api";
import DeleteCustomerModal from "@/components/DeleteCustomerModal";
import { UserGroupIcon, MagnifyingGlassIcon, FunnelIcon, PlusIcon, PencilIcon, TrashIcon, UserCircleIcon } from "@heroicons/react/24/outline";
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

export default function CustomersPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>(undefined);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

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
            <p className="text-xs text-blue-600">+12% from last month</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active This Month</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">24</p>
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
              <p className="text-2xl font-bold text-gray-900 mt-1">3.2</p>
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
        <div className="p-5 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">All Customers</h3>
          <p className="text-sm text-gray-600 mt-1">{filteredCustomers.length} customers found</p>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-2">Loading customers...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-8 text-center">
            <UserCircleIcon className="w-12 h-12 text-gray-300 mx-auto" />
            <p className="text-gray-600 mt-2">No customers found</p>
            <button
              onClick={() => {
                setEditingCustomer(undefined);
                setIsOpen(true);
              }}
              className="mt-3 text-blue-600 hover:text-blue-700 font-medium"
            >
              Add your first customer
            </button>
          </div>
        ) : (
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
                {filteredCustomers.map((customer) => (
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
        )}

        {/* Pagination */}
        {filteredCustomers.length > 0 && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing 1-{Math.min(10, filteredCustomers.length)} of {filteredCustomers.length} customers
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                1
              </button>
              <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
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