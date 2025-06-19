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
    { name: "Dashboard", href: "/dashboard" },
    { name: "Games", href: "/games" },
    { name: "Tournaments", href: "/tournaments" },
    { name: "Training", href: "/training" },
    { name: "Statistics", href: "/statistics" },
    { name: "Clubs", href: "/clubs" },
  ];

  return (
    <header className="bg-football-green text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <svg className="w-8 h-8 text-field-green" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <h1 className="text-2xl font-bold">Darshil's Football Tracker</h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`hover:text-field-green transition-colors ${
                    location === item.href ? "text-field-green" : ""
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <Button 
              onClick={onQuickAdd}
              className="bg-field-green hover:bg-green-500 text-black px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Game
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={onToggleMobileMenu}
            className="md:hidden text-2xl"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
