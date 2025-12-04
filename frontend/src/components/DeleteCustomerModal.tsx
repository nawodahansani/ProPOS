// "use client";

// interface Customer {
//   id: number;
//   name: string;
//   email: string;
//   phone: string;
// }

// interface DeleteCustomerModalProps {
//   isOpen: boolean;
//   customer?: Customer;
//   onClose: () => void;
//   onConfirm: () => void;
// }

// export default function DeleteCustomerModal({ isOpen, customer, onClose, onConfirm }: DeleteCustomerModalProps) {
//   if (!isOpen || !customer) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-96 animate-fadeIn">
//         <h2 className="text-xl font-semibold text-red-600 mb-4">Delete Customer</h2>
//         <p className="mb-4">Are you sure you want to delete this customer?</p>

//         <div className="border p-3 rounded mb-4 bg-gray-50">
//           <p><strong>ID:</strong> {customer.id}</p>
//           <p><strong>Name:</strong> {customer.name}</p>
//           <p><strong>Email:</strong> {customer.email}</p>
//           <p><strong>Phone:</strong> {customer.phone}</p>
//         </div>

//         <div className="flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//           >
//             No
//           </button>
//           <button
//             onClick={onConfirm}
//             className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
//           >
//             Yes, Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { ExclamationTriangleIcon, XMarkIcon, UserIcon } from "@heroicons/react/24/outline";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface DeleteCustomerModalProps {
  isOpen: boolean;
  customer?: Customer;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteCustomerModal({ isOpen, customer, onClose, onConfirm }: DeleteCustomerModalProps) {
  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">
              <ExclamationTriangleIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Delete Customer</h2>
              <p className="text-sm text-gray-600">This action cannot be undone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
            <p className="text-red-700 font-medium mb-2">Warning: Customer Deletion</p>
            <p className="text-red-600 text-sm">
              Deleting this customer will remove all associated data and contact information.
            </p>
          </div>

          {/* Customer Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{customer.name}</p>
                <p className="text-sm text-gray-600">ID: {customer.id}</p>
              </div>
            </div>
            
            <div className="space-y-2 pl-12">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 w-16">Email:</span>
                <span className="text-sm text-gray-900">{customer.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 w-16">Phone:</span>
                <span className="text-sm text-gray-900">{customer.phone}</span>
              </div>
            </div>
          </div>

          {/* Confirmation Text */}
          <div className="mb-6">
            <p className="text-gray-700">
              Are you sure you want to delete <span className="font-bold text-gray-900">{customer.name}</span> from your customer database?
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md hover:from-red-700 hover:to-red-800 transition-all"
            >
              Delete Customer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}