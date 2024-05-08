'use client';

import { debounce } from 'lodash';
import { type RefObject, useEffect, useRef, useState } from 'react';

/**
 * Hook to get the size of an element
 * @param ref Element reference
 * @returns Object with width and height of the element
 */
export const useContainerSize = (ref: RefObject<HTMLElement>) => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const setSizeDebounced = useRef(debounce(setSize, 100));

  // biome-ignore lint/correctness/useExhaustiveDependencies: we dont need to track debounce fn
  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        setSizeDebounced.current({
          width: ref.current.offsetWidth,
          height: ref.current.offsetHeight,
        });
      } else {
        setSizeDebounced.current({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [ref, setSizeDebounced]);

  return size;
};
