import type {
    ReminderCategory,
    ReminderFrequency,
    ReminderTone,
} from "../../../services/notifications/notificationCopy";
import PermissionStatusBadge from "../../../components/permissions/PermissionStatusBadge";

type NotificationPreferencesCardProps = {
    enabled: boolean;
    permissionState: "enabled" | "blocked" | "unavailable" | "ask" | "unsupported";
    category: ReminderCategory;
    tone: ReminderTone;
    frequency: ReminderFrequency;
    preview: string;
    onToggle: (value: boolean) => void;
    onCategoryChange: (value: ReminderCategory) => void;
    onToneChange: (value: ReminderTone) => void;
    onFrequencyChange: (value: ReminderFrequency) => void;
    onRequestPermission: () => void;
    onSendPreview: () => void;
};

export default function NotificationPreferencesCard({
    enabled,
    permissionState,
    category,
    tone,
    frequency,
    preview,
    onToggle,
    onCategoryChange,
    onToneChange,
    onFrequencyChange,
    onRequestPermission,
    onSendPreview,
}: NotificationPreferencesCardProps) {
    const notificationsUnavailable = permissionState === "unsupported" || permissionState === "unavailable";
    const notificationsBlocked = permissionState === "blocked";

    return (
        <div className="space-y-4 rounded-[1rem] border app-divider px-4 py-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="app-card-title text-sm">Reminder preferences</p>
                    <p className="app-body-md mt-1 text-sm">
                        {notificationsUnavailable
                            ? "This browser session can keep using in-app notices, but system-level browser reminders are unavailable here."
                            : "Browser-first reminders work best while the app is open or recently active."}
                    </p>
                </div>
                <PermissionStatusBadge state={permissionState} />
            </div>

            <div className="grid gap-3 md:grid-cols-3">
                <label className="space-y-1">
                    <span className="app-helper text-xs uppercase tracking-[0.16em]">Category</span>
                    <select
                        value={category}
                        onChange={(event) => onCategoryChange(event.target.value as ReminderCategory)}
                        className="app-select w-full rounded-xl px-3 py-2 text-sm"
                    >
                        <option value="study-motivation">Study motivation</option>
                        <option value="struggle-motivation">Struggle motivation</option>
                        <option value="comfort">Comfort</option>
                        <option value="focus">Focus</option>
                        <option value="saved-work">Saved work follow-up</option>
                    </select>
                </label>

                <label className="space-y-1">
                    <span className="app-helper text-xs uppercase tracking-[0.16em]">Tone</span>
                    <select
                        value={tone}
                        onChange={(event) => onToneChange(event.target.value as ReminderTone)}
                        className="app-select w-full rounded-xl px-3 py-2 text-sm"
                    >
                        <option value="soft">Soft</option>
                        <option value="focused">Focused</option>
                        <option value="motivational">Motivational</option>
                        <option value="comforting">Comforting</option>
                        <option value="practical">Practical</option>
                    </select>
                </label>

                <label className="space-y-1">
                    <span className="app-helper text-xs uppercase tracking-[0.16em]">Frequency</span>
                    <select
                        value={frequency}
                        onChange={(event) => onFrequencyChange(event.target.value as ReminderFrequency)}
                        className="app-select w-full rounded-xl px-3 py-2 text-sm"
                    >
                        <option value="rare">Rare</option>
                        <option value="light">Light</option>
                        <option value="moderate">Moderate</option>
                    </select>
                </label>
            </div>

            <div className="app-subtle-surface rounded-[1rem] px-4 py-3">
                <p className="app-helper text-xs uppercase tracking-[0.16em]">Preview</p>
                <p className="app-body-md mt-2 text-sm">{preview}</p>
            </div>

            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => onToggle(!enabled)}
                    className="app-button-secondary rounded-xl px-4 py-2 text-sm font-medium"
                >
                    {enabled ? "Reminders on" : "Reminders off"}
                </button>
                <button
                    type="button"
                    onClick={onRequestPermission}
                    disabled={notificationsUnavailable}
                    className="app-button-secondary rounded-xl px-4 py-2 text-sm font-medium"
                >
                    {notificationsUnavailable
                        ? "Browser notifications unavailable"
                        : "Explain and request notifications"}
                </button>
                <button
                    type="button"
                    onClick={onSendPreview}
                    disabled={notificationsUnavailable || notificationsBlocked}
                    className="app-button-ghost rounded-xl px-4 py-2 text-sm font-medium"
                >
                    Send preview
                </button>
            </div>
        </div>
    );
}
