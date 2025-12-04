// "use client";

// import { useEffect, useState } from "react";
// import { apiPost, apiPut } from "@/lib/api"; // make sure you have apiPut for PUT requests

// interface CustomerFormProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (customer: Customer) => void;
//   initialData?: Customer; // optional for edit
// }

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

// export default function CustomerForm({ isOpen, onClose, onSubmit, initialData }: CustomerFormProps) {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (initialData) {
//       setName(initialData.name);
//       setEmail(initialData.email);
//       setPhone(initialData.phone);
//     } else {
//       setName("");
//       setEmail("");
//       setPhone("");
//     }
//   }, [initialData]);

//   if (!isOpen) return null;

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       let res: ResponseDTO<Customer>;

//       if (initialData) {
//         // update existing customer
//         res = await apiPut<ResponseDTO<Customer>>(`/customers/${initialData.id}`, {
//           name,
//           email,
//           phone
//         });
//       } else {
//         // create new customer
//         res = await apiPost<ResponseDTO<Customer>>("/customers", { name, email, phone });
//       }

//       onSubmit(res.data); // return the created/updated customer
//       onClose();
//     } catch (err) {
//       console.error("Failed to save customer", err);
//       alert("Failed to save customer");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-96 animate-fadeIn">
//         <h2 className="text-xl font-semibold text-blue-900 mb-4">
//           {initialData ? "Edit Customer" : "Add New Customer"}
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="text-sm">Full Name</label>
//             <input
//               type="text"
//               className="w-full p-2 border rounded mt-1"
//               placeholder="Enter name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <label className="text-sm">Email</label>
//             <input
//               type="email"
//               className="w-full p-2 border rounded mt-1"
//               placeholder="Enter email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <label className="text-sm">Phone</label>
//             <input
//               type="text"
//               className="w-full p-2 border rounded mt-1"
//               placeholder="Enter phone"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//               required
//             />
//           </div>

//           <div className="flex justify-end gap-3 mt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//             >
//               Cancel
//             </button>

//             <button
//               type="submit"
//               disabled={loading}
//               className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
//             >
//               {loading ? "Saving..." : initialData ? "Update Customer" : "Save Customer"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { apiPost, apiPut } from "@/lib/api";
import { XMarkIcon, UserIcon } from "@heroicons/react/24/outline";

interface CustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customer: Customer) => void;
  initialData?: Customer;
}

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

export default function CustomerForm({ isOpen, onClose, onSubmit, initialData }: CustomerFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setEmail(initialData.email);
      setPhone(initialData.phone);
    } else {
      setName("");
      setEmail("");
      setPhone("");
    }
  }, [initialData]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      let res: ResponseDTO<Customer>;

      if (initialData) {
        res = await apiPut<ResponseDTO<Customer>>(`/customers/${initialData.id}`, {
          name,
          email,
          phone
        });
      } else {
        res = await apiPost<ResponseDTO<Customer>>("/customers", { name, email, phone });
      }

      onSubmit(res.data);
      onClose();
    } catch (err) {
      console.error("Failed to save customer", err);
      alert("Failed to save customer");
    } finally {
      setLoading(false);
    }
  }

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
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
              <UserIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {initialData ? "Edit Customer" : "New Customer"}
              </h2>
              <p className="text-sm text-gray-600">
                {initialData ? "Update customer information" : "Add a new customer to your database"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter customer name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="customer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              Phone Number
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="+1 (555) 123-4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {initialData ? "Updating..." : "Creating..."}
                </>
              ) : initialData ? (
                "Update Customer"
              ) : (
                "Create Customer"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}