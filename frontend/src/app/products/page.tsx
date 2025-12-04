// "use client";

// import { useEffect, useState } from "react";
// import ProductForm from "@/components/ProductForm";
// import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
// import DeleteConfirmation from "@/components/DeleteProductModal";

// interface Product {
//   id: number;
//   name: string;
//   price: number;
//   stock: number;
// }

// interface ResponseDTO<T> {
//   status: string;
//   message: string;
//   data: T;
// }

// export default function ProductsPage() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

//   // Load products from backend
//   useEffect(() => {
//     async function loadProducts() {
//       try {
//         const res: ResponseDTO<Product[]> = await apiGet("/products");
//         setProducts(res.data);
//       } catch (err) {
//         console.error("Failed to load products", err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadProducts();
//   }, []);

//   const handleEdit = (p: Product) => {
//     setEditingProduct(p);
//     setIsOpen(true);
//   };

//    const handleDelete = (p: Product) => {
//     setDeleteProduct(p); // open delete modal
//   };

//   const confirmDelete = async () => {
//     if (!deleteProduct) return;
//     try {
//       await apiDelete(`/products/${deleteProduct.id}`);
//       setProducts(products.filter((prod) => prod.id !== deleteProduct.id));
//       setDeleteProduct(null);
//     } catch (err) {
//       console.error("Failed to delete product", err);
//       alert("Delete failed");
//     }
//   };

//   const handleSubmit = async (p: Product) => {
//     if (editingProduct) {
//       // Update
//       try {
//         const res: ResponseDTO<Product> = await apiPut(`/products/${editingProduct.id}`, {
//           name: p.name,
//           price: p.price,
//           stock: p.stock,
//         });
//         setProducts(products.map((prod) => (prod.id === editingProduct.id ? res.data : prod)));
//         setEditingProduct(null);
//       } catch (err) {
//         console.error("Update failed", err);
//         alert("Update failed");
//       }
//     } else {
//       // Create
//       setProducts((prev) => [...prev, p]);
//     }
//   };

//   return (
//     <div className="p-4">
//       {/* Header */}
//       <div className="flex justify-between mb-6">
//         <h1 className="text-2xl font-semibold text-black">Products</h1>
//         <button
//           onClick={() => {
//             setEditingProduct(null);
//             setIsOpen(true);
//           }}
//           className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-semibold shadow hover:bg-yellow-300 transition"
//         >
//           + Add New Product
//         </button>
//       </div>

//       {/* Loading */}
//       {loading && <p className="text-gray-500">Loading...</p>}

//       {/* Table */}
//       {!loading && (
//         <div className="overflow-x-auto">
//           <table className="w-full bg-white shadow rounded-lg">
//             <thead>
//               <tr className="bg-gray-900 text-white text-left">
//                 <th className="p-3">ID</th>
//                 <th className="p-3">Name</th>
//                 <th className="p-3">Price</th>
//                 <th className="p-3">Quantity</th>
//                 <th className="p-3">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {products.map((p) => (
//                 <tr key={p.id} className="border-b hover:bg-gray-50">
//                   <td className="p-3">{p.id}</td>
//                   <td className="p-3">{p.name}</td>
//                   <td className="p-3">Rs. {p.price.toFixed(2)}</td>
//                   <td className="p-3">{p.stock}</td>
//                   <td className="p-3 flex gap-2">
//                     <button
//                       className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
//                       onClick={() => handleEdit(p)}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
//                       onClick={() => handleDelete(p)}
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

//       {/* Product Modal */}
//       <ProductForm
//         isOpen={isOpen}
//         onClose={() => setIsOpen(false)}
//         onSubmit={handleSubmit}
//         initialData={editingProduct ?? undefined}
//       />

