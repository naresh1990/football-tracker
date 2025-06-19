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
  primary: "bg-gradient-to-br from-blue-500 to-blue-600",
  success: "bg-gradient-to-br from-green-500 to-green-600", 
  warning: "bg-gradient-to-br from-orange-500 to-orange-600",
  info: "bg-gradient-to-br from-cyan-500 to-cyan-600",
  secondary: "bg-gradient-to-br from-purple-500 to-purple-600",
  danger: "bg-gradient-to-br from-red-500 to-red-600"
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
        "rounded-2xl p-6 text-white border-none shadow-lg",
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