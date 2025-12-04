"use client";

import { useEffect, useState, useMemo } from "react";
import ProtectedRoute from '@/components/ProtectedRoute';
import ProductForm from "@/components/ProductForm";
import { apiGet, apiDelete } from "@/lib/api";
import DeleteProductModal from "@/components/DeleteProductModal";
import { 
  CubeIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  ShoppingBagIcon, 
  CurrencyRupeeIcon, 
  MagnifyingGlassIcon, 
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowUpIcon
} from "@heroicons/react/24/outline";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

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

function ProductsPageContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, low-stock, out-of-stock
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

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

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             product.id.toString().includes(searchTerm);
        
        if (filter === "low-stock") return matchesSearch && product.stock > 0 && product.stock < 10;
        if (filter === "out-of-stock") return matchesSearch && product.stock === 0;
        return matchesSearch;
      })
      .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically by name
  }, [products, searchTerm, filter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredAndSortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Calculate stats
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock < 10).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

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

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filter]);

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
          <div className="mt-3 pt-3 border-t border-blue-200">
            <p className="text-xs text-blue-600 flex items-center gap-1">
              <ArrowUpIcon className="w-3 h-3" />
              +8% from last month
            </p>
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
            <p className="text-sm text-gray-600 mt-1">
              Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredAndSortedProducts.length)} of {filteredAndSortedProducts.length} products
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Sorted by: <span className="font-medium text-gray-700">Name (A-Z)</span>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-2">Loading products...</p>
          </div>
        ) : filteredAndSortedProducts.length === 0 ? (
          <div className="p-8 text-center">
            <CubeIcon className="w-12 h-12 text-gray-300 mx-auto" />
            <p className="text-gray-600 mt-2">No products found</p>
            {searchTerm || filter !== "all" ? (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilter("all");
                }}
                className="mt-3 inline-block text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear filters
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsOpen(true);
                }}
                className="mt-3 inline-block text-blue-600 hover:text-blue-700 font-medium"
              >
                Add your first product
              </button>
            )}
          </div>
        ) : (
          <>
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
                  {currentProducts.map((product) => {
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

            {/* Pagination */}
            {filteredAndSortedProducts.length > productsPerPage && (
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

      {/* Product Form Modal */}
      <ProductForm
        key={editingProduct ? `edit-${editingProduct.id}` : "new-product"}
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

export default function ProductsPage() {
  return (
    <ProtectedRoute>
      <ProductsPageContent />
    </ProtectedRoute>
  );
}