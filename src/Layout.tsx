// layout/Layout.tsx
import React from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart2,
  MapPinned,
  Search,
  Bell,
  Sun,
  UserCircle,
} from 'lucide-react';

const Layout: React.FC = () => {
  const location = useLocation();

  const isDashboardHome = location.pathname === '/dashboard';

  return (
    <div
      className={`flex h-screen overflow-hidden ${isDashboardHome ? 'bg-cover bg-center' : ''}`}
      
    >
      {/* Sidebar */}
      <aside className="w-64 bg-white/90 backdrop-blur-lg border-r border-blue-100 p-6 flex flex-col justify-between shadow-md">
        <div>
          {/* Logo (Gradient Text + Heart Pulse) */}
          <Link to="/" className="flex items-center justify-center gap-2 mb-10">
            <h1 className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-blue-600 via-blue-400 to-teal-400 bg-clip-text text-transparent">
              HealthcareVis
            </h1>
            <div className="relative flex">
              <span className="text-red-400 animate-ping absolute inline-flex h-3 w-3 rounded-full opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            {[
              { to: '/dashboard/graph', icon: LayoutDashboard, label: 'Graph View' },
              { to: '/dashboard/summary', icon: BarChart2, label: 'Summary View' },
              { to: '/dashboard/map', icon: MapPinned, label: 'Map View' },
            ].map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg border border-transparent transition-all ${
                    isActive
                      ? 'border-blue-400 bg-blue-50 text-blue-700 font-semibold'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-600 hover:text-blue-600'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span className="text-md">{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="mt-8 hidden sm:block text-center">
          <p className="text-xs text-gray-400">© 2025 HealthcareVis</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-md shadow-sm">
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold text-gray-800">Main Dashboard</h1>
            <p className="text-xs text-gray-500">Empowering healthcare data visualization</p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="flex items-center gap-2 bg-blue-100 px-3 py-2 rounded-md">
              <Search className="w-4 h-4 text-blue-500" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm outline-none placeholder-blue-400 text-gray-700 w-40"
              />
            </div>

            {/* Icons */}
            <Bell className="text-blue-500 w-5 h-5 cursor-pointer hover:text-blue-600 transition" />
            <Sun className="text-blue-500 w-5 h-5 cursor-pointer hover:text-blue-600 transition" />
            <UserCircle className="text-blue-500 w-7 h-7 cursor-pointer hover:text-blue-600 transition" />
          </div>
        </header>

        {/* Dynamic Content */}
        <section className="flex-1 overflow-y-auto p-6">
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-lg shadow-md min-h-[400px]">
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Layout;
