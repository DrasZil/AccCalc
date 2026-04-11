import { useEffect, useMemo, useState } from "react";
import {
    INITIAL_FIELDS,
    analyzeSmartInput,
} from "./smartSolver.engine";
import type { FieldsState, SmartSolverAnalysis } from "./smartSolver.types";

type SmartSolverResponse =
    | {
          id: string;
          ok: true;
          analysis: SmartSolverAnalysis;
      }
    | {
          id: string;
          ok: false;
          error: string;
      };

let smartSolverWorker: Worker | null = null;
const pending = new Map<
    string,
    {
        resolve: (value: SmartSolverAnalysis) => void;
        reject: (reason?: unknown) => void;
    }
>();

function ensureSmartSolverWorker() {
    if (smartSolverWorker || typeof Worker === "undefined") {
        return smartSolverWorker;
    }

    smartSolverWorker = new Worker(new URL("./workers/smartSolver.worker.ts", import.meta.url), {
        type: "module",
    });

    smartSolverWorker.addEventListener(
        "message",
        (event: MessageEvent<SmartSolverResponse>) => {
            const response = event.data;
            const request = pending.get(response.id);
            if (!request) return;

            pending.delete(response.id);
            if (response.ok) {
                request.resolve(response.analysis);
                return;
            }

            request.reject(new Error(response.error));
        }
    );

    smartSolverWorker.addEventListener("error", (event) => {
        pending.forEach(({ reject }) =>
            reject(event.error ?? new Error("Smart Solver worker failed."))
        );
        pending.clear();
        smartSolverWorker?.terminate();
        smartSolverWorker = null;
    });

    return smartSolverWorker;
}

function requestBackgroundAnalysis(fields: FieldsState, query: string) {
    const worker = ensureSmartSolverWorker();
    if (!worker) {
        return Promise.resolve(analyzeSmartInput(fields, query));
    }

    const id = `smart-analysis-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    return new Promise<SmartSolverAnalysis>((resolve, reject) => {
        pending.set(id, { resolve, reject });
        try {
            worker.postMessage({ id, fields, query });
        } catch (error) {
            pending.delete(id);
            worker.terminate();
            smartSolverWorker = null;
            reject(error);
        }
    }).catch(() => analyzeSmartInput(fields, query));
}

export function useSmartSolverAnalysis(fields: FieldsState, query: string) {
    const emptyAnalysis = useMemo(
        () => analyzeSmartInput({ ...INITIAL_FIELDS }, ""),
        []
    );
    const [analysis, setAnalysis] = useState<SmartSolverAnalysis>(() =>
        query.trim() === "" && Object.values(fields).every((value) => value.trim() === "")
            ? emptyAnalysis
            : analyzeSmartInput(fields, query)
    );
    const [pendingAnalysis, setPendingAnalysis] = useState(false);

    useEffect(() => {
        const hasAnyInput =
            query.trim() !== "" || Object.values(fields).some((value) => value.trim() !== "");

        if (!hasAnyInput) {
            setAnalysis(emptyAnalysis);
            setPendingAnalysis(false);
            return;
        }

        let cancelled = false;
        setPendingAnalysis(true);

        void requestBackgroundAnalysis(fields, query)
            .then((nextAnalysis) => {
                if (cancelled) return;
                setAnalysis(nextAnalysis);
            })
            .finally(() => {
                if (cancelled) return;
                setPendingAnalysis(false);
            });

        return () => {
            cancelled = true;
        };
    }, [emptyAnalysis, fields, query]);

    return {
        analysis,
        pendingAnalysis,
    };
}
