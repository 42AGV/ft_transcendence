import * as React from 'react';

export function useIsElementVisible() {
  const [isVisible, setIsVisible] = React.useState(false);
  const observer = React.useRef<IntersectionObserver | null>();

  const ref = React.useCallback((element: HTMLLIElement) => {
    if (element) {
      const callback: IntersectionObserverCallback = (entries) => {
        entries.forEach((entry) => {
          if (element === entry.target) {
            setIsVisible(entry.isIntersecting);
            if (entry.isIntersecting) {
              observer.current?.unobserve(element);
            }
          }
        });
      };

      if (observer.current) {
        observer.current?.disconnect();
      }
      observer.current = new IntersectionObserver(callback);
      observer.current.observe(element);
    } else {
      setIsVisible(false);
    }
  }, []);

  return { ref, isVisible };
}
