import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import { FiBell, FiShield, FiKey, FiGrid, FiUser } from "react-icons/fi";

const sections = [
  { title: "Profile", icon: FiUser, description: "Update your contact details and business identity." },
  { title: "Notifications", icon: FiBell, description: "Manage alerts, email preferences, and reminders." },
  { title: "Security", icon: FiShield, description: "Protect your account with SSO and secure access controls." },
  { title: "API Keys", icon: FiKey, description: "Manage integrations and service credentials." },
  { title: "Appearance", icon: FiGrid, description: "Adjust your workspace theme and default layout." },
];

export default function Settings() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Customize your workspace, preferences, and integrations" />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card title="Workspace Preferences" subtitle="Tuned for a premium CRM workflow" bodyClassName="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.title} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-blue-50 p-3 text-blue-600"><Icon size={18} /></div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{section.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">{section.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card title="Account Summary" subtitle="Current plan and access" bodyClassName="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Plan</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">Growth</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Seats</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">10 users</p>
          </div>
          <Button variant="primary" fullWidth>Upgrade Workspace</Button>
        </Card>
      </div>
    </div>
  );
}
