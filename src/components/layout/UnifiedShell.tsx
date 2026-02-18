import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  Briefcase, 
  Calendar, 
  Newspaper,
  ShoppingBag, 
  MessageSquare, 
  Bell, 
  User,
  Building2,
  Search,
  LogOut
} from "lucide-react";
import { getCurrentUser, logout } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import TierBadge from "@/components/ui/TierBadge";
import { useState } from "react";

const UnifiedShell = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navigation = [
    { name: "Home", path: "/dashboard", icon: Home, badge: null },
    { name: "Opportunities", path: "/opportunities", icon: Briefcase, badge: 3 },
    { name: "Events & News", path: "/events", icon: Calendar, badge: null },
    { name: "Services", path: "/services", icon: ShoppingBag, badge: null },
    { name: "Messages", path: "/messages", icon: MessageSquare, badge: 2 },
    { name: "Notifications", path: "#notifications", icon: Bell, badge: 5, action: () => setShowNotifications(!showNotifications) },
    { name: "Marketplace", path: "/marketplace", icon: ShoppingBag, badge: null },
    { name: "Index", path: "/index", icon: Building2, badge: null },
  ];

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const isActive = (path: string) => {
    if (path === "#notifications") return false;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-agbc-blue to-agbc-green rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">AG</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-xl text-agbc-blue">Afrika Global</span>
                <div className="text-xs text-gray-500">Business Ecosystem</div>
              </div>
            </Link>

            {/* Main Navigation - Icon Only with Tooltips */}
            <div className="hidden lg:flex items-center space-x-2">
              {navigation.map((item) => (
                <div key={item.path} className="relative group">
                  {item.action ? (
                    <button
                      onClick={item.action}
                      className={`p-3 rounded-lg transition flex items-center justify-center relative ${
                        showNotifications && item.path === "#notifications"
                          ? 'text-agbc-blue bg-blue-50'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.badge && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                          {item.badge}
                        </span>
                      )}
                      {/* Tooltip */}
                      <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-3 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition pointer-events-none z-50">
                        {item.name}
                      </span>
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      className={`p-3 rounded-lg transition flex items-center justify-center relative ${
                        isActive(item.path)
                          ? 'text-agbc-blue bg-blue-50'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.badge && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                          {item.badge}
                        </span>
                      )}
                      {/* Tooltip */}
                      <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-3 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition pointer-events-none z-50">
                        {item.name}
                      </span>
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Global Search */}
              <div className="hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search across all platforms..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agbc-blue focus:border-transparent text-sm w-64"
                  />
                </div>
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 hover:bg-gray-100 rounded-lg p-2 transition"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-agbc-blue to-agbc-green rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.email.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="hidden lg:block text-left">
                    <div className="text-sm font-semibold text-gray-900">{user?.email.split('@')[0]}</div>
                    <div className="text-xs text-gray-500">
                      <TierBadge tier={user?.membershipTier || "Free"} />
                    </div>
                  </div>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="font-semibold text-gray-900">{user?.email}</div>
                      <div className="text-sm text-gray-500">{user?.role}</div>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <User className="w-4 h-4" />
                      View Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Settings
                    </Link>
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden border-t border-gray-200 px-4 py-2 overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            {navigation.slice(0, 8).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-2 relative ${
                  isActive(item.path)
                    ? 'text-agbc-blue bg-blue-50'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="fixed top-16 right-4 w-96 max-h-[500px] bg-white rounded-lg shadow-xl border border-gray-200 z-40 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Notifications</h3>
              <button className="text-sm text-agbc-blue hover:underline">Mark all read</button>
            </div>
          </div>
          <div className="overflow-y-auto max-h-[400px]">
            {[
              { title: "New opportunity match", desc: "3 new opportunities match your profile", time: "5m ago", unread: true },
              { title: "Message from Buyer", desc: "Ahmed El-Sayed sent you a message", time: "1h ago", unread: true },
              { title: "Event reminder", desc: "AfCFTA Webinar starts in 2 hours", time: "2h ago", unread: false },
              { title: "Order update", desc: "Your order #1234 has shipped", time: "1d ago", unread: false },
              { title: "Profile viewed", desc: "5 buyers viewed your profile today", time: "1d ago", unread: false },
            ].map((notif, idx) => (
              <div key={idx} className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${notif.unread ? 'bg-blue-50' : ''}`}>
                <div className="flex items-start gap-3">
                  {notif.unread && <div className="w-2 h-2 rounded-full bg-agbc-blue mt-2 flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm">{notif.title}</div>
                    <div className="text-sm text-gray-600 mt-0.5">{notif.desc}</div>
                    <div className="text-xs text-gray-500 mt-1">{notif.time}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-gray-200 text-center">
            <Link to="/notifications" className="text-sm text-agbc-blue hover:underline font-medium">
              View all notifications
            </Link>
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <main className="pt-16 lg:pt-16">
        {children}
      </main>
    </div>
  );
};

export default UnifiedShell;
