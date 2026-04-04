import PageHeader from "../../components/PageHeader";
import SettingsContent from "./SettingsContent";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                badge="Settings"
                title="App Preferences"
                description="Control navigation behavior, Smart Solver presentation, offline history, feedback reminders, motion, and currency. These settings are saved on this device."
            />

            <SettingsContent />
        </div>
    );
}
