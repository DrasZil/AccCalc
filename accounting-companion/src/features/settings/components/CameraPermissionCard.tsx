import PermissionStatusBadge from "../../../components/permissions/PermissionStatusBadge";

type CameraPermissionCardProps = {
    state: "enabled" | "blocked" | "unavailable" | "ask" | "unsupported";
    onRequest: () => void;
};

export default function CameraPermissionCard({
    state,
    onRequest,
}: CameraPermissionCardProps) {
    return (
        <div className="space-y-3 rounded-[1rem] border app-divider px-4 py-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="app-card-title text-sm">Camera access</p>
                    <p className="app-body-md mt-1 text-sm">
                        Camera is only used when you choose live capture in Scan & Check.
                    </p>
                </div>
                <PermissionStatusBadge state={state} />
            </div>

            <p className="app-helper text-xs leading-5">
                Request access only when you want to photograph a worksheet or textbook page. The app does not turn the camera on automatically.
            </p>

            <button
                type="button"
                onClick={onRequest}
                className="app-button-secondary rounded-xl px-4 py-2 text-sm font-medium"
            >
                Explain and request camera
            </button>
        </div>
    );
}

