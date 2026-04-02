import type { ReactNode } from "react";
import PageHeader from "./PageHeader";

type CalculatorPageLayoutProps = {
  badge?: string;
  title: string;
  description: string;
  inputSection: ReactNode;
  resultSection?: ReactNode;
  explanationSection?: ReactNode;
};

export default function CalculatorPageLayout({
  badge,
  title,
  description,
  inputSection,
  resultSection,
  explanationSection,
}: CalculatorPageLayoutProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        badge={badge}
        title={title}
        description={description}
      />

      {inputSection}

      {resultSection}

      {explanationSection}
    </div>
  );
}