"use client";
import { useEffect } from "react";
import Button from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-6">
      <div className="text-6xl">⚠️</div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          مشکلی پیش آمد
        </h2>
        <p className="text-gray-500">لطفاً دوباره تلاش کنید.</p>
      </div>
      <Button onClick={reset}>تلاش مجدد</Button>
    </div>
  );
}
