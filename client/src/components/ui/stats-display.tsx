import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ModernCard } from "@/components/ui/modern-card";

interface StatsDisplayProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  variant?: "default" | "premium" | "gradient";
  className?: string;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  variant = "default",
  className
}) => {
  const variants = {
    default: "stats-card",
    premium: "bg-white border-football shadow-premium",
    gradient: "bg-football-gradient text-white"
  };

  const trendColors = {
    up: "text-green-500",
    down: "text-red-500",
    neutral: "text-gray-500"
  };

  return (
    <ModernCard 
      variant={variant === "gradient" ? "gradient" : "premium"} 
      interactive 
      className={cn(variants[variant], className)}
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className={cn(
              "text-sm font-medium",
              variant === "gradient" ? "text-white" : "text-gray-600"
            )}
            style={variant === "gradient" ? { textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' } : {}}
            >
              {title}
            </p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            >
              <p className={cn(
                "text-3xl font-bold text-display mt-2",
                variant === "gradient" ? "text-white" : "text-football-primary"
              )}
              style={variant === "gradient" ? { textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' } : {}}
              >
                {value}
              </p>
            </motion.div>
            {subtitle && (
              <p className={cn(
                "text-xs mt-1",
                variant === "gradient" ? "text-white" : "text-gray-500"
              )}
              style={variant === "gradient" ? { textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' } : {}}
              >
                {subtitle}
              </p>
            )}
          </div>
          
          {icon && (
            <motion.div
              className={cn(
                "ml-4 p-3 rounded-full",
                variant === "gradient" 
                  ? "bg-white/20 text-white" 
                  : "bg-football-primary/10 text-football-primary"
              )}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {icon}
            </motion.div>
          )}
        </div>
        
        {trend && trendValue && (
          <motion.div
            className="flex items-center mt-4 pt-4 border-t border-white/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className={cn(
              "flex items-center text-sm font-medium",
              variant === "gradient" ? "text-white" : trendColors[trend]
            )}>
              {trend === "up" && "↗"}
              {trend === "down" && "↘"}
              {trend === "neutral" && "→"}
              <span className="ml-1">{trendValue}</span>
            </div>
            <span className={cn(
              "ml-2 text-xs",
              variant === "gradient" ? "text-white/60" : "text-muted-foreground"
            )}>
              vs last period
            </span>
          </motion.div>
        )}
      </div>
    </ModernCard>
  );
};

export default StatsDisplay;