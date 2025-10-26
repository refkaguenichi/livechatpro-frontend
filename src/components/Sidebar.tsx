'use client';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaComments, FaChartBar, FaSignOutAlt } from "react-icons/fa";

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: <FaChartBar /> },
  { name: 'Chat', href: '/chat', icon: <FaComments /> },
];

export default function Sidebar() {
  const pathname = usePathname();
    const { logout, user } = useAuth();
    const router = useRouter();
    const handleLogout = async () => {
    try {
      await logout();
      router.push("/login"); // Redirect to login after logout
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
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
        <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full"
          onClick={handleLogout}>
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
}