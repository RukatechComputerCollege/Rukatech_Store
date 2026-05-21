import React from "react";

export function CardSkeletonLoader() {
  return (
    // For Cards Only
    <div className="space-y-sm">
      <div className="aspect-square skeleton rounded-lg"></div>
    </div>
  );
}

export function ProductsSkeletonLoader() {
  return (
    // For Products
    <div className="space-y-3">
      <div className="aspect-square skeleton rounded-lg"></div>
      <div className="w-full h-4 skeleton rounded"></div>
      <div className="w-2/3 h-5 skeleton rounded"></div>
      <div className="w-1/2 h-3 skeleton rounded opacity-50"></div>
    </div>
  );
}

export function RowSkeletonLoader() {
  return (
    // For Rows Only
    <div className="flex-1 overflow-y-auto py-md pl-3 mb-2">
      <div className="px-md flex gap-2">
        <div className="w-10 h-9 skeleton rounded-full"></div>
        <div className="w-full h-10 skeleton rounded-lg"></div>
      </div>
    </div>
  );
}
