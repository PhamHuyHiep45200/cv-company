"use client";
import { useEffect, useState, createContext, useContext } from "react";
import { usePathname } from "next/navigation";

const LoadingContext = createContext<{
  setLoading: (v: boolean) => void;
  loading: boolean;
}>({ setLoading: () => {}, loading: false });

export function useLoading() {
  return useContext(LoadingContext);
}

function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[rgba(0,0,0,0.3)]">
      <div className="relative flex items-center justify-center">
        {/* Animated conic-gradient border spinner */}
        <div
          className="w-20 h-20 rounded-full animate-spin"
          style={{
            background: 'conic-gradient(from 0deg, #309689, #3ad29f, #309689)',
            WebkitMask: 'radial-gradient(farthest-side, transparent 70%, black 71%)',
            mask: 'radial-gradient(farthest-side, transparent 70%, black 71%)',
          }}
        ></div>
        {/* Pulsing center dot */}
        <div className="absolute w-8 h-8 bg-gradient-to-r from-[#309689] to-[#3ad29f] rounded-full animate-pulse shadow-lg"></div>
      </div>
      <span className="mt-6 text-[#309689] text-lg font-semibold animate-pulse">Loading...</span>
    </div>
  );
}

export default function LoadingProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [routeLoading, setRouteLoading] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);

  useEffect(() => {
    setRouteLoading(true);
    const timeout = setTimeout(() => setRouteLoading(false), 600);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <LoadingContext.Provider value={{ setLoading: setGlobalLoading, loading: globalLoading }}>
      {(routeLoading || globalLoading) && <LoadingSpinner />}
      {children}
    </LoadingContext.Provider>
  );
} 