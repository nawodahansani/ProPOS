// 'use client'

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { 
//   UserIcon, 
//   ShoppingCartIcon, 
//   CubeIcon, 
//   ArrowTrendingUpIcon, 
//   ArrowUpIcon, 
//   ArrowDownIcon,
//   CurrencyRupeeIcon,
//   UserGroupIcon,
//   ExclamationTriangleIcon,
//   MagnifyingGlassIcon
// } from "@heroicons/react/24/outline";
// import { ChartBarIcon, ClockIcon } from "@heroicons/react/24/solid";
// import BarChart from "../components/BarChart";
// import { apiGet } from "@/lib/api";

// interface Customer {
//   id: number;
//   name: string;
//   email: string;
//   phone: string;
// }

// interface Product {
//   id: number;
//   name: string;
//   price: number;
//   stock: number;
// }

// interface Order {
//   id: number;
//   customer_id: number;
//   total: number;
//   created_at: string;
// }

// interface DashboardStats {
//   totalCustomers: number;
//   totalOrders: number;
//   totalProducts: number;
//   totalRevenue: number;
//   todayOrders: number;
//   lowStockCount: number;
//   outOfStockCount: number;
//   monthlyRevenue: number;
//   orderGrowth: number;
//   revenueGrowth: number;
// }

// export default function HomePage() {
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState<DashboardStats>({
//     totalCustomers: 0,
//     totalOrders: 0,
//     totalProducts: 0,
//     totalRevenue: 0,
//     todayOrders: 0,
//     lowStockCount: 0,
//     outOfStockCount: 0,
//     monthlyRevenue: 0,
//     orderGrowth: 0,
//     revenueGrowth: 0
//   });
//   const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
//   const [recentOrders, setRecentOrders] = useState<Order[]>([]);
//   const [chartData, setChartData] = useState<{ label: string; value: number; revenue: number }[]>([]);

//   useEffect(() => {
//     async function loadDashboardData() {
//       try {
//         setLoading(true);
        
//         // Load all data in parallel
//         const [customersRes, productsRes, ordersRes] = await Promise.all([
//           apiGet<{ status: string; message: string; data: Customer[] }>("/customers"),
//           apiGet<{ status: string; message: string; data: Product[] }>("/products"),
//           apiGet<{ status: string; message: string; data: Order[] }>("/orders")
//         ]);

//         const customers = customersRes.data;
//         const products = productsRes.data;
//         const orders = ordersRes.data;

//         // Calculate today's date
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);
        
//         // Calculate stats
//         const todayOrders = orders.filter(order => {
//           const orderDate = new Date(order.created_at);
//           orderDate.setHours(0, 0, 0, 0);
//           return orderDate.getTime() === today.getTime();
//         }).length;

//         const lowStockProductsList = products.filter(p => p.stock > 0 && p.stock < 10);
//         const outOfStockProducts = products.filter(p => p.stock === 0);
//         const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

//         // Calculate growth (mock calculation - in real app, compare with previous period)
//         const orderGrowth = orders.length > 50 ? 12 : 24; // Mock growth percentage
//         const revenueGrowth = totalRevenue > 50000 ? 18 : 30; // Mock growth percentage

//         // Generate chart data (last 7 days - mock data for demo)
//         const chartData = generateChartData(orders);

//         // Get recent orders (last 5)
//         const recentOrdersList = orders
//           .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
//           .slice(0, 5);

//         // Get low stock products (for alert card)
//         const topLowStock = lowStockProductsList
//           .sort((a, b) => a.stock - b.stock)
//           .slice(0, 4);

//         setStats({
//           totalCustomers: customers.length,
//           totalOrders: orders.length,
//           totalProducts: products.length,
//           totalRevenue,
//           todayOrders,
//           lowStockCount: lowStockProductsList.length,
//           outOfStockCount: outOfStockProducts.length,
//           monthlyRevenue: totalRevenue * 0.3, // Mock monthly revenue (30% of total)
//           orderGrowth,
//           revenueGrowth
//         });

//         setLowStockProducts(topLowStock);
//         setRecentOrders(recentOrdersList);
//         setChartData(chartData);

//       } catch (err) {
//         console.error("Failed to load dashboard data", err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadDashboardData();
//   }, []);

//   // Function to generate chart data from orders
//   function generateChartData(orders: Order[]) {
//     // For demo, generate last 15 days data
//     const data = [];
//     const today = new Date();
    
//     for (let i = 14; i >= 0; i--) {
//       const date = new Date(today);
//       date.setDate(today.getDate() - i);
//       const dateStr = date.getDate().toString();
      
//       // Mock values based on order count
//       const mockOrders = Math.floor(Math.random() * 10) + (orders.length > 0 ? 2 : 0);
//       const mockRevenue = mockOrders * (Math.random() * 1000 + 100);
      
//       data.push({
//         label: dateStr,
//         value: mockOrders,
//         revenue: mockRevenue
//       });
//     }
    
//     return data;
//   }

//   // Format currency
//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0
//     }).format(amount).replace('₹', 'Rs. ');
//   };

//   // Format date
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffMs = now.getTime() - date.getTime();
//     const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
//     if (diffHours < 1) return "Just now";
//     if (diffHours < 24) return `${diffHours} hours ago`;
//     if (diffHours < 48) return "Yesterday";
//     return `${Math.floor(diffHours / 24)} days ago`;
//   };

//   const dashboardStats = [
//     { 
//       title: "Total Customers", 
//       value: stats.totalCustomers, 
//       change: `${stats.totalCustomers > 100 ? '+' : ''}${stats.totalCustomers > 0 ? '12%' : '0%'}`, 
//       trend: stats.totalCustomers > 100 ? "up" : "stable",
//       icon: <UserGroupIcon className="w-6 h-6 text-blue-500" />,
//       color: "blue",
//       description: "Total registered customers"
//     },
//     { 
//       title: "Today's Orders", 
//       value: stats.todayOrders, 
//       change: `${stats.todayOrders > 5 ? '+' : ''}${stats.orderGrowth}%`, 
//       trend: stats.todayOrders > 5 ? "up" : "down",
//       icon: <ShoppingCartIcon className="w-6 h-6 text-emerald-500" />,
//       color: "emerald",
//       description: "Orders placed today"
//     },
//     { 
//       title: "Active Products", 
//       value: stats.totalProducts, 
//       change: stats.totalProducts > 50 ? "+8%" : "0%", 
//       trend: stats.totalProducts > 50 ? "up" : "stable",
//       icon: <CubeIcon className="w-6 h-6 text-amber-500" />,
//       color: "amber",
//       description: "Products in inventory"
//     },
//     { 
//       title: "Total Revenue", 
//       value: formatCurrency(stats.totalRevenue), 
//       change: `${stats.revenueGrowth > 0 ? '+' : ''}${stats.revenueGrowth}%`, 
//       trend: stats.revenueGrowth > 0 ? "up" : "down",
//       icon: <ChartBarIcon className="w-6 h-6 text-purple-500" />,
//       color: "purple",
//       description: "All-time revenue"
//     },
//   ];

//   if (loading) {
//     return (
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
//             <p className="text-gray-600 mt-1">Loading dashboard data...</p>
//           </div>
//         </div>
//         <div className="flex items-center justify-center py-20">
//           <div className="text-center">
//             <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//             <p className="text-gray-600 mt-3">Loading dashboard data...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header with CTA */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
//           <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your store today.</p>
//         </div>
//         <Link 
//           href="/orders/create" 
//           className="btn-primary flex items-center gap-2 group"
//         >
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
//           </svg>
//           Create New Order
//         </Link>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//         {dashboardStats.map((stat, index) => (
//           <div 
//             key={index}
//             className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
//           >
//             <div className="flex items-center justify-between mb-4">
//               <div className={`p-3 rounded-xl bg-${stat.color}-50`}>
//                 {stat.icon}
//               </div>
//               <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-emerald-50 text-emerald-700' : stat.trend === 'down' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
//                 {stat.trend === 'up' ? <ArrowUpIcon className="w-3 h-3" /> : 
//                  stat.trend === 'down' ? <ArrowDownIcon className="w-3 h-3" /> : null}
//                 {stat.change}
//               </div>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">{stat.title}</p>
//               <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
//               <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Chart + Recent Activity */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Chart Card */}
//         <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900">Sales Overview</h3>
//               <p className="text-sm text-gray-600 mt-1">Orders and revenue for the last 15 days</p>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-1.5">
//                 <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
//                 <span className="text-sm text-gray-600">Orders</span>
//               </div>
//               <div className="flex items-center gap-1.5">
//                 <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
//                 <span className="text-sm text-gray-600">Revenue</span>
//               </div>
//             </div>
//           </div>
          
//           <div className="h-72">
//             <BarChart data={chartData} height={280} />
//           </div>
          
//           {/* <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <p className="text-sm text-gray-600">Average daily orders</p>
//               <p className="text-xl font-bold text-gray-900">
//                 {(chartData.reduce((sum, d) => sum + d.value, 0) / chartData.length).toFixed(1)}
//               </p>
//             </div>
//             <div className="space-y-2">
//               <p className="text-sm text-gray-600">Total revenue (15 days)</p>
//               <p className="text-xl font-bold text-gray-900">
//                 {formatCurrency(chartData.reduce((sum, d) => sum + d.revenue, 0))}
//               </p>
//             </div>
//           </div> */}
//         </div>

//         {/* Recent Orders & Stock Alerts */}
//         <div className="space-y-6">
//           {/* Stock Alerts */}
//           <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
//             <div className="flex items-center justify-between mb-6">
//               <div className="flex items-center gap-2">
//                 <div className="p-2 bg-red-50 rounded-lg">
//                   <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900">Stock Alerts</h3>
//                   <p className="text-sm text-gray-600">Items needing attention</p>
//                 </div>
//               </div>
//               <span className={`px-2.5 py-1 ${stats.lowStockCount + stats.outOfStockCount > 0 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'} text-xs font-medium rounded-full`}>
//                 {stats.lowStockCount + stats.outOfStockCount} items
//               </span>
//             </div>
            
//             <div className="space-y-4">
//               {lowStockProducts.length > 0 ? (
//                 lowStockProducts.map((product, index) => (
//                   <Link 
//                     key={product.id}
//                     href={`/products?filter=${product.stock === 0 ? 'out-of-stock' : 'low-stock'}`}
//                     className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors group"
//                   >
//                     <div>
//                       <h4 className="font-medium text-gray-900 group-hover:text-blue-600">{product.name}</h4>
//                       <div className="flex items-center gap-3 mt-1">
//                         <span className="text-xs text-gray-500">ID: {product.id}</span>
//                         <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${product.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
//                           {product.stock === 0 ? 'Out of stock' : `Low: ${product.stock}`}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
//                         <CurrencyRupeeIcon className="w-3 h-3" />
//                         {product.price.toFixed(2)}
//                       </p>
//                     </div>
//                   </Link>
//                 ))
//               ) : (
//                 <div className="text-center py-4">
//                   <CubeIcon className="w-8 h-8 text-emerald-300 mx-auto" />
//                   <p className="text-emerald-600 mt-2">All products in stock ✓</p>
//                 </div>
//               )}
//             </div>
            
//             <Link 
//               href="/products?filter=low-stock" 
//               className="mt-6 block text-center text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg py-2.5 hover:bg-blue-50 transition-colors"
//             >
//               Manage Inventory
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
//             <p className="text-gray-600 mt-1">Quick access to frequently used operations</p>
//           </div>
//           <div className="text-sm text-blue-600">
//             {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
//           </div>
//         </div>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
//           <Link 
//             href="/products/create" 
//             className="bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col items-center text-center group"
//           >
//             <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg group-hover:scale-110 transition-transform">
//               <CubeIcon className="w-7 h-7 text-blue-600" />
//             </div>
//             <span className="font-semibold text-gray-900 mt-4 group-hover:text-blue-600">Add Product</span>
//             <span className="text-xs text-gray-500 mt-1">Add new inventory item</span>
//           </Link>
          
//           <Link 
//             href="/customers/create" 
//             className="bg-white rounded-xl p-5 border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col items-center text-center group"
//           >
//             <div className="p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg group-hover:scale-110 transition-transform">
//               <UserIcon className="w-7 h-7 text-emerald-600" />
//             </div>
//             <span className="font-semibold text-gray-900 mt-4 group-hover:text-emerald-600">New Customer</span>
//             <span className="text-xs text-gray-500 mt-1">Register customer</span>
//           </Link>
          
//           <Link 
//             href="/orders/create" 
//             className="bg-white rounded-xl p-5 border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all flex flex-col items-center text-center group"
//           >
//             <div className="p-3 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg group-hover:scale-110 transition-transform">
//               <ShoppingCartIcon className="w-7 h-7 text-amber-600" />
//             </div>
//             <span className="font-semibold text-gray-900 mt-4 group-hover:text-amber-600">New Order</span>
//             <span className="text-xs text-gray-500 mt-1">Create sales order</span>
//           </Link>
          
//           <Link 
//             href="/products" 
//             className="bg-white rounded-xl p-5 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all flex flex-col items-center text-center group"
//           >
//             <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg group-hover:scale-110 transition-transform">
//               <ArrowTrendingUpIcon className="w-7 h-7 text-purple-600" />
//             </div>
//             <span className="font-semibold text-gray-900 mt-4 group-hover:text-purple-600">View Reports</span>
//             <span className="text-xs text-gray-500 mt-1">Analytics & insights</span>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  UserIcon, 
  ShoppingCartIcon, 
  CubeIcon, 
  ArrowTrendingUpIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  CurrencyRupeeIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import { ChartBarIcon, ClockIcon } from "@heroicons/react/24/solid";
import BarChart from "../components/BarChart";
import { apiGet } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface Order {
  id: number;
  customer_id: number;
  total: number;
  created_at: string;
}

interface DashboardStats {
  totalCustomers: number;
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  todayOrders: number;
  lowStockCount: number;
  outOfStockCount: number;
  monthlyRevenue: number;
  orderGrowth: number;
  revenueGrowth: number;
}

// The main dashboard content component
function DashboardContent() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    todayOrders: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    monthlyRevenue: 0,
    orderGrowth: 0,
    revenueGrowth: 0
  });
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [chartData, setChartData] = useState<{ label: string; value: number; revenue: number }[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        
        // Load all data in parallel
        const [customersRes, productsRes, ordersRes] = await Promise.all([
          apiGet<{ status: string; message: string; data: Customer[] }>("/customers"),
          apiGet<{ status: string; message: string; data: Product[] }>("/products"),
          apiGet<{ status: string; message: string; data: Order[] }>("/orders")
        ]);

        const customers = customersRes.data;
        const products = productsRes.data;
        const orders = ordersRes.data;

        // Calculate today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Calculate stats
        const todayOrders = orders.filter(order => {
          const orderDate = new Date(order.created_at);
          orderDate.setHours(0, 0, 0, 0);
          return orderDate.getTime() === today.getTime();
        }).length;

        const lowStockProductsList = products.filter(p => p.stock > 0 && p.stock < 10);
        const outOfStockProducts = products.filter(p => p.stock === 0);

         // Combine both arrays for display
        const allStockAlerts = [...outOfStockProducts, ...lowStockProductsList];

        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

        // Calculate growth (mock calculation - in real app, compare with previous period)
        const orderGrowth = orders.length > 50 ? 12 : 24; // Mock growth percentage
        const revenueGrowth = totalRevenue > 50000 ? 18 : 30; // Mock growth percentage

        // Generate chart data (last 7 days - mock data for demo)
        const chartData = generateChartData(orders);

        // Get recent orders (last 5)
        const recentOrdersList = orders
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5);

        // Get low stock products (for alert card)
        const topLowStock  = allStockAlerts
        .sort((a, b) => {
          // Show out of stock first, then by stock level
          if (a.stock === 0 && b.stock > 0) return -1;
          if (a.stock > 0 && b.stock === 0) return 1;
          return a.stock - b.stock;
        })
        .slice(0, 5);

        setStats({
          totalCustomers: customers.length,
          totalOrders: orders.length,
          totalProducts: products.length,
          totalRevenue,
          todayOrders,
          lowStockCount: lowStockProductsList.length,
          outOfStockCount: outOfStockProducts.length,
          monthlyRevenue: totalRevenue * 0.3, // Mock monthly revenue (30% of total)
          orderGrowth,
          revenueGrowth
        });

        setLowStockProducts(topLowStock );
        setRecentOrders(recentOrdersList);
        setChartData(chartData);

      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // Function to generate chart data from orders
  function generateChartData(orders: Order[]) {
    // For demo, generate last 15 days data
    const data = [];
    const today = new Date();
    
    for (let i = 14; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.getDate().toString();
      
      // Mock values based on order count
      const mockOrders = Math.floor(Math.random() * 10) + (orders.length > 0 ? 2 : 0);
      const mockRevenue = mockOrders * (Math.random() * 1000 + 100);
      
      data.push({
        label: dateStr,
        value: mockOrders,
        revenue: mockRevenue
      });
    }
    
    return data;
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('₹', 'Rs. ');
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffHours < 48) return "Yesterday";
    return `${Math.floor(diffHours / 24)} days ago`;
  };

  const dashboardStats = [
    { 
      title: "Total Customers", 
      value: stats.totalCustomers, 
      change: `${stats.totalCustomers > 100 ? '+' : ''}${stats.totalCustomers > 0 ? '12%' : '0%'}`, 
      trend: stats.totalCustomers > 100 ? "up" : "stable",
      icon: <UserGroupIcon className="w-6 h-6 text-blue-500" />,
      color: "blue",
      description: "Total registered customers"
    },
    { 
      title: "Today's Orders", 
      value: stats.todayOrders, 
      change: `${stats.todayOrders > 5 ? '+' : ''}${stats.orderGrowth}%`, 
      trend: stats.todayOrders > 5 ? "up" : "down",
      icon: <ShoppingCartIcon className="w-6 h-6 text-emerald-500" />,
      color: "emerald",
      description: "Orders placed today"
    },
    { 
      title: "Active Products", 
      value: stats.totalProducts, 
      change: stats.totalProducts > 50 ? "+8%" : "0%", 
      trend: stats.totalProducts > 50 ? "up" : "stable",
      icon: <CubeIcon className="w-6 h-6 text-amber-500" />,
      color: "amber",
      description: "Products in inventory"
    },
    { 
      title: "Total Revenue", 
      value: formatCurrency(stats.totalRevenue), 
      change: `${stats.revenueGrowth > 0 ? '+' : ''}${stats.revenueGrowth}%`, 
      trend: stats.revenueGrowth > 0 ? "up" : "down",
      icon: <ChartBarIcon className="w-6 h-6 text-purple-500" />,
      color: "purple",
      description: "All-time revenue"
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-1">Loading dashboard data...</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-3">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with CTA */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your store today.</p>
        </div>
        <Link 
          href="/orders/create" 
          className="btn-primary flex items-center gap-2 group"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Create New Order
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {dashboardStats.map((stat, index) => (
          <div 
            key={index}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-${stat.color}-50`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-emerald-50 text-emerald-700' : stat.trend === 'down' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                {stat.trend === 'up' ? <ArrowUpIcon className="w-3 h-3" /> : 
                 stat.trend === 'down' ? <ArrowDownIcon className="w-3 h-3" /> : null}
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Card */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Sales Overview</h3>
              <p className="text-sm text-gray-600 mt-1">Orders and revenue for the last 15 days</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Orders</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Revenue</span>
              </div>
            </div>
          </div>
          
          <div className="h-72">
            <BarChart data={chartData} height={230} />
          </div>
          
          {/* <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Average daily orders</p>
              <p className="text-xl font-bold text-gray-900">
                {(chartData.reduce((sum, d) => sum + d.value, 0) / chartData.length).toFixed(1)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Total revenue (15 days)</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(chartData.reduce((sum, d) => sum + d.revenue, 0))}
              </p>
            </div>
          </div> */}
        </div>

        {/* Recent Orders & Stock Alerts */}
        <div className="space-y-6">
          {/* Stock Alerts */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-50 rounded-lg">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Stock Alerts</h3>
                  <p className="text-sm text-gray-600">Items needing attention</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 ${stats.lowStockCount + stats.outOfStockCount > 0 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'} text-xs font-medium rounded-full`}>
                {stats.lowStockCount + stats.outOfStockCount} items
              </span>
            </div>
            
            <div className="space-y-4">
              {lowStockProducts.length > 0 ? (
                lowStockProducts.map((product, index) => (
                  <Link 
                    key={product.id}
                    href={`/products?filter=${product.stock === 0 ? 'out-of-stock' : 'low-stock'}`}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors group"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-600">{product.name}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500">ID: {product.id}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${product.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                          {product.stock === 0 ? 'Out of stock' : `Low: ${product.stock}`}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                        <CurrencyRupeeIcon className="w-3 h-3" />
                        {product.price.toFixed(2)}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-4">
                  <CubeIcon className="w-8 h-8 text-emerald-300 mx-auto" />
                  <p className="text-emerald-600 mt-2">All products in stock ✓</p>
                </div>
              )}
            </div>
            
            <Link 
              href="/products?filter=low-stock" 
              className="mt-6 block text-center text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg py-2.5 hover:bg-blue-50 transition-colors"
            >
              Manage Inventory
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <p className="text-gray-600 mt-1">Quick access to frequently used operations</p>
          </div>
          <div className="text-sm text-blue-600">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <Link 
            href="/products/create" 
            className="bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col items-center text-center group"
          >
            <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg group-hover:scale-110 transition-transform">
              <CubeIcon className="w-7 h-7 text-blue-600" />
            </div>
            <span className="font-semibold text-gray-900 mt-4 group-hover:text-blue-600">Add Product</span>
            <span className="text-xs text-gray-500 mt-1">Add new inventory item</span>
          </Link>
          
          <Link 
            href="/customers/create" 
            className="bg-white rounded-xl p-5 border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col items-center text-center group"
          >
            <div className="p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg group-hover:scale-110 transition-transform">
              <UserIcon className="w-7 h-7 text-emerald-600" />
            </div>
            <span className="font-semibold text-gray-900 mt-4 group-hover:text-emerald-600">New Customer</span>
            <span className="text-xs text-gray-500 mt-1">Register customer</span>
          </Link>
          
          <Link 
            href="/orders/create" 
            className="bg-white rounded-xl p-5 border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all flex flex-col items-center text-center group"
          >
            <div className="p-3 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg group-hover:scale-110 transition-transform">
              <ShoppingCartIcon className="w-7 h-7 text-amber-600" />
            </div>
            <span className="font-semibold text-gray-900 mt-4 group-hover:text-amber-600">New Order</span>
            <span className="text-xs text-gray-500 mt-1">Create sales order</span>
          </Link>
          
          <Link 
            href="/products" 
            className="bg-white rounded-xl p-5 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all flex flex-col items-center text-center group"
          >
            <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg group-hover:scale-110 transition-transform">
              <ArrowTrendingUpIcon className="w-7 h-7 text-purple-600" />
            </div>
            <span className="font-semibold text-gray-900 mt-4 group-hover:text-purple-600">View Reports</span>
            <span className="text-xs text-gray-500 mt-1">Analytics & insights</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

// The main page component that wraps everything with ProtectedRoute
export default function HomePage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}