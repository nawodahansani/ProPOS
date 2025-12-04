// 'use client'

// import Link from 'next/link'
// import { usePathname } from 'next/navigation'
// import { ShoppingBagIcon, HomeIcon, CubeIcon, UserGroupIcon } from '@heroicons/react/24/outline'
// import { HomeIcon as HomeSolid, CubeIcon as CubeSolid, UserGroupIcon as UserSolid, ShoppingBagIcon as CartSolid } from '@heroicons/react/24/solid'

// export default function Navbar() {
//   const pathname = usePathname()
  
//   const navItems = [
//     { href: '/', label: 'Dashboard', icon: HomeIcon, activeIcon: HomeSolid },
//     { href: '/products', label: 'Products', icon: CubeIcon, activeIcon: CubeSolid },
//     { href: '/customers', label: 'Customers', icon: UserGroupIcon, activeIcon: UserSolid },
//     { href: '/orders', label: 'Orders', icon: ShoppingBagIcon, activeIcon: CartSolid },
//   ]

//   return (
//     <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200/60 shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <div className="flex items-center gap-3">
//             <div className="relative">
//               <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-amber-500 rounded-xl blur opacity-30"></div>
//               <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
//                 <span className="text-lg font-bold">POS</span>
//               </div>
//             </div>
//             <div>
//               <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
//                 Pro<span className="text-blue-600">POS</span>
//               </h1>
//               <p className="text-xs text-gray-500 -mt-1">Retail Management</p>
//             </div>
//           </div>

//           {/* Navigation */}
//           <div className="flex items-center space-x-1">
//             {navItems.map((item) => {
//               const isActive = pathname === item.href
//               const Icon = isActive ? item.activeIcon : item.icon
              
//               return (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   className={`
//                     relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
//                     ${isActive 
//                       ? 'text-blue-600 bg-blue-50 border border-blue-100' 
//                       : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//                     }
//                   `}
//                 >
//                   <Icon className="w-5 h-5" />
//                   <span>{item.label}</span>
//                   {isActive && (
//                     <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
//                   )}
//                 </Link>
//               )
//             })}
//           </div>

//           {/* User/Actions */}
//           <div className="flex items-center gap-4">
//             <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full">
//               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//               <span className="text-sm font-medium text-gray-700">Live</span>
//             </div>
//             <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
//               <span className="text-sm font-semibold text-gray-700">AD</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   )
// }

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { 
  ShoppingBagIcon, 
  HomeIcon, 
  CubeIcon, 
  UserGroupIcon,
  BellIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import { 
  HomeIcon as HomeSolid, 
  CubeIcon as CubeSolid, 
  UserGroupIcon as UserSolid, 
  ShoppingBagIcon as CartSolid,
  UserCircleIcon
} from '@heroicons/react/24/solid'
import { useState } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  
  const navItems = [
    { href: '/', label: 'Dashboard', icon: HomeIcon, activeIcon: HomeSolid },
    { href: '/products', label: 'Products', icon: CubeIcon, activeIcon: CubeSolid },
    { href: '/customers', label: 'Customers', icon: UserGroupIcon, activeIcon: UserSolid },
    { href: '/orders', label: 'Orders', icon: ShoppingBagIcon, activeIcon: CartSolid },
  ]

  // Don't show navbar on auth pages
  if (pathname === '/login' || pathname === '/register') {
    return null
  }

  // Don't show navbar if user is not authenticated
  if (!user) {
    return null
  }

  const handleLogout = () => {
    logout()
  }

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
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                              (item.href !== '/' && pathname.startsWith(item.href))
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
            {/* Notifications */}
            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <BellIcon className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Status Indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Live</span>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium shadow">
                  {user.first_name?.charAt(0) || 'U'}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
                <ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-lg">
                          {user.first_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link 
                        href="/profile" 
                        className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <UserCircleIcon className="w-5 h-5 mr-3 text-gray-400" />
                        My Profile
                      </Link>
                      <Link 
                        href="/settings" 
                        className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Cog6ToothIcon className="w-5 h-5 mr-3 text-gray-400" />
                        Settings
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-around">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                              (item.href !== '/' && pathname.startsWith(item.href))
              const Icon = isActive ? item.activeIcon : item.icon
              
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                    isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs mt-1">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}