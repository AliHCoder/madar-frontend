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
    // error logged silently
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-6">
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #1099a6, #0d7a85)",
            boxShadow: "0 4px 12px rgba(16,153,166,0.3)",
          }}
        >
          <span className="text-white font-black text-lg">م</span>
        </div>
        <span className="text-3xl font-black text-gray-900">
          مدار
        </span>
      </div>
      <div className="text-6xl">⚠️</div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">
          مشکلی پیش آمد
        </h2>
        <p className="text-gray-500">لطفاً دوباره تلاش کنید.</p>
      </div>
      <Button onClick={reset}>تلاش مجدد</Button>
    </div>
  );
}
