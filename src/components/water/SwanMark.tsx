/**
 * An original, simplified swan silhouette mark — drawn for this page rather
 * than reproduced from any third party's logo artwork. Used to visually tie
 * the Swan Water section together without copying Swan's actual brand mark.
 */
export function SwanMark({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M46 40c3.5-2 5.5-6 5-10-1-7-7-11-13-9 2-4 1.5-8-1-11-2 3-3 6-2.5 9-4-1-8 .5-10 4.5-2 4-1 8 2 10.5-5 .5-9 3.5-11 8-1.5 3.5-1 7 1 9.5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 44c6 6 15 9 24 7 7-1.5 13-5.5 16-11"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="34.5" cy="14.5" r="1.6" fill="currentColor" />
    </svg>
  );
}
