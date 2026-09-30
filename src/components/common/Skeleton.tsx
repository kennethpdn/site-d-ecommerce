import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`bg-[#14294A]/60 animate-pulse border border-argent-20/40 ${className}`}
      aria-hidden="true"
    />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col bg-[#14294A]/40 border border-argent-20/40 p-0 overflow-hidden">
      <div className="aspect-[4/5] bg-[#060F1F] animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-1/3 bg-[#14294A] animate-pulse" />
        <div className="h-5 w-3/4 bg-[#14294A] animate-pulse" />
        <div className="h-4 w-1/4 bg-[#14294A] animate-pulse" />
        <div className="h-9 w-full bg-[#14294A] animate-pulse mt-4" />
      </div>
    </div>
  );
};

export const UniversTileSkeleton: React.FC = () => {
  return (
    <div className="min-h-[260px] p-6 bg-[#14294A]/30 border border-argent-20/40 flex flex-col justify-between animate-pulse">
      <div className="h-3 w-12 bg-[#14294A]" />
      <div className="space-y-3 my-4">
        <div className="h-6 w-2/3 bg-[#14294A]" />
        <div className="h-4 w-5/6 bg-[#14294A]" />
      </div>
      <div className="h-4 w-1/3 bg-[#14294A]" />
    </div>
  );
};
