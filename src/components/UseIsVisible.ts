import { useEffect, useRef, useState, RefObject } from 'react';

interface UseIsVisibleOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean; // disconnect after first time it becomes visible
}

export function useIsVisible<T extends Element = HTMLDivElement>(
  { root = null, rootMargin = '0px', threshold = 0, once = false }: UseIsVisibleOptions = {}
): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting && once) {
          observer.disconnect();
        }
      },
      { root, rootMargin, threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [root, rootMargin, threshold, once]);

  return [ref, isVisible];
}
