import React from 'react';

const HorizontalScrollSkeleton: React.FC = () => {
  return (
    <div className="w-full h-screen bg-black flex flex-col justify-center items-center relative overflow-hidden">
      {/* Label Skeleton */}
      <div className="absolute top-8 left-[10vw] w-32 h-4 bg-white/5 animate-pulse rounded" />
      
      {/* Cards Skeleton */}
      <div className="flex gap-8 px-[15vw] w-full">
        <div className="flex-shrink-0 w-[70vw] h-[70vh] bg-white/5 animate-pulse rounded-2xl" />
        <div className="flex-shrink-0 w-[70vw] h-[70vh] bg-white/5 animate-pulse rounded-2xl" />
      </div>

      {/* Progress Bar Skeleton */}
      <div className="absolute bottom-8 left-[10vw] right-[10vw] h-1 bg-white/5 rounded-full" />
    </div>
  );
};

export default HorizontalScrollSkeleton;
