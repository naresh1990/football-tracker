import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ModernButton } from "@/components/ui/modern-button";
import { Menu, Plus, Trophy, BarChart3, Calendar, Target, Building, Users } from "lucide-react";

interface HeaderProps {
  onToggleMobileMenu: () => void;
  onQuickAdd: () => void;
}

export default function Header({ onToggleMobileMenu, onQuickAdd }: HeaderProps) {
  const [location] = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Games", href: "/games", icon: Target },
    { name: "Tournaments", href: "/tournaments", icon: Trophy },
    { name: "Training", href: "/training", icon: Users },
    { name: "Statistics", href: "/statistics", icon: BarChart3 },
    { name: "Clubs", href: "/clubs", icon: Building },
  ];

  return (
    <motion.header 
      className="bg-white/95 backdrop-blur-xl shadow-lg border-b border-football/10 sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-football-gradient rounded-xl flex items-center justify-center shadow-football">
                <span className="text-2xl">⚽</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-display text-gradient">Football Tracker</h1>
                <p className="text-xs text-muted-foreground">Performance Analytics</p>
              </div>
            </div>
          </motion.div>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={item.href}>
                    <ModernButton
                      variant={isActive ? "premium" : "ghost"}
                      className={`relative ${isActive ? "shadow-football" : ""}`}
                      icon={<Icon className="w-4 h-4" />}
                    >
                      {item.name}
                      {isActive && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-1 bg-football-gradient rounded-full"
                          layoutId="activeTab"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </ModernButton>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <ModernButton
                variant="premium"
                size="lg"
                onClick={onQuickAdd}
                icon={<Plus className="w-5 h-5" />}
                className="hidden sm:flex shadow-football"
              >
                Quick Add
              </ModernButton>
              
              <ModernButton
                variant="premium"
                size="icon"
                onClick={onQuickAdd}
                className="sm:hidden shadow-football"
              >
                <Plus className="w-5 h-5" />
              </ModernButton>
            </motion.div>
          </div>
          
          {/* Mobile Menu Button */}
          <motion.button 
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl bg-football-primary/10 text-football-primary hover:bg-football-primary/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}