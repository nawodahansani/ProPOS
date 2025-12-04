'use client'

import Link from "next/link";
import { UserIcon, ShoppingCartIcon, CubeIcon, ArrowTrendingUpIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import { UserGroupIcon, ChartBarIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import BarChart from "../components/BarChart";


export default function HomePage() {
  const stats = [
    { 
      title: "Total Customers", 
      value: 124, 
      change: "+12%", 
      trend: "up",
      icon: <UserGroupIcon className="w-6 h-6 text-blue-500" />,
      color: "blue"
    },
    { 
      title: "Today's Orders", 
      value: 56, 
      change: "+24%", 
      trend: "up",
      icon: <ShoppingCartIcon className="w-6 h-6 text-emerald-500" />,
      color: "emerald"
    },
    { 
      title: "Active Products", 
      value: 78, 
      change: "-2%", 
      trend: "down",
      icon: <CubeIcon className="w-6 h-6 text-amber-500" />,
      color: "amber"
    },
    { 
      title: "Revenue", 
      value: "$12,480", 
      change: "+18%", 
      trend: "up",
      icon: <ChartBarIcon className="w-6 h-6 text-purple-500" />,
      color: "purple"
    },
  ];

  const outOfStock = [
    { name: "Keyboard", sku: "KB-2024", qty: 0, lastOrdered: "2 days ago" },
    { name: "Laptop Charger", sku: "LC-65W", qty: 0, lastOrdered: "1 week ago" },
    { name: "USB Hub", sku: "UH-4P", qty: 2, lastOrdered: "3 days ago" },
    { name: "Wireless Mouse", sku: "WM-100", qty: 0, lastOrdered: "5 days ago" },
  ];

  const chartData = [
    { label: "1", value: 2 },
    { label: "3", value: 4 },
    { label: "5", value: 6 },
    { label: "7", value: 10 },
    { label: "9", value: 8 },
    { label: "11", value: 12 },
    { label: "13", value: 6 },
    { label: "15", value: 10 },
    { label: "17", value: 5 },
    { label: "19", value: 8 },
    { label: "21", value: 11 },
    { label: "23", value: 7 },
    { label: "25", value: 9 },
    { label: "27", value: 4 },
    { label: "29", value: 3 }
  ];

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
          className="btn-accent flex items-center gap-2 group"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          New Order
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover-lift"
          >
            <div className="flex items-center justify-between">
              <div className={`p-2.5 rounded-lg bg-${stat.color}-50`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                {stat.trend === 'up' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-xs text-gray-500">
                {stat.trend === 'up' ? 'Increased from yesterday' : 'Decreased from yesterday'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Out of Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Card */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Monthly Sales Trend</h3>
              <p className="text-sm text-gray-600 mt-1">Total orders and revenue for November 2024</p>
            </div>
            <div className="flex items-center gap-2">
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
          
          <div className="h-64">
            <BarChart data={chartData} height={240} />
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average daily orders</p>
              <p className="text-xl font-bold text-gray-900">7.2</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Peak day</p>
              <p className="text-xl font-bold text-gray-900">Nov 11 (12 orders)</p>
            </div>
          </div>
        </div>

        {/* Out of Stock Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-50 rounded-lg">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Low Stock Alert</h3>
                <p className="text-sm text-gray-600">Items needing restock</p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
              {outOfStock.length} items
            </span>
          </div>
          
          <div className="space-y-4">
            {outOfStock.map((item, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500">{item.sku}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.qty === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      {item.qty === 0 ? 'Out of stock' : `Low: ${item.qty}`}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Last ordered</p>
                  <p className="text-sm font-medium text-gray-900">{item.lastOrdered}</p>
                </div>
              </div>
            ))}
          </div>
          
          <Link 
            href="/products?filter=low-stock" 
            className="mt-6 block text-center text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg py-2.5 hover:bg-blue-50 transition-colors"
          >
            View all inventory
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <p className="text-gray-600 mt-1">Frequently used operations</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <Link 
            href="/products/create" 
            className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 hover-lift flex flex-col items-center text-center"
          >
            <div className="p-3 bg-blue-50 rounded-lg">
              <CubeIcon className="w-6 h-6 text-blue-600" />
            </div>
            <span className="font-medium text-gray-900 mt-3">Add Product</span>
            <span className="text-xs text-gray-500 mt-1">Inventory</span>
          </Link>
          
          <Link 
            href="/customers/create" 
            className="bg-white rounded-lg p-4 border border-gray-200 hover:border-emerald-300 hover-lift flex flex-col items-center text-center"
          >
            <div className="p-3 bg-emerald-50 rounded-lg">
              <UserIcon className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="font-medium text-gray-900 mt-3">New Customer</span>
            <span className="text-xs text-gray-500 mt-1">CRM</span>
          </Link>
          
          <Link 
            href="/orders" 
            className="bg-white rounded-lg p-4 border border-gray-200 hover:border-amber-300 hover-lift flex flex-col items-center text-center"
          >
            <div className="p-3 bg-amber-50 rounded-lg">
              <ShoppingCartIcon className="w-6 h-6 text-amber-600" />
            </div>
            <span className="font-medium text-gray-900 mt-3">View Orders</span>
            <span className="text-xs text-gray-500 mt-1">Sales</span>
          </Link>
          
          <Link 
            href="/reports" 
            className="bg-white rounded-lg p-4 border border-gray-200 hover:border-purple-300 hover-lift flex flex-col items-center text-center"
          >
            <div className="p-3 bg-purple-50 rounded-lg">
              <ArrowTrendingUpIcon className="w-6 h-6 text-purple-600" />
            </div>
            <span className="font-medium text-gray-900 mt-3">Reports</span>
            <span className="text-xs text-gray-500 mt-1">Analytics</span>
          </Link>
        </div>
      </div>
    </div>
  );
}