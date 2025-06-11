import * as React from "react";
import { cn } from "../../utils/cn";

const TextInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, value, onChange, ...props }, ref) => {

    return (
      <div className="relative flex items-center">
        <input
          className={cn(
            "flex-1 w-full transition-all rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:shadow-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none overflow-hidden", className
          )}
          ref={ref}
          value={value}
          onChange={onChange}
          {...props}
        />
      </div>
    );
  }
);

TextInput.displayName = "TextInput";

export { TextInput };
