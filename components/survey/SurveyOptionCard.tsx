type SurveyOptionCardProps<T extends string> = {
  label: string;
  description: string;
  value: T;
  selected: boolean;
  onSelect: (value: T) => void;
};

export function SurveyOptionCard<T extends string>({
  label,
  description,
  value,
  selected,
  onSelect,
}: SurveyOptionCardProps<T>) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={[
        "relative flex h-[156px] w-full flex-col justify-center rounded-2xl border bg-white p-6 text-left transition duration-200 active:scale-[0.98]",
        selected
          ? "border-blue-600 bg-blue-50 shadow-[0_12px_30px_rgba(37,99,235,0.14)]"
          : "border-slate-200 hover:border-blue-300 hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)]",
      ].join(" ")}
    >
      <span
        className={[
          "absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full border text-[11px] font-bold",
          selected
            ? "border-blue-600 bg-blue-600 text-white"
            : "border-slate-300 bg-white text-transparent",
        ].join(" ")}
      >
        ✓
      </span>

      <span className="block pr-8 text-base font-bold text-slate-950">
        {label}
      </span>
      <span className="mt-3 block min-h-10 pr-4 text-sm leading-5 text-slate-500">
        {description}
      </span>
    </button>
  );
}