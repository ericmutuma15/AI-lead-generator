import { useMemo } from "react";

export default function Avatar({
  name = "",
  src = "",
  size = "md",
  status,
  square = false,
  className = "",
}) {
  const initials = useMemo(() => {
    if (!name) return "?";

    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  }, [name]);

  const sizes = {
    xs: "w-8 h-8 text-xs",
    sm: "w-10 h-10 text-sm",
    md: "w-12 h-12 text-base",
    lg: "w-16 h-16 text-lg",
    xl: "w-20 h-20 text-xl",
    "2xl": "w-24 h-24 text-2xl",
  };

  const statusColors = {
    online: "bg-emerald-500",
    away: "bg-amber-500",
    busy: "bg-red-500",
    offline: "bg-slate-400",
  };

  return (
    <div className={`relative inline-flex ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`
            ${sizes[size]}
            ${square ? "rounded-xl" : "rounded-full"}
            object-cover
            border
            border-slate-200
            shadow-sm
          `}
        />
      ) : (
        <div
          className={`
            ${sizes[size]}
            ${square ? "rounded-xl" : "rounded-full"}

            bg-gradient-to-br
            from-blue-600
            to-indigo-600

            text-white
            font-semibold

            flex
            items-center
            justify-center

            shadow-sm
          `}
        >
          {initials}
        </div>
      )}

      {status && (
        <span
          className={`
            absolute
            bottom-0
            right-0

            h-3.5
            w-3.5

            rounded-full
            border-2
            border-white

            ${statusColors[status]}
          `}
        />
      )}
    </div>
  );
}