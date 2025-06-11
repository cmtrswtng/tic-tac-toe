import * as React from "react";
import { VariantProps } from "../../types/ui";
import { cn } from "../../utils/cn";
import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center gap-2 justify-center whitespace-nowrap leading-none rounded-xl active:translate-y-[1px] text-sm font-medium ring-offset-background transition-colors focus:bg-destructive-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-destructive-foreground text-foreground hover:bg-destructive-foreground/80",
        primary:
          "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90 disabled:text-primary-foreground",
        outline:
          "border border-2 focus:bg-primary/90 focus:text-background border-primary text-primary bg-transparent hover:bg-primary hover:text-background",
        secondary: "bg-secondary text-primary hover:bg-secondary/50",
        ghost: "hover:bg-secondary hover:text-secondary-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        destructive:
          "bg-destructive-foreground hover:bg-destructive/90 hover:text-background",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps {
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant="default",
      size="default",
      children,
      disabled,
      loading,
      ...props
    },
    ref
  ) => {
    const Comp = "button";
    return (
      <Comp
        disabled={disabled || loading}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {!loading ? children : <span className="w-5 h-5 animate-spin">Loading...</span>}
      </Comp>
    );
  }
);
Button.displayName = "Button";
