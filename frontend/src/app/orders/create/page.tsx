"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPost } from "@/lib/api";
import { 
  PlusIcon, 
  MinusIcon, 
  TrashIcon, 
  UserIcon,
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  ShoppingCartIcon,
  CurrencyRupeeIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

// Define correct types locally (remove the wrong import)
interface OrderItemRequest {
  product_id: number;
  quantity: number;
}

interface CreateOrderRequest {
  customer_id: number;
  items: OrderItemRequest[];
}

interface ResponseDTO<T> {
  status: string;
  message: string;
  data: T;
}

export default function CreateOrderPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchProduct, setSearchProduct] = useState("");
  const [searchCustomer, setSearchCustomer] = useState("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        // Load customers and products
        const [customersRes, productsRes] = await Promise.all([
          apiGet<ResponseDTO<Customer[]>>("/customers"),
          apiGet<ResponseDTO<Product[]>>("/products")
        ]);
        setCustomers(customersRes.data);
        setProducts(productsRes.data);
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter customers by name or phone
  const filteredCustomers = useMemo(() => {
    if (!searchCustomer.trim()) {
      return [];
    }
    
    const searchTerm = searchCustomer.toLowerCase();
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm)
    );
  }, [customers, searchCustomer]);

  // Filter available products
  const filteredProducts = useMemo(() => {
    if (!searchProduct.trim()) {
      return [];
    }
    
    return products.filter(product =>
      product.name.toLowerCase().includes(searchProduct.toLowerCase()) &&
      product.stock > 0
    );
  }, [products, searchProduct]);

  // Add product to order
  const addToOrder = (product: Product) => {
    setOrderItems(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        if (existing.quantity < product.stock) {
          return prev.map(item =>
            item.productId === product.id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                  total: (item.quantity + 1) * item.price
                }
              : item
          );
        }
        return prev;
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            total: product.price
          }
        ];
      }
    });
  };

  // Update item quantity
  const updateQuantity = (productId: number, change: number) => {
    setOrderItems(prev =>
      prev.map(item => {
        if (item.productId === productId) {
          const newQuantity = item.quantity + change;
          const product = products.find(p => p.id === productId);
          if (product && newQuantity >= 1 && newQuantity <= product.stock) {
            return {
              ...item,
              quantity: newQuantity,
              total: newQuantity * item.price
            };
          }
        }
        return item;
      })
    );
  };

  // Remove item from order
  const removeItem = (productId: number) => {
    setOrderItems(prev => prev.filter(item => item.productId !== productId));
  };

  // Calculate order totals
  const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.13; // 13% tax
  const total = subtotal + tax;

  // Clear customer search
  const clearCustomerSearch = () => {
    setSearchCustomer("");
    setSelectedCustomer(null);
  };

  // Clear product search
  const clearProductSearch = () => {
    setSearchProduct("");
  };

  // Handle order submission
  const handleSubmit = async () => {
    if (!selectedCustomer) {
      alert("Please select a customer");
      return;
    }
    if (orderItems.length === 0) {
      alert("Please add items to the order");
      return;
    }

    setSubmitting(true);
    try {
      // Prepare the order data in the exact format your backend expects
      const orderData: CreateOrderRequest = {
        customer_id: selectedCustomer.id,
        items: orderItems.map(item => ({
          product_id: item.productId,
          quantity: item.quantity
        }))
      };

      console.log("Sending order data to backend:", orderData);

      // Send the order to your Go backend
      const response = await apiPost<ResponseDTO<any>>("/orders", orderData);
      
      console.log("Backend response:", response);
      
      if (response.status === "success") {
        alert("Order created successfully!");
        router.push("/orders");
      } else {
        let errorMessage = response.message || "Failed to create order";
        
        if (typeof response.data === 'string' && response.data.includes("insufficient stock")) {
          errorMessage = "Insufficient stock for some products. Please check quantities.";
        } else if (typeof response.data === 'string' && response.data.includes("customer not found")) {
          errorMessage = "Customer not found. Please select a valid customer.";
        } else if (typeof response.data === 'string' && response.data.includes("product not found")) {
          errorMessage = "Some products are no longer available.";
        }
        
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      console.error("Failed to create order:", err);
      
      let userMessage = "Failed to create order";
      
      if (err.message.includes("insufficient stock")) {
        userMessage = "Some items don't have enough stock. Please reduce quantities and try again.";
      } else if (err.message.includes("not found")) {
        userMessage = "Some products or the customer are no longer available. Please refresh and try again.";
      } else if (err.message) {
        userMessage = err.message;
      }
      
      alert(userMessage);
      
      // Reload products to get updated stock
      try {
        const productsRes = await apiGet<ResponseDTO<Product[]>>("/products");
        setProducts(productsRes.data);
      } catch (refreshErr) {
        console.error("Failed to refresh products:", refreshErr);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/orders")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Order</h1>
              <p className="text-gray-600 mt-1">Search and select customer, then add products</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Order # {Math.floor(1000 + Math.random() * 9000)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Customer & Products */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Selection */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Select Customer</h3>
                {selectedCustomer ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-emerald-600 font-medium">
                      ✓ {selectedCustomer.name}
                    </span>
                    <button
                      onClick={() => setSelectedCustomer(null)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">
                    {customers.length} customers available
                  </span>
                )}
              </div>

              {/* Customer Search */}
              <div className="relative mb-4">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers by name, phone, or email..."
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  value={searchCustomer}
                  onChange={(e) => setSearchCustomer(e.target.value)}
                  disabled={!!selectedCustomer}
                />
                {searchCustomer && !selectedCustomer && (
                  <button
                    onClick={clearCustomerSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <XMarkIcon className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              {/* Customer List - Only show when searching and no customer selected */}
              {!selectedCustomer && searchCustomer && (
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {filteredCustomers.length === 0 ? (
                    <div className="text-center py-6">
                      <UserIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-600">No customers found</p>
                      <p className="text-sm text-gray-500 mt-1">Try a different search term</p>
                    </div>
                  ) : (
                    filteredCustomers.map(customer => (
                      <button
                        key={customer.id}
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setSearchCustomer("");
                        }}
                        className="w-full p-3 border border-gray-200 rounded-lg text-left transition-all hover:border-blue-300 hover:bg-gray-50 hover:shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <UserIcon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{customer.name}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-xs text-gray-500">{customer.phone}</span>
                              <span className="text-xs text-gray-500 truncate">{customer.email}</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}

              {/* Selected Customer Info (compact) */}
              {selectedCustomer && (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{selectedCustomer.name}</p>
                        <p className="text-sm text-gray-600">{selectedCustomer.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Product Search - Only enabled when customer is selected */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Add Products</h3>
                <span className="text-sm text-gray-500">
                  {products.filter(p => p.stock > 0).length} products in stock
                </span>
              </div>

              {/* Product Search Bar */}
              <div className="relative mb-4">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products by name..."
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                  disabled={!selectedCustomer}
                />
                {searchProduct && (
                  <button
                    onClick={clearProductSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <XMarkIcon className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              {!selectedCustomer ? (
                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-3">
                    <UserIcon className="w-6 h-6 text-amber-600" />
                  </div>
                  <p className="text-amber-700 font-medium">Select a customer first</p>
                  <p className="text-sm text-gray-500 mt-1">You need to select a customer before adding products</p>
                </div>
              ) : searchProduct && filteredProducts.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p className="text-gray-600">No products found</p>
                  <p className="text-sm text-gray-500 mt-1">Try a different search term</p>
                </div>
              ) : searchProduct && filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredProducts.map(product => {
                    const alreadyInCart = orderItems.find(item => item.productId === product.id);
                    const maxQuantityReached = alreadyInCart && alreadyInCart.quantity >= product.stock;
                    
                    return (
                      <div
                        key={product.id}
                        className={`border rounded-lg p-3 transition-all ${maxQuantityReached ? 'border-amber-200 bg-amber-50' : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{product.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs px-2 py-0.5 rounded ${product.stock > 10 ? 'bg-emerald-100 text-emerald-800' : product.stock > 0 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                                Stock: {product.stock}
                              </span>
                              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                                ID: {product.id}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => addToOrder(product)}
                            disabled={maxQuantityReached || product.stock === 0}
                            className={`p-1.5 rounded-lg transition-colors ${maxQuantityReached ? 'bg-gray-300 cursor-not-allowed' : product.stock === 0 ? 'bg-red-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                            title={maxQuantityReached ? 'Max quantity reached' : product.stock === 0 ? 'Out of stock' : 'Add to order'}
                          >
                            <PlusIcon className="w-4 h-4 text-white" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-900">Rs. {product.price.toFixed(2)}</span>
                          {alreadyInCart && (
                            <span className="text-sm text-blue-600 font-medium">
                              In cart: {alreadyInCart.quantity}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                  <p className="text-gray-600">Search for products</p>
                  <p className="text-sm text-gray-500 mt-1">Type product name in search bar above</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Order Items</h3>
                {orderItems.length > 0 && (
                  <button
                    onClick={() => setOrderItems([])}
                    className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Clear All
                  </button>
                )}
              </div>

              {orderItems.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCartIcon className="w-12 h-12 text-gray-300 mx-auto" />
                  <p className="text-gray-600 mt-2">No items added</p>
                  <p className="text-sm text-gray-500">Search and add products from the left</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {orderItems.map(item => {
                    const product = products.find(p => p.id === item.productId);
                    const remainingStock = product ? product.stock - item.quantity : 0;
                    
                    return (
                      <div key={item.productId} className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-gray-500">Rs. {item.price.toFixed(2)} each</span>
                              {remainingStock < 5 && remainingStock > 0 && (
                                <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded">
                                  Only {remainingStock} left
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="p-1 hover:bg-red-50 text-red-600 rounded transition-colors"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.productId, -1)}
                              className="p-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <MinusIcon className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, 1)}
                              className="p-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                              disabled={remainingStock <= 0}
                            >
                              <PlusIcon className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-bold text-gray-900">Rs. {item.total.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">Rs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (13%)</span>
                  <span className="font-medium">Rs. {tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <div className="flex items-center gap-1">
                      <CurrencyRupeeIcon className="w-5 h-5 text-gray-600" />
                      <span className="text-2xl font-bold text-gray-900">{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              {selectedCustomer && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">Customer</h4>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <UserIcon className="w-4 h-4 text-gray-500" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{selectedCustomer.name}</p>
                      <p className="text-sm text-gray-500">{selectedCustomer.phone}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleSubmit}
                  disabled={!selectedCustomer || orderItems.length === 0 || submitting}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    "Complete Order"
                  )}
                </button>
                <button
                  onClick={() => router.push("/orders")}
                  className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}