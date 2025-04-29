import React from 'react';
import { Bell, Search, Sun } from 'lucide-react';

const Topbar: React.FC = () => {
  return (
    <div className="flex items-center justify-between bg-white h-20 px-6 shadow-sm">
      <div className="flex items-center w-1/2">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
        <Sun className="w-6 h-6 text-gray-600 cursor-pointer" />
        <div>
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-indigo-500"
          />
        </div>
      </div>
    </div>
  );
};

export default Topbar;