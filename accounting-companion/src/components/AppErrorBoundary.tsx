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
                <div className="min-h-screen bg-[#050505] px-4 py-10 text-white">
                    <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-300">
                            AccCalc
                        </p>
                        <h1 className="mt-3 text-3xl font-bold tracking-tight">
                            The app hit a rendering error.
                        </h1>
                        <p className="mt-4 text-sm leading-7 text-gray-300 md:text-base">
                            {this.state.message}
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => window.location.reload()}
                                className="rounded-xl bg-green-500/90 px-4 py-2 text-sm font-medium text-black"
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
                                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white"
                            >
                                Try again
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    window.location.hash = "#/";
                                    window.location.reload();
                                }}
                                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white"
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
