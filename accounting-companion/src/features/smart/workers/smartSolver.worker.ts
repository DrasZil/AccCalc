/// <reference lib="webworker" />

import { analyzeSmartInput } from "../smartSolver.engine";
import type { FieldsState } from "../smartSolver.types";

type SmartSolverRequest = {
    id: string;
    fields: FieldsState;
    query: string;
};

self.addEventListener("message", (event: MessageEvent<SmartSolverRequest>) => {
    const payload = event.data;
    if (!payload?.id) return;

    try {
        const analysis = analyzeSmartInput(payload.fields, payload.query);
        self.postMessage({
            id: payload.id,
            ok: true,
            analysis,
        });
    } catch (error) {
        self.postMessage({
            id: payload.id,
            ok: false,
            error: error instanceof Error ? error.message : "Smart Solver analysis failed.",
        });
    }
});
