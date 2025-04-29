// components/DashboardCardGrid.tsx
import {
  BarChart2,
  FileText,
  LayoutGrid,
  Home,
} from 'lucide-react';

const stats = [
  { title: 'Earnings', value: '$340.5', icon: BarChart2 },
  { title: 'Spend', value: '$642.39', icon: FileText },
  { title: 'Sales', value: '$574.34', icon: BarChart2 },
  { title: 'Balance', value: '$1,000', icon: LayoutGrid },
  { title: 'Tasks', value: '145', icon: BarChart2 },
  { title: 'Projects', value: '2433', icon: Home },
];

const DashboardCardGrid = () => {
  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="flex items-center bg-white p-6 rounded-xl shadow-sm hover:shadow-md group transition-all duration-300"
          >
            {/* Icon */}
            <div className="mr-6">
              <Icon className="w-10 h-10 text-indigo-500 group-hover:text-indigo-700 group-hover:scale-110 transition-transform duration-300" />
            </div>

            {/* Text */}
            <div className="flex flex-col justify-center">
              <p className="text-lg font-semibold text-gray-600">{stat.title}</p>
              <h2 className="text-2xl font-bold text-gray-900">{stat.value}</h2>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCardGrid;
