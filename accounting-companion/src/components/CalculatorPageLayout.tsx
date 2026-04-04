import type { ReactNode } from "react";
import PageHeader from "./PageHeader";

type CalculatorPageLayoutProps = {
  badge?: string;
  title: string;
  description: string;
  inputSection: ReactNode;
  resultSection?: ReactNode;
  explanationSection?: ReactNode;
  prioritizeResultSection?: boolean;
};

export default function CalculatorPageLayout({
  badge,
  title,
  description,
  inputSection,
  resultSection,
  explanationSection,
  prioritizeResultSection = false,
}: CalculatorPageLayoutProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        badge={badge}
        title={title}
        description={description}
      />

      {prioritizeResultSection ? resultSection : inputSection}

      {prioritizeResultSection ? inputSection : resultSection}

      {explanationSection}
    </div>
  );
}
