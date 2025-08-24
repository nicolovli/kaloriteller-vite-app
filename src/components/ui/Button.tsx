import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseClasses = "button";
  const variantClasses = {
    primary: "button--primary",
    secondary: "button--secondary",
    outline: "button--outline",
    ghost: "button--ghost",
  };
  const sizeClasses = {
    sm: "button--sm",
    md: "button--md",
    lg: "button--lg",
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    loading ? "button--loading" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading && <span className="button__spinner" />}
      {children}
    </button>
  );
};
