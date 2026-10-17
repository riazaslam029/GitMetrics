interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = 'h-4 w-full' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-slate-800/60 rounded-lg border border-white/5 ${className}`}
    />
  );
}

export function RepoCardSkeleton() {
  return (
    <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-2 mt-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
}
