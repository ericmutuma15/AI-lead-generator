const variants = {
  success:
    "bg-emerald-100 text-emerald-700 border border-emerald-200",

  warning:
    "bg-amber-100 text-amber-700 border border-amber-200",

  danger:
    "bg-red-100 text-red-700 border border-red-200",

  info:
    "bg-sky-100 text-sky-700 border border-sky-200",

  purple:
    "bg-violet-100 text-violet-700 border border-violet-200",

  gray:
    "bg-slate-100 text-slate-700 border border-slate-200",
};

const statusVariant = {
  New: "warning",

  Qualified: "info",

  Converted: "success",

  Lost: "danger",

  FollowUp: "purple",
};

export default function Badge({
  children,
  variant,
  status,
  className = "",
}) {
  const color =
    variant ||
    statusVariant[status] ||
    "gray";

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        whitespace-nowrap
        ${variants[color]}
        ${className}
      `}
    >
      {children || status}
    </span>
  );
}