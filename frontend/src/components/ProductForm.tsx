"use client";

import { useEffect, useState } from "react";
import { apiPost, apiPut } from "@/lib/api";
import { XMarkIcon, TagIcon, CurrencyRupeeIcon, CubeIcon } from "@heroicons/react/24/outline";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Product) => void;
  initialData?: Product;
}

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

export default function ProductForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: ProductFormProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<string>("0");
  const [stock, setStock] = useState<string>("0");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPrice(initialData.price.toString());
      setStock(initialData.stock.toString());
    } else {
      setName("");
      setPrice("0");
      setStock("0");
    }
  }, [initialData, isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = { 
        name, 
        price: parseFloat(price), 
        stock: parseInt(stock) 
      };

      let res: ResponseDTO<Product>;

      if (initialData) {
        res = await apiPut(`/products/${initialData.id}`, productData);
      } else {
        res = await apiPost("/products", productData);
      }

      onSubmit(res.data);
      onClose();
    } catch (err) {
      console.error("Product save/update failed", err);
      alert("Error saving product");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

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
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg">
              <CubeIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {initialData ? "Edit Product" : "New Product"}
              </h2>
              <p className="text-sm text-gray-600">
                {initialData ? "Update product details" : "Add a new product to inventory"}
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
          {/* Product Name */}
          <div>
            <label className="text-sm font-medium text-gray-900 mb-1.5 flex items-center gap-2">
              <TagIcon className="w-4 h-4 text-gray-400" />
              Product Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label className="text-sm font-medium text-gray-900 mb-1.5 flex items-center gap-2">
                <CurrencyRupeeIcon className="w-4 h-4 text-gray-400" />
                Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rs.</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Stock Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                Stock Quantity
              </label>
              <input
                type="number"
                min="0"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                placeholder="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Preview Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-900 mb-2">Preview</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{name || "Product Name"}</p>
                <p className="text-sm text-gray-600">{stock || "0"} units in stock</p>
              </div>
              <div className="text-lg font-bold text-emerald-600">
                Rs. {parseFloat(price).toFixed(2) || "0.00"}
              </div>
            </div>
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
              style={{ background: 'linear-gradient(to right, #10b981, #059669)' }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {initialData ? "Updating..." : "Creating..."}
                </>
              ) : initialData ? (
                "Update Product"
              ) : (
                "Create Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}