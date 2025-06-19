import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  Menu, 
  Plus, 
  Trophy, 
  BarChart3, 
  Target, 
  Building, 
  Users, 
  Calendar,
  Home,
  Settings
} from "lucide-react";

interface CleanHeaderProps {
  onToggleMobileMenu: () => void;
  onQuickAdd: () => void;
}

export default function CleanHeader({ onToggleMobileMenu, onQuickAdd }: CleanHeaderProps) {
  const [location] = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Games", href: "/games", icon: Target },
    { name: "Tournaments", href: "/tournaments", icon: Trophy },
    { name: "Training", href: "/training", icon: Calendar },
    { name: "Statistics", href: "/statistics", icon: BarChart3 },
    { name: "Clubs", href: "/clubs", icon: Building },
  ];

  return (
    <motion.header 
      className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2 sm:space-x-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white text-lg sm:text-xl">⚽</span>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Football Tracker</h1>
            </div>
          </motion.div>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={item.href}>
                    <motion.div
                      className={cn(
                        "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                        isActive 
                          ? "bg-blue-600 text-white shadow-md" 
                          : "text-gray-800 hover:text-gray-900 hover:bg-gray-50"
                      )}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <motion.button 
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-lg text-gray-800 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}