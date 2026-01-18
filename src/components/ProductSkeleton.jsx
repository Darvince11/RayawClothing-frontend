import { Skeleton } from "./ui/skeleton";

export const ProductSkeleton = () => {
  return (
    // ADDED: w-full and max-w-[320px] to match your real cards and prevent shrinking
    <div className="flex flex-col space-y-4 w-full max-w-[320px]">
      {/* Image Placeholder */}
      <Skeleton className="h-[350px] w-full rounded-2xl bg-[#1F1F1F]" />
      
      {/* Text Details Placeholder */}
      <div className="space-y-3">
        {/* Title */}
        <Skeleton className="h-5 w-3/4 bg-[#1F1F1F] rounded" />
        {/* Price */}
        <Skeleton className="h-4 w-1/4 bg-[#1F1F1F] rounded" />
      </div>

      {/* Button Placeholder */}
      <Skeleton className="h-12 w-full rounded-lg bg-[#1F1F1F] mt-2" />
    </div>
  );
};