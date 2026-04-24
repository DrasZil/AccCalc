import { useEffect } from "react";

const LOCK_COUNT_KEY = "accalcScrollLockCount";
const LOCK_SCROLL_Y_KEY = "accalcScrollLockY";
const PREV_BODY_POSITION_KEY = "accalcPrevBodyPosition";
const PREV_BODY_TOP_KEY = "accalcPrevBodyTop";
const PREV_BODY_LEFT_KEY = "accalcPrevBodyLeft";
const PREV_BODY_RIGHT_KEY = "accalcPrevBodyRight";
const PREV_BODY_WIDTH_KEY = "accalcPrevBodyWidth";
const PREV_BODY_OVERFLOW_KEY = "accalcPrevBodyOverflow";
const PREV_BODY_TOUCH_ACTION_KEY = "accalcPrevBodyTouchAction";
const PREV_BODY_OVERSCROLL_KEY = "accalcPrevBodyOverscroll";
const PREV_HTML_OVERFLOW_KEY = "accalcPrevHtmlOverflow";
const PREV_HTML_OVERSCROLL_KEY = "accalcPrevHtmlOverscroll";

function readLockCount(body: HTMLElement) {
    const raw = Number(body.dataset[LOCK_COUNT_KEY] ?? "0");
    return Number.isFinite(raw) ? raw : 0;
}

export default function useBodyScrollLock(locked: boolean) {
    useEffect(() => {
        if (!locked || typeof document === "undefined" || typeof window === "undefined") {
            return;
        }

        const { body, documentElement } = document;
        const nextCount = readLockCount(body) + 1;
        body.dataset[LOCK_COUNT_KEY] = String(nextCount);

        if (nextCount === 1) {
            const scrollY = window.scrollY;
            body.dataset[LOCK_SCROLL_Y_KEY] = String(scrollY);
            body.dataset[PREV_BODY_POSITION_KEY] = body.style.position;
            body.dataset[PREV_BODY_TOP_KEY] = body.style.top;
            body.dataset[PREV_BODY_LEFT_KEY] = body.style.left;
            body.dataset[PREV_BODY_RIGHT_KEY] = body.style.right;
            body.dataset[PREV_BODY_WIDTH_KEY] = body.style.width;
            body.dataset[PREV_BODY_OVERFLOW_KEY] = body.style.overflow;
            body.dataset[PREV_BODY_TOUCH_ACTION_KEY] = body.style.touchAction;
            body.dataset[PREV_BODY_OVERSCROLL_KEY] = body.style.overscrollBehavior;
            body.dataset[PREV_HTML_OVERFLOW_KEY] = documentElement.style.overflow;
            body.dataset[PREV_HTML_OVERSCROLL_KEY] = documentElement.style.overscrollBehavior;

            body.style.position = "fixed";
            body.style.top = `-${scrollY}px`;
            body.style.left = "0";
            body.style.right = "0";
            body.style.width = "100%";
            body.style.overflow = "hidden";
            body.style.touchAction = "none";
            body.style.overscrollBehavior = "none";
            documentElement.style.overflow = "hidden";
            documentElement.style.overscrollBehavior = "none";
        }

        return () => {
            const currentCount = Math.max(0, readLockCount(body) - 1);
            body.dataset[LOCK_COUNT_KEY] = String(currentCount);

            if (currentCount > 0) {
                return;
            }

            const scrollY = Number(body.dataset[LOCK_SCROLL_Y_KEY] ?? "0");

            body.style.position = body.dataset[PREV_BODY_POSITION_KEY] ?? "";
            body.style.top = body.dataset[PREV_BODY_TOP_KEY] ?? "";
            body.style.left = body.dataset[PREV_BODY_LEFT_KEY] ?? "";
            body.style.right = body.dataset[PREV_BODY_RIGHT_KEY] ?? "";
            body.style.width = body.dataset[PREV_BODY_WIDTH_KEY] ?? "";
            body.style.overflow = body.dataset[PREV_BODY_OVERFLOW_KEY] ?? "";
            body.style.touchAction = body.dataset[PREV_BODY_TOUCH_ACTION_KEY] ?? "";
            body.style.overscrollBehavior = body.dataset[PREV_BODY_OVERSCROLL_KEY] ?? "";
            documentElement.style.overflow = body.dataset[PREV_HTML_OVERFLOW_KEY] ?? "";
            documentElement.style.overscrollBehavior =
                body.dataset[PREV_HTML_OVERSCROLL_KEY] ?? "";

            delete body.dataset[LOCK_COUNT_KEY];
            delete body.dataset[LOCK_SCROLL_Y_KEY];
            delete body.dataset[PREV_BODY_POSITION_KEY];
            delete body.dataset[PREV_BODY_TOP_KEY];
            delete body.dataset[PREV_BODY_LEFT_KEY];
            delete body.dataset[PREV_BODY_RIGHT_KEY];
            delete body.dataset[PREV_BODY_WIDTH_KEY];
            delete body.dataset[PREV_BODY_OVERFLOW_KEY];
            delete body.dataset[PREV_BODY_TOUCH_ACTION_KEY];
            delete body.dataset[PREV_BODY_OVERSCROLL_KEY];
            delete body.dataset[PREV_HTML_OVERFLOW_KEY];
            delete body.dataset[PREV_HTML_OVERSCROLL_KEY];

            window.scrollTo(0, Number.isFinite(scrollY) ? scrollY : 0);
        };
    }, [locked]);
}
