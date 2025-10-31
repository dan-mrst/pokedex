import { RefObject, useCallback } from "react";

export const useGetElementProperty = <T extends HTMLElement | null>(
  elementRef: RefObject<T>
) => {
  const getElementProperty = useCallback((): Omit<DOMRect, "toJSON"> => {
    const clientRect = elementRef.current?.getBoundingClientRect();
    if (clientRect) {
      return clientRect;
    }

    return {
      height: 0,
      width: 0,
      x: 0,
      y: 0,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    };
  }, [elementRef]);

  return {
    getElementProperty,
  };
};
