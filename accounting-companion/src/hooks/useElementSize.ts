import { useEffect, useRef, useState } from "react";

export function useElementSize<T extends HTMLElement>() {
    const ref = useRef<T | null>(null);
    const [size, setSize] = useState({
        width: 0,
        height: 0,
    });

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const syncSize = () => {
            const nextWidth = element.clientWidth;
            const nextHeight = element.clientHeight;
            setSize((current) =>
                current.width === nextWidth && current.height === nextHeight
                    ? current
                    : {
                          width: nextWidth,
                          height: nextHeight,
                      }
            );
        };

        syncSize();

        if (typeof ResizeObserver === "undefined") {
            window.addEventListener("resize", syncSize);
            return () => window.removeEventListener("resize", syncSize);
        }

        const observer = new ResizeObserver(syncSize);
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    return {
        ref,
        width: size.width,
        height: size.height,
    };
}
