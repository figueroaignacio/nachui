/**
 * A printer's registration mark, the way a press sheet carries one outside the
 * trim. Decorative: it belongs to the frame, not to the content.
 */
export function RegistrationMark() {
  return (
    <div aria-hidden="true" className="pointer-events-none flex justify-center pt-6 pb-1">
      <svg
        viewBox="0 0 24 24"
        className="text-border-interactive size-4 opacity-70"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <circle cx="12" cy="12" r="7" />
        <circle cx="12" cy="12" r="2.5" />
        <path d="M12 0v6M12 18v6M0 12h6M18 12h6" />
      </svg>
    </div>
  );
}
