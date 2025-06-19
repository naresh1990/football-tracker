import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ModernCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "gradient" | "pitch" | "premium";
  interactive?: boolean;
  glow?: boolean;
}

const ModernCard = React.forwardRef<HTMLDivElement, ModernCardProps>(
  ({ className, variant = "default", interactive = false, glow = false, children, ...props }, ref) => {
    const variants = {
      default: "bg-card border border-border shadow-lg",
      glass: "glass backdrop-blur-xl border-white/20",
      gradient: "bg-football-gradient text-white border-0",
      pitch: "bg-pitch-gradient text-white border-0 field-pattern",
      premium: "bg-white border-football shadow-premium"
    };

    const cardClasses = cn(
      "rounded-xl overflow-hidden transition-all duration-300",
      variants[variant],
      interactive && "interactive-card cursor-pointer hover:shadow-football",
      glow && "animate-glow",
      className
    );

    if (interactive) {
      return (
        <motion.div
          ref={ref}
          className={cardClasses}
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          {...props}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div ref={ref} className={cardClasses} {...props}>
        {children}
      </div>
    );
  }
);

ModernCard.displayName = "ModernCard";

const ModernCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-6 pb-4", className)}
      {...props}
    />
  )
);

ModernCardHeader.displayName = "ModernCardHeader";

const ModernCardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-2xl font-bold leading-none tracking-tight", className)}
      {...props}
    />
  )
);

ModernCardTitle.displayName = "ModernCardTitle";

const ModernCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground mt-2", className)}
      {...props}
    />
  )
);

ModernCardDescription.displayName = "ModernCardDescription";

const ModernCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);

ModernCardContent.displayName = "ModernCardContent";

const ModernCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
);

ModernCardFooter.displayName = "ModernCardFooter";

export {
  ModernCard,
  ModernCardHeader,
  ModernCardFooter,
  ModernCardTitle,
  ModernCardDescription,
  ModernCardContent,
};