export default function LoadingSkeleton({
  width = "w-full",
  height = "h-4",
  rounded = "rounded-lg",
  className = "",
}) {
  return (
    <div
      className={`
        animate-pulse
        bg-slate-200
        ${width}
        ${height}
        ${rounded}
        ${className}
      `}
    />
  );
}