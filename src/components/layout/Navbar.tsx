import { Link } from "react-router-dom";
import { Home, Search, Bell, MessageSquare, User, Briefcase, Calendar, ShoppingBag } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

const Navbar = () => {
  const user = getCurrentUser();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-agbc-blue to-agbc-green rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AG</span>
            </div>
            <span className="font-bold text-xl text-agbc-blue hidden sm:block">AGBC</span>
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search members, opportunities..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agbc-blue focus:border-transparent"
              />
            </div>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-6">
            <Link to="/dashboard" className="text-gray-600 hover:text-agbc-blue transition">
              <Home className="w-6 h-6" />
            </Link>
            <Link to="/opportunities" className="text-gray-600 hover:text-agbc-blue transition relative">
              <Briefcase className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                3
              </span>
            </Link>
            <Link to="/messages" className="text-gray-600 hover:text-agbc-blue transition relative">
              <MessageSquare className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                2
              </span>
            </Link>
            <Link to="/events" className="text-gray-600 hover:text-agbc-blue transition">
              <Calendar className="w-6 h-6" />
            </Link>
            <Link to="/services" className="text-gray-600 hover:text-agbc-blue transition">
              <ShoppingBag className="w-6 h-6" />
            </Link>
            <button className="text-gray-600 hover:text-agbc-blue transition">
              <Bell className="w-6 h-6" />
            </button>
            <Link to="/profile" className="text-gray-600 hover:text-agbc-blue transition">
              <div className="w-8 h-8 bg-gradient-to-br from-agbc-blue to-agbc-green rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user?.email.charAt(0).toUpperCase() || "U"}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
