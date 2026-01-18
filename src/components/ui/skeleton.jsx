// src/components/ui/skeleton.jsx
import React from "react";

// Simple utility to merge class names
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-800", className)}
      {...props}
    />
  );
}

export { Skeleton };