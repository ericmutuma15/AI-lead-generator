import { FiInbox } from "react-icons/fi";
import Button from "./Button";

export default function EmptyState({
  icon,
  title = "Nothing here yet",
  description = "There's nothing to display at the moment.",
  actionLabel,
  onAction,
  children,
}) {
  const Icon = icon || FiInbox;

  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-8 py-16 text-center shadow-sm">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
        <Icon className="h-10 w-10 text-slate-400" />
      </div>

      <h3 className="mt-6 text-xl font-semibold text-slate-800">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>

      {children && (
        <div className="mt-6">
          {children}
        </div>
      )}

      {actionLabel && onAction && (
        <div className="mt-8">
          <Button onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}