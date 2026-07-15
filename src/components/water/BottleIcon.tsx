/** A generic, unbranded bottle silhouette — not a copy of any product's packaging. */
export function BottleIcon({ size = 48, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size * 1.6}
      viewBox="0 0 40 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M15 2h10v7c0 1.5 1 2.5 2 3.5 2 2 3 5 3 8v34c0 4-3 7-7 7h-6c-4 0-7-3-7-7V20.5c0-3 1-6 3-8 1-1 2-2 2-3.5V2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M14 2h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M13 26h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}
