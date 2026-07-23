import clsx from "clsx";

const variants = {
  New: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
  Qualified: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
  Converted: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  Lost: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
  FollowUp: { bg: "bg-violet-100", text: "text-violet-700", dot: "bg-violet-500" },
};

export default function LeadStatusBadge({ status = "New", size = "md" }) {
  const style = variants[status] || variants.New;
  const sizes = { sm: "px-2 py-1 text-xs", md: "px-3 py-1.5 text-sm", lg: "px-4 py-2 text-base" };

  return (
    <span className={clsx("inline-flex items-center gap-2 rounded-full font-semibold", style.bg, style.text, sizes[size])}>
      <span className={clsx("h-2 w-2 rounded-full", style.dot)} />
      {status}
    </span>
  );
}