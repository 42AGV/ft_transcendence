import { useEffect, useState } from 'react';

export const useMediaQuery = (screenResolutionInPx: number) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const query = `(min-width: ${screenResolutionInPx}px)`;
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [matches, screenResolutionInPx]);

  return matches;
};
