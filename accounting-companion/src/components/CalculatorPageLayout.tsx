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
  const inputBlock = (
    <section className="space-y-3">
      <div className="px-1">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
          Inputs
        </p>
      </div>
      {inputSection}
    </section>
  );

  const resultBlock = resultSection ? (
    <section className="space-y-3">
      <div className="px-1">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
          Final Answer
        </p>
      </div>
      {resultSection}
    </section>
  ) : null;

  const explanationBlock = explanationSection ? (
    <section className="space-y-3">
      <div className="px-1">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
          Understanding The Answer
        </p>
      </div>
      {explanationSection}
    </section>
  ) : null;

  return (
    <div className="space-y-6">
      <PageHeader
        badge={badge}
        title={title}
        description={description}
      />

      {prioritizeResultSection ? resultBlock : inputBlock}
      {prioritizeResultSection ? inputBlock : resultBlock}
      {explanationBlock}
    </div>
  );
}
