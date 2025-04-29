import React from 'react';
import { Home } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 h-screen bg-white shadow-lg flex flex-col">
      <div className="flex items-center justify-center h-20 border-b">
        <h1 className="text-2xl font-bold text-indigo-600">DATA VIS</h1>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-4">
          <li>
            <a
              href="#"
              className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-indigo-100 transition"
            >
              <Home className="w-5 h-5 mr-3 text-indigo-500" />
              <span className="font-medium">Main Dashboard</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;