import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Subject, timer, takeUntil } from "rxjs";

export interface UseTooltipUtilsProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

export interface UseTooltipUtilsResult {
  isHover: boolean;
  rect: DOMRect | null;
  handleMouseEnter: React.MouseEventHandler<HTMLDivElement>;
  handleMouseLeave: React.MouseEventHandler<HTMLDivElement>;
}

export function useTooltipUtils(props: UseTooltipUtilsProps): UseTooltipUtilsResult {
  const { containerRef } = props;
  const [isHover, setIsHover] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const cancel$ = useMemo(() => new Subject<void>(), []);
  useEffect(() => {
    return (): void => {
      cancel$.next();
      cancel$.complete();
    }
  }, [cancel$]);

  const handleMouseEnter = useCallback(() => {
    cancel$.next();

    timer(200)
      .pipe(takeUntil(cancel$))
      .subscribe(() => {
        setIsHover(true);
        setRect(containerRef.current?.getBoundingClientRect());
      });
  }, [cancel$]);

  const handleMouseLeave = useCallback(() => {
    setIsHover(false);
    setRect(null);
    cancel$.next();
  }, [cancel$]);

  return {
    isHover,
    rect,
    handleMouseEnter,
    handleMouseLeave,
  }
}
