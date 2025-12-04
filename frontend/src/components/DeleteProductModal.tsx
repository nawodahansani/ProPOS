// "use client";

// interface DeleteProductModalProps<T> {
//   isOpen: boolean;
//   onClose: () => void;
//   onConfirm: () => void;
//   item: T | null;
//   title?: string;
// }

// export default function DeleteProductModal<T>({
//   isOpen,
//   onClose,
//   onConfirm,
//   item,
//   title = "Are you sure you want to delete?",
// }: DeleteProductModalProps<T>) {
//   if (!isOpen || !item) return null;

//   return (
//     <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md animate-fadeIn">
//         <h2 className="text-xl font-semibold mb-4 text-red-600">{title}</h2>

//         <pre className="bg-gray-100 p-3 rounded mb-4 text-sm">{JSON.stringify(item, null, 2)}</pre>

//         <div className="flex justify-end gap-3">
//           <button
//             className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
//             onClick={onClose}
//           >
//             No
//           </button>
//           <button
//             className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
//             onClick={onConfirm}
//           >
//             Yes, Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { ExclamationTriangleIcon, XMarkIcon, CubeIcon } from "@heroicons/react/24/outline";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  item: Product | null;
  title?: string;
}

export default function DeleteProductModal({
  isOpen,
  onClose,
  onConfirm,
  item,
  title = "Delete Product",
}: DeleteProductModalProps) {
  if (!isOpen || !item) return null;

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
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
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
            <p className="text-red-700 font-medium mb-2">Warning: Product Deletion</p>
            <p className="text-red-600 text-sm">
              Deleting this product will remove it from inventory, orders, and sales records.
            </p>
          </div>

          {/* Product Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <CubeIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{item.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-700 rounded">ID: {item.id}</span>
                  <span className={`text-xs px-2 py-0.5 ${item.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'} rounded`}>
                    {item.stock === 0 ? 'Out of stock' : `${item.stock} units`}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pl-12">
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="font-medium text-gray-900">Rs. {item.price.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Stock Value</p>
                <p className="font-medium text-gray-900">Rs. {(item.price * item.stock).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Confirmation Text */}
          <div className="mb-6">
            <p className="text-gray-700">
              Are you sure you want to delete <span className="font-bold text-gray-900">{item.name}</span> from your product inventory?
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
              Delete Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}