import { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";

export type SmartSolverPrefill = Record<
    string,
    string | number | undefined | null
>;

export type SmartSolverRouteState = {
    from?: string;
    query?: string;
    prefill?: SmartSolverPrefill;
    solveTarget?: string;
};

export type SmartSolverSetterMap = Record<
    string,
    (value: string) => void
>;

type UseSmartSolverConnectorOptions = {
    onlyFromSmartSolver?: boolean;
    applyOnce?: boolean;
    normalizeValue?: (key: string, value: string) => string;
};

export function useSmartSolverConnector(
    setters: SmartSolverSetterMap,
    options: UseSmartSolverConnectorOptions = {}
) {
    const location = useLocation();
    const settersRef = useRef(setters);
    const normalizeValueRef = useRef(options.normalizeValue);
    const appliedSignatureRef = useRef<string | null>(null);

    const {
        onlyFromSmartSolver = true,
        applyOnce = true,
        normalizeValue,
    } = options;

    useEffect(() => {
        settersRef.current = setters;
        normalizeValueRef.current = normalizeValue;
    }, [setters, normalizeValue]);

    const prefillSignature = useMemo(() => {
        const routeState = location.state as SmartSolverRouteState | null;
        if (!routeState?.prefill) return null;

        return JSON.stringify({
            path: location.pathname,
            from: routeState.from ?? "",
            prefill: routeState.prefill,
        });
    }, [location.pathname, location.state]);

    useEffect(() => {
        const routeState = location.state as SmartSolverRouteState | null;

        if (!routeState?.prefill) return;

        if (onlyFromSmartSolver && routeState.from !== "smart-solver") {
            return;
        }

        if (applyOnce && appliedSignatureRef.current === prefillSignature) {
            return;
        }

        Object.entries(routeState.prefill).forEach(([key, value]) => {
            if (value === undefined || value === null) return;

            const setter = settersRef.current[key];
            if (!setter) return;

            const stringValue = String(value);
            const finalValue = normalizeValueRef.current
                ? normalizeValueRef.current(key, stringValue)
                : stringValue;

            setter(finalValue);
        });

        appliedSignatureRef.current = prefillSignature;
    }, [location.state, location.pathname, onlyFromSmartSolver, applyOnce, prefillSignature]);

    return location.state as SmartSolverRouteState | null;
}
