import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export type SmartSolverPrefill = Record<
    string,
    string | number | undefined | null
    >;

    export type SmartSolverRouteState = {
    from?: string;
    query?: string;
    prefill?: SmartSolverPrefill;
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
    const hasAppliedRef = useRef(false);

    const {
        onlyFromSmartSolver = true,
        applyOnce = true,
        normalizeValue,
    } = options;

    useEffect(() => {
        const routeState = location.state as SmartSolverRouteState | null;

        if (!routeState?.prefill) return;

        if (onlyFromSmartSolver && routeState.from !== "smart-solver") {
        return;
        }

        if (applyOnce && hasAppliedRef.current) {
        return;
        }

        Object.entries(routeState.prefill).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        const setter = setters[key];
        if (!setter) return;

        const stringValue = String(value);
        const finalValue = normalizeValue
            ? normalizeValue(key, stringValue)
            : stringValue;

        setter(finalValue);
        });

        hasAppliedRef.current = true;
    }, [location.state, setters, onlyFromSmartSolver, applyOnce, normalizeValue]);

    return location.state as SmartSolverRouteState | null;
}