import type { ReactNode } from "react";
import { Component } from "react";

type AppErrorBoundaryProps = {
    children: ReactNode;
};

type AppErrorBoundaryState = {
    hasError: boolean;
    message: string;
};

export default class AppErrorBoundary extends Component<
    AppErrorBoundaryProps,
    AppErrorBoundaryState
> {
    state: AppErrorBoundaryState = {
        hasError: false,
        message: "",
    };

    static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
        return {
            hasError: true,
            message: error.message || "Unexpected rendering error.",
        };
    }

    componentDidCatch(error: Error) {
        console.error("App render error:", error);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen px-4 py-10 text-[color:var(--app-text)]">
                    <div className="app-panel-elevated mx-auto max-w-2xl rounded-[var(--app-radius-xl)] p-6">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--app-accent)]">
                            AccCalc
                        </p>
                        <h1 className="mt-3 text-3xl font-bold tracking-tight">
                            The app hit a rendering error.
                        </h1>
                        <p className="mt-4 text-sm leading-7 text-[color:var(--app-text-secondary)] md:text-base">
                            {this.state.message}
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => window.location.reload()}
                                className="app-button-primary rounded-xl px-4 py-2 text-sm font-medium"
                            >
                                Reload app
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    this.setState({
                                        hasError: false,
                                        message: "",
                                    })
                                }
                                className="app-button-secondary rounded-xl px-4 py-2 text-sm font-medium"
                            >
                                Try again
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    window.location.hash = "#/";
                                    window.location.reload();
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

        return this.props.children;
    }
}
