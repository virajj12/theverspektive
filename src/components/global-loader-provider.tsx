"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Loader from "@/components/Loader";

const GlobalLoaderContext = createContext({
  loading: true,
});

export const useGlobalLoader = () => useContext(GlobalLoaderContext);

export default function GlobalLoaderProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  return (
    <GlobalLoaderContext.Provider value={{ loading }}>
      {loading && <Loader onComplete={() => setLoading(false)} />}
      {children}
    </GlobalLoaderContext.Provider>
  );
}
