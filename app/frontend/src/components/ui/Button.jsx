export default function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  icon = null,
  loading = false,
  disabled = false,
  fullWidth = false,
  className = "",
  onClick,
}) {
  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20",

    secondary:
      "bg-slate-900 text-white hover:bg-slate-800",

    outline:
      "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100",

    ghost:
      "bg-transparent text-slate-600 hover:bg-slate-100",

    success:
      "bg-emerald-600 text-white hover:bg-emerald-700",

    danger:
      "bg-red-600 text-white hover:bg-red-700",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",

    md: "px-5 py-2.5 text-sm",

    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-xl
        font-medium
        transition-all
        duration-200
        hover:-translate-y-0.5
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      {loading ? (
        <>
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              opacity="0.25"
            />

            <path
              fill="currentColor"
              d="M22 12a10 10 0 00-10-10v4a6 6 0 016 6h4z"
            />
          </svg>

          Loading...
        </>
      ) : (
        <>
          {icon}

          {children}
        </>
      )}
    </button>
  );
}