import { useCallback, useEffect, useState } from 'react';

interface Matches {
  matches: boolean;
}

const useMediaQuery = (width: number): boolean => {
  const [targetReached, setTargetReached] = useState(false);

  const updateTarget = useCallback((event: Matches) => {
    if (event.matches) {
      setTargetReached(true);
    } else {
      setTargetReached(false);
    }
  }, []);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${width}px)`);

    media.addEventListener('change', updateTarget);

    if (media.matches) {
      setTargetReached(true);
    }

    return () => media.removeEventListener('change', updateTarget);
  }, [updateTarget, width]);

  return targetReached;
};

export default useMediaQuery;
