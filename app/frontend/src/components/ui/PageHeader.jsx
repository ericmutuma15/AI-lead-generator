import { Link } from "react-router-dom";

export default function PageHeader({
  title,
  subtitle,
  action,
  backTo,
  children,
  className = "",
}) {
  return (
    <div className={`flex flex-col gap-4 rounded-[28px] border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 sm:flex-row sm:items-end sm:justify-between ${className}`}>
      <div className="space-y-2">
        {backTo && (
          <Link to={backTo} className="inline-flex items-center text-sm font-medium text-blue-600 transition hover:text-blue-700">
            ← Back
          </Link>
        )}

        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
      </div>

      {action ? <div className="flex-shrink-0">{action}</div> : null}
      {children}
    </div>
  );
}
