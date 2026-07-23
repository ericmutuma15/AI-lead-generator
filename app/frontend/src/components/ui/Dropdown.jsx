import { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

export default function Dropdown({
  trigger,
  label,
  items = [],
  children,
  className = "",
  align = "right",
  width = "w-64",
}) {
  const [open, setOpen] = useState(false);

  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        ref.current &&
        !ref.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const alignment =
    align === "left"
      ? "left-0"
      : "right-0";

  return (
    <div
      ref={ref}
      className={`relative inline-block ${className}`}
    >
      {/* Trigger */}

      {trigger ? (
        <div
          onClick={() => setOpen(!open)}
          className="cursor-pointer"
        >
          {trigger}
        </div>
      ) : (
        <button
          onClick={() => setOpen(!open)}
          className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4
            py-2
            text-sm
            shadow-sm
            transition
            hover:bg-slate-50
          "
        >
          {label}

          <FiChevronDown
            className={`transition duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      )}

      {/* Menu */}

      <div
        className={`
          absolute
          ${alignment}
          mt-3
          ${width}
          origin-top
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-2xl
          transition-all
          duration-200
          z-50

          ${
            open
              ? "scale-100 opacity-100"
              : "pointer-events-none scale-95 opacity-0"
          }
        `}
      >
        {children ? (
          <div className="p-2">
            {children}
          </div>
        ) : (
          items.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                item.onClick?.();
                setOpen(false);
              }}
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-4
                py-3
                text-left
                text-sm
                transition
                hover:bg-slate-100
              "
            >
              {item.icon}

              <span>{item.label}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}