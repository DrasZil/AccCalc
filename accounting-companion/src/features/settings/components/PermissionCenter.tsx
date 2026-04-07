import CameraPermissionCard from "./CameraPermissionCard";
import NotificationPreferencesCard from "./NotificationPreferencesCard";
import StorageConsentCard from "./StorageConsentCard";
import type {
    ReminderCategory,
    ReminderFrequency,
    ReminderTone,
} from "../../../services/notifications/notificationCopy";

type PermissionCenterProps = {
    cameraState: "enabled" | "blocked" | "unavailable" | "ask" | "unsupported";
    notificationsState: "enabled" | "blocked" | "unavailable" | "ask" | "unsupported";
    storageState: "enabled" | "blocked" | "unavailable" | "ask" | "unsupported";
    scanRetentionEnabled: boolean;
    reminderEnabled: boolean;
    reminderCategory: ReminderCategory;
    reminderTone: ReminderTone;
    reminderFrequency: ReminderFrequency;
    reminderPreview: string;
    storageSummary: string;
    onRequestCamera: () => void;
    onToggleScanRetention: (value: boolean) => void;
    onToggleReminder: (value: boolean) => void;
    onRequestNotifications: () => void;
    onSendPreview: () => void;
    onChangeReminderCategory: (value: ReminderCategory) => void;
    onChangeReminderTone: (value: ReminderTone) => void;
    onChangeReminderFrequency: (value: ReminderFrequency) => void;
};

export default function PermissionCenter(props: PermissionCenterProps) {
    return (
        <div className="space-y-4">
            <CameraPermissionCard
                state={props.cameraState}
                onRequest={props.onRequestCamera}
            />
            <StorageConsentCard
                enabled={props.scanRetentionEnabled}
                onToggle={props.onToggleScanRetention}
                storageState={props.storageState}
                summary={props.storageSummary}
            />
            <NotificationPreferencesCard
                enabled={props.reminderEnabled}
                permissionState={props.notificationsState}
                category={props.reminderCategory}
                tone={props.reminderTone}
                frequency={props.reminderFrequency}
                preview={props.reminderPreview}
                onToggle={props.onToggleReminder}
                onCategoryChange={props.onChangeReminderCategory}
                onToneChange={props.onChangeReminderTone}
                onFrequencyChange={props.onChangeReminderFrequency}
                onRequestPermission={props.onRequestNotifications}
                onSendPreview={props.onSendPreview}
            />
        </div>
    );
}
