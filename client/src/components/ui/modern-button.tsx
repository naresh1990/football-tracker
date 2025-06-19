import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const modernButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 interactive-button",
  {
    variants: {
      variant: {
        default: "bg-football-primary text-white hover:bg-football-secondary shadow-football",
        premium: "bg-football-gradient text-white shadow-premium hover:shadow-football",
        glass: "glass text-football-primary hover:bg-white/20 border border-football/20",
        pitch: "bg-pitch-gradient text-white field-pattern hover:opacity-90",
        outline: "border-2 border-football text-football-primary hover:bg-football-primary hover:text-white",
        ghost: "text-football-primary hover:bg-football-primary/10",
        destructive: "bg-red-500 text-white hover:bg-red-600 shadow-lg"
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg px-4",
        lg: "h-14 rounded-xl px-8 text-base",
        xl: "h-16 rounded-2xl px-10 text-lg",
        icon: "h-11 w-11"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ModernButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof modernButtonVariants> {
  asChild?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const ModernButton = React.forwardRef<HTMLButtonElement, ModernButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    loading = false,
    icon,
    iconPosition = "left",
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : motion.button;

    const buttonContent = (
      <>
        {loading && (
          <motion.div
            className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )}
        {icon && iconPosition === "left" && !loading && (
          <span className="mr-2">{icon}</span>
        )}
        {children}
        {icon && iconPosition === "right" && !loading && (
          <span className="ml-2">{icon}</span>
        )}
      </>
    );

    if (asChild) {
      return (
        <Slot className={cn(modernButtonVariants({ variant, size, className }))}>
          {children}
        </Slot>
      );
    }

    return (
      <motion.button
        className={cn(modernButtonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        {...props}
      >
        {buttonContent}
      </motion.button>
    );
  }
);

ModernButton.displayName = "ModernButton";

export { ModernButton, modernButtonVariants };