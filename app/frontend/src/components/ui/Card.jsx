export default function Card({
  children,
  title,
  subtitle,
  action,
  className = "",
  bodyClassName = "",
}) {
  return (
    <section
      className={`
        rounded-3xl
        border border-slate-200
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:shadow-lg
        dark:border-slate-800
        dark:bg-slate-900
        dark:shadow-slate-950/20
        ${className}
      `}
    >
      {(title || subtitle || action) && (
        <header className="flex items-start justify-between border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {title}
              </h3>
            )}

            {subtitle && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>

          {action && (
            <div className="ml-4 flex-shrink-0">
              {action}
            </div>
          )}
        </header>
      )}

      <div className={`p-6 ${bodyClassName}`}>
        {children}
      </div>
    </section>
  );
}