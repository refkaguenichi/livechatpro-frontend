'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaComments, FaChartBar, FaSignOutAlt } from "react-icons/fa";

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: <FaChartBar /> },
  { name: 'Chat', href: '/chat', icon: <FaComments /> },
  // Add more links as needed
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-60 bg-white shadow-lg flex flex-col py-8 px-4">
      <div className="mb-8 text-2xl font-bold text-primary text-center">
        LiveChat Pro
      </div>
      <nav className="flex-1">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 font-medium transition
              ${pathname === item.href ? 'bg-accent text-blue-500' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="mt-auto">
        <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full">
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
}