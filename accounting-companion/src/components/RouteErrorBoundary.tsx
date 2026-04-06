import { Component, type ReactNode } from "react";
import AppBrandMark from "./AppBrandMark";
import type { RouteMeta } from "../utils/appCatalog";
import { clearDeploymentMismatch } from "../utils/offlineStatus";

type RouteErrorBoundaryProps = {
    children: ReactNode;
    routeMeta: RouteMeta | null;
    online: boolean;
    bundleReady: boolean;
};

type RouteErrorBoundaryState = {
    hasError: boolean;
    message: string;
    isChunkError: boolean;
};

function isChunkLoadError(error: Error) {
    return /dynamically imported module|Failed to fetch dynamically imported module|importing a module script failed/i.test(
        error.message || ""
    );
}

export default class RouteErrorBoundary extends Component<
    RouteErrorBoundaryProps,
    RouteErrorBoundaryState
> {
    state: RouteErrorBoundaryState = {
        hasError: false,
        message: "",
        isChunkError: false,
    };

    static getDerivedStateFromError(error: Error): RouteErrorBoundaryState {
        return {
            hasError: true,
            message: error.message || "Unexpected route loading error.",
            isChunkError: isChunkLoadError(error),
        };
    }

    componentDidCatch(error: Error) {
        console.error("Route render error:", error);
    }

    componentDidUpdate(prevProps: RouteErrorBoundaryProps) {
        if (
            this.state.hasError &&
            prevProps.routeMeta?.path !== this.props.routeMeta?.path
        ) {
            this.setState({
                hasError: false,
                message: "",
                isChunkError: false,
            });
        }
    }

    render() {
        if (!this.state.hasError) {
            return this.props.children;
        }

        const routeLabel = this.props.routeMeta?.label ?? "This page";
        const chunkFailure = this.state.isChunkError;
        const { online, bundleReady } = this.props;

        let title = "This route could not finish loading.";
        let body = this.state.message;

        if (chunkFailure && !online) {
            title = `${routeLabel} is not available in this offline session yet.`;
            body = bundleReady
                ? "This route should normally work offline after caching, but its files were not available to this tab. Reconnect once and reload so the current release can refresh cleanly."
                : "This browser has not finished caching the current release yet. Reconnect once so AccCalc can download the route files for reliable offline use.";
        } else if (chunkFailure) {
            title = `${routeLabel} is out of sync with the latest deployed files.`;
            body =
                "The current tab is pointing at route files that are no longer available. Refresh to load the latest release and reconnect the shell with the correct chunk set.";
        }

        return (
            <div className="app-page-stack">
                <div className="app-panel-elevated rounded-[var(--app-radius-xl)] p-6 md:p-8">
                    <AppBrandMark compact className="mb-4" />
                    <p className="app-kicker text-xs">
                        {chunkFailure ? "Route recovery" : "Rendering error"}
                    </p>
                    <h1 className="mt-3 text-3xl font-bold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)] md:text-4xl">
                        {title}
                    </h1>
                    <p className="app-body-lg mt-4 max-w-2xl text-sm md:text-base">
                        {body}
                    </p>

                    {this.props.routeMeta ? (
                        <div className="app-subtle-surface mt-5 rounded-[1.4rem] px-4 py-3.5">
                            <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                Offline support
                            </p>
                            <p className="app-body-md mt-2 text-sm">
                                {this.props.routeMeta.offlineDetail}
                            </p>
                        </div>
                    ) : null}

                    <div className="mt-6 flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                clearDeploymentMismatch();
                                window.location.reload();
                            }}
                            className="app-button-primary rounded-xl px-4 py-2 text-sm font-medium"
                        >
                            Refresh app
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                this.setState({
                                    hasError: false,
                                    message: "",
                                    isChunkError: false,
                                })
                            }
                            className="app-button-secondary rounded-xl px-4 py-2 text-sm font-medium"
                        >
                            Try again
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                clearDeploymentMismatch();
                                window.location.hash = "#/";
                            }}
                            className="app-button-ghost rounded-xl px-4 py-2 text-sm font-medium"
                        >
                            Go home
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
