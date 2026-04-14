import { useNavigate } from "react-router-dom";
import type { WorkpaperTransferBundle } from "./workpaperTypes.js";
import { queueWorkpaperTransfer } from "./workpaperStore.js";

type SendToWorkpaperButtonProps = {
    bundle: WorkpaperTransferBundle | null;
    className?: string;
    label?: string;
};

export default function SendToWorkpaperButton({
    bundle,
    className,
    label = "Send to Workpaper",
}: SendToWorkpaperButtonProps) {
    const navigate = useNavigate();

    return (
        <button
            type="button"
            disabled={!bundle}
            onClick={() => {
                if (!bundle) return;
                queueWorkpaperTransfer(bundle);
                navigate("/workpapers");
            }}
            className={[
                "rounded-xl px-4 py-2 text-sm font-semibold",
                bundle ? "app-button-secondary" : "app-button-ghost",
                className ?? "",
            ].join(" ").trim()}
        >
            {label}
        </button>
    );
}
