import React from 'react';

interface VerifiedBadgeProps {
  size?: number;
  className?: string;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ size = 18, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        marginLeft: '4px',
      }}
      aria-label="Verified Profile"
    >
      <title>Verified Profile</title>
      {/* 12-point verified badge in theme blue */}
      <path
        d="M10.521 2.623a2 2 0 012.958 0l1.19 1.258a2 2 0 001.378.618l1.728.14a2 2 0 011.828 1.828l.14 1.728a2 2 0 00.618 1.378l1.258 1.19a2 2 0 010 2.958l-1.258 1.19a2 2 0 00-.618 1.378l-.14 1.728a2 2 0 01-1.828 1.828l-1.728.14a2 2 0 00-1.378.618l-1.19 1.258a2 2 0 01-2.958 0l-1.19-1.258a2 2 0 00-1.378-.618l-1.728-.14a2 2 0 01-1.828-1.828l-.14-1.728a2 2 0 00-.618-1.378l-1.258-1.19a2 2 0 010-2.958l1.258-1.19a2 2 0 00.618-1.378l.14-1.728a2 2 0 011.828-1.828l1.728-.14a2 2 0 001.378-.618l1.19-1.258z"
        fill="#1E6FE8"
      />
      {/* White checkmark */}
      <path
        d="M8.5 12.3l2.4 2.4 4.6-4.8"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
