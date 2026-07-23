import { useEffect, useRef, useState } from "react";
import {
  FiSearch,
  FiX,
  FiLoader,
  FiCommand,
} from "react-icons/fi";

export default function SearchBar({
  value = "",
  placeholder = "Search...",
  onSearch = () => {},
  debounce = 300,
  loading = false,
  disabled = false,
  autoFocus = false,
  showShortcut = false,
  className = "",
}) {
  const [query, setQuery] = useState(value);

  const inputRef = useRef(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, debounce);

    return () => clearTimeout(timer);
  }, [query, debounce, onSearch]);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  function clearSearch() {
    setQuery("");
    onSearch("");
    inputRef.current?.focus();
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") {
      clearSearch();
    }

    if (e.key === "Enter") {
      onSearch(query);
    }
  }

  return (
    <div className={`relative w-full ${className}`}>
      {/* Search Icon */}

      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
        {loading ? (
          <FiLoader className="animate-spin" />
        ) : (
          <FiSearch />
        )}
      </div>

      {/* Input */}

      <input
        ref={inputRef}
        type="text"
        disabled={disabled}
        value={query}
        placeholder={placeholder}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="
          w-full
          rounded-xl
          border
          border-slate-200
          bg-white
          py-3
          pl-11
          pr-24
          text-sm
          shadow-sm
          outline-none
          transition-all
          duration-200

          placeholder:text-slate-400

          focus:border-blue-500
          focus:ring-4
          focus:ring-blue-100

          disabled:cursor-not-allowed
          disabled:bg-slate-100
          disabled:opacity-70
        "
      />

      {/* Right Side */}

      <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
        {showShortcut && !query && (
          <div className="hidden items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-500 lg:flex">
            <FiCommand size={11} />
            K
          </div>
        )}

        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="
              rounded-full
              p-1
              text-slate-400
              transition
              hover:bg-slate-100
              hover:text-slate-700
            "
          >
            <FiX size={16} />
          </button>
        )}
      </div>
    </div>
  );
}