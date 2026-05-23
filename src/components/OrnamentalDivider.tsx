interface Props {
  className?: string;
}

const OrnamentalDivider = ({ className = "" }: Props) => (
  <div className={`flex items-center justify-center gap-4 ${className}`} aria-hidden>
    <span className="h-px w-24 bg-gradient-to-r from-transparent to-gold/60" />
    <svg width="40" height="40" viewBox="0 0 40 40" className="text-gold">
      <g fill="none" stroke="currentColor" strokeWidth="0.8">
        <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.3" />
        <path d="M20 8 C 24 14, 24 26, 20 32 C 16 26, 16 14, 20 8 Z" opacity="0.6" />
        <path d="M8 20 C 14 16, 26 16, 32 20 C 26 24, 14 24, 8 20 Z" opacity="0.6" />
      </g>
    </svg>
    <span className="h-px w-24 bg-gradient-to-l from-transparent to-gold/60" />
  </div>
);

export default OrnamentalDivider;
