export function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 250"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer P shape */}
      <path
        d="M0 0V250H40V150C40 150 40 100 80 100H120C160 100 180 80 180 40C180 0 160 0 120 0H0Z M40 40H120C140 40 140 40 140 40C140 40 140 40 120 60H80C60 60 40 60 40 80V40Z"
        fill="currentColor"
      />

      {/* Inner F shape */}
      <path
        d="M80 150V250H120V200H160V160H120V150H80Z"
        fill="currentColor"
      />
    </svg>
  );
}
