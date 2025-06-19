import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  action?: React.ReactNode;
  variant?: "default" | "compact";
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  action,
  variant = "default"
}: EmptyStateProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }
  };

  if (variant === "compact") {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center justify-center py-8 px-4 text-center"
      >
        <motion.div
          variants={iconVariants}
          className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center mb-4"
        >
          <Icon className="w-6 h-6 text-blue-600" />
        </motion.div>
        
        <motion.h3
          variants={itemVariants}
          className="text-lg font-semibold text-gray-900 mb-2"
        >
          {title}
        </motion.h3>
        
        <motion.p
          variants={itemVariants}
          className="text-sm text-gray-500 mb-4 max-w-sm"
        >
          {description}
        </motion.p>
        
        {(action || (actionLabel && onAction)) && (
          <motion.div variants={itemVariants}>
            {action || (
              <Button
                onClick={onAction}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {actionLabel}
              </Button>
            )}
          </motion.div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <motion.div
        variants={iconVariants}
        className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl flex items-center justify-center mb-6 shadow-lg"
      >
        <Icon className="w-10 h-10 text-blue-600" />
      </motion.div>
      
      <motion.h2
        variants={itemVariants}
        className="text-2xl font-bold text-gray-900 mb-3"
      >
        {title}
      </motion.h2>
      
      <motion.p
        variants={itemVariants}
        className="text-gray-500 mb-8 max-w-md leading-relaxed"
      >
        {description}
      </motion.p>
      
      {(action || (actionLabel && onAction)) && (
        <motion.div variants={itemVariants}>
          {action || (
            <Button
              onClick={onAction}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {actionLabel}
            </Button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}