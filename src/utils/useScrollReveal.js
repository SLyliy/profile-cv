import { useEffect } from "react";
import { initScrollReveal } from "./scrollReveal";

export function useScrollReveal(options) {
  useEffect(() => {
    const cleanup = initScrollReveal(options);
    return cleanup;
  }, [options]);
}
