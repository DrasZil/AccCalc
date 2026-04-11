import {
    type AnchorHTMLAttributes,
    type MouseEvent,
    type ReactNode,
} from "react";
import { Link, useNavigate } from "react-router-dom";

type TransitionLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    to: string;
    className?: string;
    children: ReactNode;
};

function prefersReducedMotion() {
    return (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
}

export default function TransitionLink({
    to,
    onClick,
    children,
    ...props
}: TransitionLinkProps) {
    const navigate = useNavigate();

    function handleClick(event: MouseEvent<HTMLAnchorElement>) {
        onClick?.(event);
        if (
            event.defaultPrevented ||
            event.button !== 0 ||
            event.metaKey ||
            event.altKey ||
            event.ctrlKey ||
            event.shiftKey ||
            prefersReducedMotion()
        ) {
            return;
        }

        if (!document.startViewTransition) {
            return;
        }

        event.preventDefault();
        document.startViewTransition(() => {
            navigate(to);
        });
    }

    return (
        <Link {...props} to={to} onClick={handleClick}>
            {children}
        </Link>
    );
}
