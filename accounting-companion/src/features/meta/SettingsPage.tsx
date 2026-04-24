import PageHeader from "../../components/PageHeader";
import SettingsContent from "./SettingsContent";

export default function SettingsPage() {
    return (
        <div className="app-page-stack">
            <PageHeader
                badge="Settings"
                title="Settings by category"
                description="Jump into one settings area at a time: account, appearance, workflow, data, or updates. Controls stay grouped so the main adjustment you need is easier to find on every screen size."
            />

            <SettingsContent />
        </div>
    );
}
