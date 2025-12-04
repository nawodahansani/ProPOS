'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBagIcon, HomeIcon, CubeIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { HomeIcon as HomeSolid, CubeIcon as CubeSolid, UserGroupIcon as UserSolid, ShoppingBagIcon as CartSolid } from '@heroicons/react/24/solid'

export default function Navbar() {
  const pathname = usePathname()
  
  const navItems = [
    { href: '/', label: 'Dashboard', icon: HomeIcon, activeIcon: HomeSolid },
    { href: '/products', label: 'Products', icon: CubeIcon, activeIcon: CubeSolid },
    { href: '/customers', label: 'Customers', icon: UserGroupIcon, activeIcon: UserSolid },
    { href: '/orders', label: 'Orders', icon: ShoppingBagIcon, activeIcon: CartSolid },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-amber-500 rounded-xl blur opacity-30"></div>
              <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-lg font-bold">POS</span>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Pro<span className="text-blue-600">POS</span>
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Retail Management</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = isActive ? item.activeIcon : item.icon
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? 'text-blue-600 bg-blue-50 border border-blue-100' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
                  )}
                </Link>
              )
            })}
          </div>

          {/* User/Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Live</span>
            </div>
            <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-gray-700">AD</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}