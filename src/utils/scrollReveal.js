// IntersectionObserver-based reveal-on-scroll helper.
export function initScrollReveal({
  selector = "[data-reveal]",
  rootMargin = "0px 0px -12% 0px",
  threshold = 0.15,
  once = true,
} = {}) {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return () => {};
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const trackedElements = new WeakSet();
  const collectRevealElements = (node) => {
    if (!(node instanceof Element)) {
      return [];
    }

    const matches = [];
    if (node.matches(selector)) {
      matches.push(node);
    }

    matches.push(...node.querySelectorAll(selector));
    return matches;
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        if (once) obs.unobserve(entry.target);
      });
    },
    { rootMargin, threshold },
  );

  const registerElement = (element) => {
    if (trackedElements.has(element)) {
      return;
    }

    trackedElements.add(element);

    if (prefersReducedMotion) {
      element.classList.add("is-visible");
      return;
    }

    observer.observe(element);
  };

  collectRevealElements(document.body).forEach(registerElement);

  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        collectRevealElements(node).forEach(registerElement);
      });
    });
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return () => {
    mutationObserver.disconnect();
    observer.disconnect();
  };
}
