import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ColorfulCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color: "primary" | "success" | "warning" | "info" | "secondary" | "danger";
  className?: string;
}

const colorVariants = {
  primary: "bg-gradient-primary",
  success: "bg-gradient-success", 
  warning: "bg-gradient-warning",
  info: "bg-primary",
  secondary: "bg-gradient-secondary",
  danger: "bg-danger"
};

export default function ColorfulCard({ 
  title, 
  value, 
  icon, 
  trend, 
  color, 
  className 
}: ColorfulCardProps) {
  return (
    <motion.div
      className={cn(
        "modern-card p-6 text-white border-none shadow-lg",
        colorVariants[color],
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
          <motion.p 
            className="text-3xl font-bold text-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            {value}
          </motion.p>
          {trend && (
            <div className="flex items-center mt-2">
              <span className={cn(
                "text-xs font-medium px-2 py-1 rounded-full",
                trend.isPositive 
                  ? "bg-white/20 text-white" 
                  : "bg-white/20 text-white"
              )}>
                {trend.isPositive ? "↗" : "↘"} {trend.value}
              </span>
            </div>
          )}
        </div>
        <div className="text-white/90 text-2xl">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}