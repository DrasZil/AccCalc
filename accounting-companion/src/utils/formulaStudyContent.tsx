import type { StudySupportSection } from "../components/StudySupportPanel";

export type FormulaStudySupport = {
    topicId: string;
    topicTitle: string;
    intro: string;
    sections: StudySupportSection[];
    relatedTools?: Array<{ path: string; label: string }>;
    lessonPath?: string;
    quizPath?: string;
};

function bullets(items: string[]) {
    return (
        <ul className="list-disc space-y-2 pl-5">
            {items.map((item) => (
                <li key={item}>{item}</li>
            ))}
        </ul>
    );
}

export const FORMULA_STUDY_SUPPORT: Record<string, FormulaStudySupport> = {
    "simple-interest-solve": {
        topicId: "formula-simple-interest",
        topicTitle: "Simple Interest",
        intro:
            "Use this layer when the arithmetic is easy but the meaning of principal, rate, or time still feels shaky.",
        sections: [
            {
                key: "core-idea",
                label: "Core idea",
                summary: "Simple interest grows only on the original principal.",
                content: bullets([
                    "The base amount does not change while interest is being measured.",
                    "Rate and time must stay on the same annual basis.",
                    "This is different from compound growth, where interest also earns interest.",
                ]),
            },
            {
                key: "mistakes",
                label: "Common mistakes",
                summary: "Most wrong answers come from basis mismatches.",
                emphasis: "support",
                tone: "warning",
                content: bullets([
                    "Mixing a monthly time basis with an annual rate.",
                    "Using a rate already written in decimal form as though it were still a percent.",
                    "Treating a compound-interest problem as simple interest.",
                ]),
            },
        ],
        relatedTools: [
            { path: "/finance/compound-interest", label: "Compound Interest" },
            { path: "/finance/future-value", label: "Future Value" },
        ],
    },
    "break-even-solve": {
        topicId: "formula-break-even",
        topicTitle: "Break-even",
        intro:
            "Break-even works best when you read it as a contribution-margin threshold, not just a memorized division.",
        sections: [
            {
                key: "procedure",
                label: "Procedure logic",
                summary: "Contribution margin must come first before break-even can make sense.",
                content: bullets([
                    "Confirm selling price and variable cost are both per-unit amounts.",
                    "Find contribution margin per unit before solving break-even units.",
                    "Translate the answer into units or sales value depending on the question.",
                ]),
            },
            {
                key: "interpretation",
                label: "Interpret the result",
                summary: "Break-even is the zero-profit line, not the target.",
                emphasis: "support",
                tone: "info",
                content: bullets([
                    "Sales above break-even create operating income only after fixed costs are fully covered.",
                    "A high break-even point usually signals heavier fixed-cost pressure or weaker unit contribution.",
                    "If the problem is multi-product, move into sales-mix analysis instead of forcing a single-product model.",
                ]),
            },
        ],
        relatedTools: [
            { path: "/business/cvp-analysis", label: "CVP Analysis" },
            { path: "/business/target-profit", label: "Target Profit" },
            { path: "/business/sales-mix-break-even", label: "Sales Mix Break-even" },
        ],
    },
    "percentage-tax-solve": {
        topicId: "formula-percentage-tax",
        topicTitle: "Percentage Tax",
        intro:
            "The main discipline in percentage-tax questions is choosing the right tax regime before multiplying anything.",
        sections: [
            {
                key: "classification",
                label: "Classify first",
                summary: "Do not compute before confirming the problem really belongs to percentage tax.",
                content: bullets([
                    "Check whether the case is actually VAT, percentage tax, or another business-tax setting.",
                    "Use the correct base and rate from the applicable scenario or reference.",
                    "Keep legal classification separate from the arithmetic step.",
                ]),
            },
            {
                key: "caution",
                label: "Caution",
                summary: "A correct multiplication can still sit inside the wrong tax answer.",
                emphasis: "support",
                tone: "warning",
                content: bullets([
                    "Business-tax questions often test regime identification first.",
                    "A rate from one setting should not be assumed in another without support.",
                ]),
            },
        ],
        relatedTools: [
            { path: "/accounting/philippine-vat", label: "Philippine VAT" },
            { path: "/tax/tax-compliance-review", label: "Tax Compliance Review" },
        ],
    },
    "petty-cash-reconciliation-solve": {
        topicId: "formula-petty-cash",
        topicTitle: "Petty Cash Reconciliation",
        intro:
            "Petty cash is really a control exercise: the count should explain the fund, not merely produce a number.",
        sections: [
            {
                key: "what-it-means",
                label: "What the count means",
                summary: "Cash plus support should explain the authorized fund under the imprest system.",
                content: bullets([
                    "Count cash actually on hand.",
                    "Add valid petty cash vouchers and other accountable support such as stamps if the case treats them as part of the fund.",
                    "Compare the accounted-for total with the authorized petty cash fund.",
                ]),
            },
            {
                key: "review",
                label: "Review prompts",
                summary: "Use these checks before accepting a shortage or overage.",
                emphasis: "support",
                tone: "info",
                content: bullets([
                    "Is every voucher approved and supported?",
                    "Did I include only items that should still be accountable within the fund?",
                    "Does the count suggest a cash shortage, an overage, or a replenishment only?",
                ]),
            },
        ],
        relatedTools: [
            { path: "/accounting/bank-reconciliation", label: "Bank Reconciliation" },
            { path: "/accounting/adjusting-entries-workspace", label: "Adjusting Entries Workspace" },
        ],
    },
    "prepaid-expense-adjustment-solve": {
        topicId: "formula-prepaid-expense",
        topicTitle: "Prepaid Expense Adjustment",
        intro:
            "This topic is about matching: the asset decreases as the benefit is consumed and expense is recognized.",
        sections: [
            {
                key: "logic",
                label: "Adjustment logic",
                summary: "A lower prepaid balance usually means some of the asset has been used.",
                content: bullets([
                    "Start with the opening prepaid balance.",
                    "Read the ending prepaid balance after counting the unused portion.",
                    "The difference is the expense recognized for the period.",
                ]),
            },
            {
                key: "mistakes",
                label: "Common mistakes",
                summary: "Students often confuse cash payment with expense recognition.",
                emphasis: "support",
                tone: "warning",
                content: bullets([
                    "Recording the whole cash payment as current expense even though part is still future benefit.",
                    "Forgetting that the adjustment should leave the remaining unused benefit in the prepaid asset.",
                ]),
            },
        ],
        relatedTools: [
            { path: "/accounting/unearned-revenue-adjustment", label: "Unearned Revenue Adjustment" },
            { path: "/accounting/accrued-expense-adjustment", label: "Accrued Expense Adjustment" },
        ],
    },
    "unearned-revenue-adjustment-solve": {
        topicId: "formula-unearned-revenue",
        topicTitle: "Unearned Revenue Adjustment",
        intro:
            "Unearned revenue is a liability first. Revenue appears only as the obligation is satisfied.",
        sections: [
            {
                key: "core-idea",
                label: "Core idea",
                summary: "A decrease in unearned revenue often signals revenue recognition.",
                content: bullets([
                    "Cash may have been collected earlier, but that does not make it earned immediately.",
                    "As service is performed or goods are delivered, the liability declines.",
                    "The earned portion becomes current-period revenue.",
                ]),
            },
            {
                key: "caution",
                label: "Caution",
                summary: "Do not confuse collection timing with earning timing.",
                emphasis: "support",
                tone: "warning",
                content: bullets([
                    "This is a recognition issue, not just a cash issue.",
                    "If the obligation is still outstanding, the balance should remain a liability.",
                ]),
            },
        ],
        relatedTools: [
            { path: "/accounting/prepaid-expense-adjustment", label: "Prepaid Expense Adjustment" },
            { path: "/accounting/accrued-revenue-adjustment", label: "Accrued Revenue Adjustment" },
        ],
    },
    "accrued-revenue-adjustment-solve": {
        topicId: "formula-accrued-revenue",
        topicTitle: "Accrued Revenue Adjustment",
        intro:
            "Accrued revenue appears when the earning process is complete before the cash collection happens.",
        sections: [
            {
                key: "when-used",
                label: "When this is used",
                summary: "Use it when the company has already earned revenue but has not yet billed or collected it.",
                content: bullets([
                    "The revenue belongs in the current period because it is already earned.",
                    "A receivable recognizes the pending claim against the customer or party owing the amount.",
                ]),
            },
            {
                key: "self-check",
                label: "Self-check",
                summary: "Quick prompts before accepting the adjustment.",
                emphasis: "support",
                tone: "info",
                content: bullets([
                    "Has the earning process really been completed?",
                    "Is the missing piece only the cash collection or billing step?",
                ]),
            },
        ],
        relatedTools: [
            { path: "/accounting/unearned-revenue-adjustment", label: "Unearned Revenue Adjustment" },
            { path: "/accounting/accrued-expense-adjustment", label: "Accrued Expense Adjustment" },
        ],
    },
    "accrued-expense-adjustment-solve": {
        topicId: "formula-accrued-expense",
        topicTitle: "Accrued Expense Adjustment",
        intro:
            "Accrued expenses keep the period honest by recognizing obligations that already exist even before cash is paid.",
        sections: [
            {
                key: "matching",
                label: "Matching logic",
                summary: "Expense belongs to the period when incurred, not when paid.",
                content: bullets([
                    "Measure how much expense was incurred during the period.",
                    "Subtract any amount already paid.",
                    "The remainder becomes an accrued liability.",
                ]),
            },
            {
                key: "exam-risk",
                label: "Exam risk",
                summary: "Cash timing often distracts from the recognition principle.",
                emphasis: "support",
                tone: "warning",
                content: bullets([
                    "A payment in the next period does not push the expense out of the current period if it was already incurred now.",
                    "Always ask whether the obligation already exists at period-end.",
                ]),
            },
        ],
        relatedTools: [
            { path: "/accounting/prepaid-expense-adjustment", label: "Prepaid Expense Adjustment" },
            { path: "/accounting/accrued-revenue-adjustment", label: "Accrued Revenue Adjustment" },
        ],
    },
    "impairment-loss-solve": {
        topicId: "formula-impairment",
        topicTitle: "Impairment Loss",
        intro:
            "Impairment is a measurement question: compare carrying amount with recoverable amount and never force a loss when recoverable amount is higher.",
        sections: [
            {
                key: "measurement",
                label: "Measurement sequence",
                summary: "Recoverable amount is the higher of two measures, not the lower.",
                content: bullets([
                    "Compute or identify fair value less costs to sell.",
                    "Compute or identify value in use.",
                    "Use the higher of those two as recoverable amount, then compare it with carrying amount.",
                ]),
            },
            {
                key: "mistakes",
                label: "Common mistakes",
                summary: "The direction of the comparison matters.",
                emphasis: "support",
                tone: "warning",
                content: bullets([
                    "Using the lower measure instead of the higher measure for recoverable amount.",
                    "Recognizing an impairment even when carrying amount does not exceed recoverable amount.",
                ]),
            },
        ],
        relatedTools: [
            { path: "/far/asset-disposal-analysis", label: "Asset Disposal Analysis" },
            { path: "/accounting/straight-line-depreciation", label: "Straight-line Depreciation" },
        ],
    },
    "asset-disposal-solve": {
        topicId: "formula-asset-disposal",
        topicTitle: "Asset Disposal Analysis",
        intro:
            "A disposal answer is strongest when you separate book value, net proceeds, and the resulting gain or loss in that order.",
        sections: [
            {
                key: "sequence",
                label: "Solve in sequence",
                summary: "Do not jump straight to the gain or loss without updating book value first.",
                content: bullets([
                    "Start with original cost.",
                    "Subtract accumulated depreciation to get book value.",
                    "Adjust proceeds for disposal costs, then compare with book value.",
                ]),
            },
            {
                key: "review",
                label: "Review prompts",
                summary: "Quick checks before accepting the answer.",
                emphasis: "support",
                tone: "info",
                content: bullets([
                    "Was current-period depreciation already updated before disposal?",
                    "Did I use net proceeds, not gross proceeds, when disposal costs apply?",
                ]),
            },
        ],
        relatedTools: [
            { path: "/far/impairment-loss-workspace", label: "Impairment Loss" },
            { path: "/accounting/depreciation-schedule-comparison", label: "Depreciation Schedule Comparison" },
        ],
    },
    "production-budget-solve": {
        topicId: "formula-production-budget",
        topicTitle: "Production Budget",
        intro:
            "Production budgeting turns the sales plan into a manufacturing requirement after inventory policy is considered.",
        sections: [
            {
                key: "how-it-connects",
                label: "How it connects",
                summary: "Sales budget comes first, then production budget, then materials and labor budgets.",
                content: bullets([
                    "Budgeted sales drive the basic requirement.",
                    "Desired ending finished goods increases the amount to produce.",
                    "Beginning finished goods reduces what still has to be produced.",
                ]),
            },
            {
                key: "mistakes",
                label: "Common mistakes",
                summary: "Inventory signs are easy to reverse.",
                emphasis: "support",
                tone: "warning",
                content: bullets([
                    "Adding beginning finished goods instead of subtracting it.",
                    "Using sales units from the wrong period.",
                ]),
            },
        ],
        relatedTools: [
            { path: "/business/direct-materials-purchases-budget", label: "Direct Materials Purchases Budget" },
            { path: "/business/cash-budget", label: "Cash Budget" },
        ],
    },
    "direct-materials-purchases-budget-solve": {
        topicId: "formula-direct-materials-budget",
        topicTitle: "Direct Materials Purchases Budget",
        intro:
            "This budget follows production, not sales directly. First find the materials needed for production, then adjust for materials inventory policy.",
        sections: [
            {
                key: "procedure",
                label: "Procedure logic",
                summary: "Keep the production requirement separate from the purchase requirement.",
                content: bullets([
                    "Multiply production units by the materials quantity standard per finished unit.",
                    "Add desired ending materials inventory.",
                    "Subtract beginning materials inventory to find purchases.",
                ]),
            },
            {
                key: "practical-meaning",
                label: "Practical meaning",
                summary: "Purchases cost helps link the operating plan to cash planning and supplier scheduling.",
                emphasis: "support",
                tone: "info",
                content: bullets([
                    "The purchases budget influences supplier orders and cash requirements.",
                    "A quantity answer and a cost answer usually both matter in classwork.",
                ]),
            },
        ],
        relatedTools: [
            { path: "/business/production-budget", label: "Production Budget" },
            { path: "/business/cash-budget", label: "Cash Budget" },
        ],
    },
    "withholding-tax-solve": {
        topicId: "formula-withholding-tax",
        topicTitle: "Withholding Tax",
        intro:
            "The math is simple, but the academic reliability comes from identifying the right withholding treatment first.",
        sections: [
            {
                key: "classification",
                label: "Classification first",
                summary: "Know which withholding regime applies before computing.",
                content: bullets([
                    "Confirm whether the case is final withholding, creditable withholding, or another tax treatment.",
                    "Use the proper tax base and rate from the applicable setting.",
                ]),
            },
            {
                key: "review",
                label: "Review prompts",
                summary: "Use these before trusting the answer.",
                emphasis: "support",
                tone: "warning",
                content: bullets([
                    "Did I use the correct base for withholding?",
                    "Does the rate belong to the same type of transaction described in the problem?",
                ]),
            },
        ],
        relatedTools: [
            { path: "/tax/percentage-tax", label: "Percentage Tax" },
            { path: "/tax/tax-compliance-review", label: "Tax Compliance Review" },
        ],
    },
};

export function getFormulaStudySupport(definitionId: string) {
    return FORMULA_STUDY_SUPPORT[definitionId] ?? null;
}
