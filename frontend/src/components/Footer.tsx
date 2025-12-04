'use client'

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm text-gray-600">
          &copy; {new Date().getFullYear()} ProPOS Retail System. All rights reserved.
        </p>
      </div>
    </footer>
  )
}