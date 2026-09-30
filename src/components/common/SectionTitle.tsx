import React from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  kicker?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  kicker,
  align = 'center',
  className = '',
}) => {
  const alignmentClass = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }[align];

  return (
    <div className={`flex flex-col ${alignmentClass} ${className} mb-12 md:mb-16`}>
      {kicker && (
        <span className="text-xs tracking-[0.25em] uppercase text-[#D9C2A3] mb-3 font-sans">
          {kicker}
        </span>
      )}

      <h2 className="title-fluid-section font-display text-[#E8ECEF] max-w-3xl">
        {title}
      </h2>

      {subtitle && (
        <p className="subtitle-editorial mt-4 max-w-2xl text-[#C7CCD1] leading-relaxed">
          {subtitle}
        </p>
      )}

      <div
        className={`w-12 h-[1px] bg-[#D9C2A3] opacity-40 mt-6 ${
          align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : ''
        }`}
      />
    </div>
  );
};