//       {/* Delete Confirmation Modal */}
//       <DeleteConfirmation
//         isOpen={!!deleteProduct}
//         item={deleteProduct}
//         onClose={() => setDeleteProduct(null)}
//         onConfirm={confirmDelete}
//         title="Are you sure you want to delete this product?"
//       />
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import ProductForm from "@/components/ProductForm";
import { apiGet, apiDelete } from "@/lib/api";
import DeleteProductModal from "@/components/DeleteProductModal";
import { CubeIcon, PlusIcon, PencilIcon, TrashIcon, ShoppingBagIcon, CurrencyRupeeIcon, MagnifyingGlassIcon, FunnelIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/outline";
import { TagIcon, ChartBarIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface ResponseDTO<T> {
  status: string;
  message: string;
  data: T;
}

export default function ProductsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, low-stock, out-of-stock

  useEffect(() => {
    async function loadProducts() {
      try {
        const res: ResponseDTO<Product[]> = await apiGet("/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.id.toString().includes(searchTerm);
    
    if (filter === "low-stock") return matchesSearch && product.stock > 0 && product.stock < 10;
    if (filter === "out-of-stock") return matchesSearch && product.stock === 0;
    return matchesSearch;
  });

  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock < 10).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  const handleEdit = (p: Product) => {
    setEditingProduct(p);
    setIsOpen(true);
  };

  const handleDelete = (p: Product) => {
    setDeleteProduct(p);
  };

  const confirmDelete = async () => {
    if (!deleteProduct) return;
    try {
      await apiDelete(`/products/${deleteProduct.id}`);
      setProducts(products.filter((prod) => prod.id !== deleteProduct.id));
      setDeleteProduct(null);
    } catch (err) {
      console.error("Failed to delete product", err);
      alert("Delete failed");
    }
  };

  const handleSubmit = (p: Product) => {
    if (editingProduct) {
      setProducts(products.map((prod) => (prod.id === editingProduct.id ? p : prod)));
      setEditingProduct(null);
    } else {
      setProducts([...products, p]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Inventory</h1>
          <p className="text-gray-600 mt-1">Manage your products, stock, and pricing</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setIsOpen(true);
          }}
          className="btn-primary flex items-center gap-2 self-start"
        >
          <PlusIcon className="w-5 h-5" />
          Add New Product
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{products.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <CubeIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Inventory Value</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">Rs. {totalValue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-full">
              <CurrencyRupeeIcon className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{lowStockCount}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-full">
              <ExclamationTriangleIcon className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-100 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{outOfStockCount}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <ShoppingBagIcon className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name or ID..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2.5 rounded-lg border transition-colors ${filter === "all" ? "bg-blue-50 border-blue-300 text-blue-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
            >
              All Products
            </button>
            <button
              onClick={() => setFilter("low-stock")}
              className={`px-4 py-2.5 rounded-lg border transition-colors flex items-center gap-2 ${filter === "low-stock" ? "bg-amber-50 border-amber-300 text-amber-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
            >
              <ExclamationTriangleIcon className="w-4 h-4" />
              Low Stock
            </button>
            <button
              onClick={() => setFilter("out-of-stock")}
              className={`px-4 py-2.5 rounded-lg border transition-colors flex items-center gap-2 ${filter === "out-of-stock" ? "bg-red-50 border-red-300 text-red-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
            >
              <ShoppingBagIcon className="w-4 h-4" />
              Out of Stock
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Product List</h3>
            <p className="text-sm text-gray-600 mt-1">{filteredProducts.length} products found</p>
          </div>
          <div className="text-sm text-gray-500">
            Sorted by: <span className="font-medium text-gray-700">Recent</span>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-2">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-8 text-center">
            <CubeIcon className="w-12 h-12 text-gray-300 mx-auto" />
            <p className="text-gray-600 mt-2">No products found</p>
            <button
              onClick={() => {
                setEditingProduct(null);
                setIsOpen(true);
              }}
              className="mt-3 text-blue-600 hover:text-blue-700 font-medium"
            >
              Add your first product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Product</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Price</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Stock Level</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Value</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => {
                  const stockValue = product.price * product.stock;
                  const stockStatus = product.stock === 0 ? "out" : product.stock < 10 ? "low" : "good";
                  
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <CubeIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">ID: {product.id}</span>
                              {stockStatus === "out" && (
                                <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded">Out of stock</span>
                              )}
                              {stockStatus === "low" && (
                                <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded">Low stock</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <CurrencyRupeeIcon className="w-4 h-4 text-gray-600" />
                          <span className="font-medium text-gray-900">{product.price.toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${stockStatus === "good" ? "bg-emerald-500" : stockStatus === "low" ? "bg-amber-500" : "bg-red-500"}`}
                                style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className={`font-medium ${stockStatus === "good" ? "text-emerald-700" : stockStatus === "low" ? "text-amber-700" : "text-red-700"}`}>
                            {product.stock} units
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-gray-900 font-medium">
                          Rs. {stockValue.toLocaleString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors"
                          >
                            <PencilIcon className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 transition-colors"
                          >
                            <TrashIcon className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing 1-{Math.min(10, filteredProducts.length)} of {filteredProducts.length} products
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

      {/* Product Form Modal */}
      <ProductForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingProduct ?? undefined}
      />

      {/* Delete Confirmation Modal */}
      <DeleteProductModal
        isOpen={!!deleteProduct}
        onClose={() => setDeleteProduct(null)}
        onConfirm={confirmDelete}
        item={deleteProduct}
        title="Delete Product"
      />
    </div>
  );
}