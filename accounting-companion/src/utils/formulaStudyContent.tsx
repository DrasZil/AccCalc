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
    "inventory-budget-solve": {
        topicId: "formula-inventory-budget",
        topicTitle: "Inventory Budget",
        intro:
            "Inventory budgeting connects cost of goods sold to the merchandise purchases needed for the period after the ending-inventory policy is considered.",
        sections: [
            {
                key: "logic",
                label: "Budget logic",
                summary: "Start with budgeted cost of goods sold, then adjust for inventory policy.",
                content: bullets([
                    "Budgeted cost of goods sold is the amount expected to leave inventory during the period.",
                    "Desired ending inventory increases the amount that must be available.",
                    "Beginning inventory reduces how much still has to be purchased.",
                ]),
            },
            {
                key: "class-use",
                label: "Class and exam use",
                summary: "Common in merchandising budgets and linked cash-planning questions.",
                emphasis: "support",
                tone: "info",
                content: bullets([
                    "This budget often appears before cash-disbursements or cash-budget schedules.",
                    "Teachers may ask for required purchases, budgeted COGS, or the ending inventory target from the same relationship.",
                ]),
            },
        ],
        relatedTools: [
            { path: "/business/cash-disbursements-schedule", label: "Cash Disbursements Schedule" },
            { path: "/business/cash-budget", label: "Cash Budget" },
        ],
    },
    "operating-expense-budget-solve": {
        topicId: "formula-operating-expense-budget",
        topicTitle: "Operating Expense Budget",
        intro:
            "An operating expense budget separates sales-driven costs from fixed costs, then separates accounting expense from the actual cash effect.",
        sections: [
            {
                key: "procedure",
                label: "Procedure logic",
                summary: "Build the total first, then isolate the cash portion.",
                content: bullets([
                    "Multiply budgeted sales by the variable expense rate.",
                    "Add fixed operating expenses to reach total operating expenses.",
                    "Subtract non-cash expenses when the cash budget needs the cash-only amount.",
                ]),
            },
            {
                key: "mistakes",
                label: "Common mistakes",
                summary: "Do not let expense and cash get blended into one answer.",
                emphasis: "support",
                tone: "warning",
                content: bullets([
                    "Using total expense as if it were the cash-disbursement figure.",
                    "Forgetting that depreciation and similar non-cash items affect expense but not cash.",
                ]),
            },
        ],
        relatedTools: [
            { path: "/business/cash-budget", label: "Cash Budget" },
            { path: "/business/flexible-budget", label: "Flexible Budget" },
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
    "sales-budget-solve": {
        topicId: "formula-sales-budget",
        topicTitle: "Sales Budget",
        intro:
            "The sales budget usually anchors the master budget, so weak assumptions here can distort many later schedules that look more detailed but depend on the same starting plan.",
        sections: [
            {
                key: "anchor",
                label: "Why it matters",
                summary: "This schedule often comes first in the budget flow.",
                content: bullets([
                    "Production, purchases, operating expense, and cash-planning schedules often begin with the sales budget.",
                    "A weak unit-sales assumption can make later budgets look precise even when the demand assumption itself is shaky.",
                    "Class questions may ask for units, price, or total revenue from the same core relationship.",
                ]),
            },
            {
                key: "class-use",
                label: "Class and exam use",
                summary: "Expect it in master-budget sequencing questions.",
                emphasis: "support",
                tone: "info",
                content: bullets([
                    "Some problems give total revenue and selling price, then ask you to back-solve units before moving into production or cash planning.",
                    "A good answer explains where the sales budget sits in the wider budget sequence instead of treating it as an isolated multiplication only.",
                ]),
            },
        ],
        relatedTools: [
            { path: "/business/production-budget", label: "Production Budget" },
            { path: "/business/cash-budget", label: "Cash Budget" },
        ],
    },
    "vat-reconciliation-solve": {
        topicId: "formula-vat-reconciliation",
        topicTitle: "VAT Reconciliation",
        intro:
            "VAT questions are not only about multiplication. The academic risk is often classification: whether the entered amounts are truly VATable and belong in the same reporting period.",
        sections: [
            {
                key: "procedure",
                label: "Procedure logic",
                summary: "Compute output VAT and input VAT separately before reading the final position.",
                content: bullets([
                    "Output VAT usually comes from taxable sales multiplied by the applicable VAT rate.",
                    "Input VAT usually comes from VATable purchases or costs that qualify for input-tax recognition.",
                    "Net VAT payable is the excess of output VAT over allowable input VAT in this simplified classroom setup.",
                ]),
            },
            {
                key: "mistakes",
                label: "Common mistakes",
                summary: "Most errors come from classification or timing, not arithmetic.",
                emphasis: "support",
                tone: "warning",
                content: bullets([
                    "Including exempt, zero-rated, or differently treated items in a single-rate VAT computation.",
                    "Mixing transactions from different reporting periods.",
                    "Treating an excess-input position as though it automatically answers every filing or refund issue.",
                ]),
            },
        ],
        relatedTools: [
            { path: "/tax/percentage-tax", label: "Percentage Tax" },
            { path: "/tax/tax-compliance-review", label: "Tax Compliance Review" },
        ],
    },
    "intercompany-inventory-profit-solve": {
        topicId: "formula-intercompany-inventory-profit",
        topicTitle: "Intercompany Inventory Profit Elimination",
        intro:
            "This is an AFAR elimination-support topic: the goal is to remove profit the group has not yet realized from outside customers.",
        sections: [
            {
                key: "meaning",
                label: "What the result means",
                summary: "The unrealized portion is the seller's internal profit still sitting inside ending inventory.",
                content: bullets([
                    "If inventory remains unsold outside the group at period-end, part of the transfer profit is still unrealized at the consolidated level.",
                    "That unrealized portion commonly requires an elimination entry in consolidation support.",
                    "The answer is not the full transfer profit unless all transferred goods remain unsold externally.",
                ]),
            },
            {
                key: "cautions",
                label: "Assumptions and cautions",
                summary: "Markup basis matters a lot in AFAR cases.",
                emphasis: "support",
                tone: "warning",
                content: bullets([
                    "Do not confuse markup on cost with markup on selling price.",
                    "Upstream versus downstream cases may affect attribution and NCI implications even when the unrealized-profit amount is similar.",
                    "If the problem spans more than one period, previous-period unrealized profit may also matter.",
                ]),
            },
        ],
        relatedTools: [
            { path: "/afar/business-combination-analysis", label: "Business Combination Analysis" },
            { path: "/far/statement-of-changes-in-equity-builder", label: "Statement of Changes in Equity Builder" },
        ],
    },
    "statement-of-changes-in-equity-solve": {
        topicId: "formula-statement-of-changes-in-equity",
        topicTitle: "Statement of Changes in Equity",
        intro:
            "A statement of changes in equity is a rollforward, not just a retained-earnings schedule. Strong answers keep each component of equity separate and reconcilable.",
        sections: [
            {
                key: "structure",
                label: "Statement structure",
                summary: "Different equity components move for different reasons.",
                content: bullets([
                    "Share capital and APIC usually move because of equity transactions.",
                    "Retained earnings usually move because of net income, dividends, and prior-period adjustments.",
                    "Accumulated OCI and treasury shares require separate treatment because they do not behave like ordinary profit balances.",
                ]),
            },
            {
                key: "exam-use",
                label: "How it appears in class",
                summary: "Often used in FAR statement-building and disclosure review.",
                emphasis: "support",
                tone: "info",
                content: bullets([
                    "Some cases ask only for ending retained earnings, but broader statement questions require a full equity rollforward.",
                    "Treasury-share activity and OCI are common points where partial answers become misleading.",
                ]),
            },
        ],
        relatedTools: [
            { path: "/far/retained-earnings-rollforward", label: "Retained Earnings Rollforward" },
            { path: "/far/cash-flow-statement-builder", label: "Statement of Cash Flows Builder" },
        ],
    },
    "direct-labor-budget-solve": {
        topicId: "formula-direct-labor-budget",
        topicTitle: "Direct Labor Budget",
        intro: "The direct labor budget bridges production plans into hours, wages, and staffing pressure.",
        sections: [
            {
                key: "flow",
                label: "Budget flow",
                summary: "Direct labor usually comes after production and before overhead or cash-planning schedules.",
                content: bullets([
                    "Start with the production budget because labor demand follows planned output.",
                    "Separate labor hours from labor cost so rate changes and efficiency assumptions stay visible.",
                    "Carry the result forward into cash planning and the budgeted income statement.",
                ]),
            },
        ],
        relatedTools: [
            { path: "/business/production-budget", label: "Production Budget" },
            { path: "/business/factory-overhead-budget", label: "Factory Overhead Budget" },
        ],
    },
    "factory-overhead-budget-solve": {
        topicId: "formula-factory-overhead-budget",
        topicTitle: "Factory Overhead Budget",
        intro: "Factory overhead budgeting is clearer when the variable and fixed pieces are kept separate.",
        sections: [
            {
                key: "reading",
                label: "Read the components",
                summary: "Variable and fixed overhead do different jobs in the budget.",
                content: bullets([
                    "Variable overhead changes with activity volume.",
                    "Fixed overhead stays in the period budget even when activity moves.",
                    "The split matters later for cash budgeting, standard costing, and performance reports.",
                ]),
            },
        ],
        relatedTools: [
            { path: "/business/direct-labor-budget", label: "Direct Labor Budget" },
            { path: "/accounting/factory-overhead-variance", label: "Factory Overhead Variances" },
        ],
    },
    "budgeted-income-statement-solve": {
        topicId: "formula-budgeted-income-statement",
        topicTitle: "Budgeted Income Statement",
        intro: "This is where separate master-budget schedules become one statement-level story.",
        sections: [
            {
                key: "connections",
                label: "Connect the schedules",
                summary: "A budgeted income statement should tie back to earlier budgets.",
                content: bullets([
                    "Sales drives revenue.",
                    "Production, materials, labor, and overhead drive cost of goods sold support.",
                    "Operating budgets and financing assumptions complete the income-statement view.",
                ]),
            },
        ],
        relatedTools: [
            { path: "/business/sales-budget", label: "Sales Budget" },
            { path: "/business/operating-expense-budget", label: "Operating Expense Budget" },
        ],
    },
    "special-order-decision-solve": {
        topicId: "formula-special-order-decision",
        topicTitle: "Special Order Decision",
        intro: "Special-order analysis becomes safer when only incremental revenue and incremental cost are kept in view.",
        sections: [
            {
                key: "relevance",
                label: "Relevant costs only",
                summary: "Do not let unchanged fixed costs distort the decision.",
                content: bullets([
                    "Include the extra revenue from the order.",
                    "Include variable cost and any extra fixed cost caused by the order.",
                    "Ignore fixed costs that stay the same whether the order is accepted or rejected.",
                ]),
            },
        ],
        relatedTools: [
            { path: "/business/make-or-buy-analysis", label: "Make or Buy Decision" },
            { path: "/business/cvp-analysis", label: "CVP Analysis" },
        ],
    },
    "make-or-buy-decision-solve": {
        topicId: "formula-make-or-buy-decision",
        topicTitle: "Make or Buy Decision",
        intro: "Make-or-buy cases depend on relevant cost comparison, not full absorption cost.",
        sections: [
            {
                key: "threshold",
                label: "Indifference price",
                summary: "The maximum outside purchase price is a useful negotiation and screening check.",
                content: bullets([
                    "Compute relevant make cost from variable cost plus avoidable fixed cost.",
                    "Compare that against the outside purchase cost.",
                    "Convert relevant make cost into a maximum acceptable buy price per unit when needed.",
                ]),
            },
        ],
        relatedTools: [
            { path: "/business/special-order-analysis", label: "Special Order Decision" },
            { path: "/business/constrained-resource-product-mix", label: "Constrained Resource Product Mix" },
        ],
    },
    "sell-or-process-further-solve": {
        topicId: "formula-sell-or-process-further",
        topicTitle: "Sell or Process Further",
        intro: "Joint-product decisions after split-off should ignore sunk joint cost and focus on incremental benefit.",
        sections: [
            {
                key: "joint",
                label: "Ignore sunk joint cost",
                summary: "Only the post-split-off difference matters.",
                content: bullets([
                    "Compare extra selling value after processing with separable processing cost.",
                    "Joint cost before split-off does not change, so it is not relevant to the choice.",
                    "Process further only when incremental revenue exceeds separable cost.",
                ]),
            },
        ],
        relatedTools: [
            { path: "/business/special-order-analysis", label: "Special Order Decision" },
            { path: "/business/break-even", label: "Break-even Point" },
        ],
    },
    "constrained-resource-product-mix-solve": {
        topicId: "formula-constrained-resource-product-mix",
        topicTitle: "Constrained Resource Product Mix",
        intro: "A bottleneck changes the ranking logic from contribution per unit to contribution per scarce-resource unit.",
        sections: [
            {
                key: "ranking",
                label: "Rank the bottleneck",
                summary: "The scarce resource drives the ranking, not raw unit margin alone.",
                content: bullets([
                    "Compute contribution margin per unit first.",
                    "Divide by the scarce resource consumed per unit, such as machine hours or labor hours.",
                    "Use that result to rank products before building a broader product mix recommendation.",
                ]),
            },
        ],
        relatedTools: [
            { path: "/business/make-or-buy-analysis", label: "Make or Buy Decision" },
            { path: "/business/cvp-analysis", label: "CVP Analysis" },
        ],
    },
    "transfer-pricing-support-solve": {
        topicId: "formula-transfer-pricing-support",
        topicTitle: "Transfer Pricing Support",
        intro: "Transfer-pricing cases become easier when the selling division's minimum and the buying division's outside benchmark are kept separate before discussing a negotiated price.",
        sections: [
            {
                key: "range",
                label: "Read the pricing band",
                summary: "Start with the minimum, then compare it with the outside benchmark.",
                content: bullets([
                    "Variable cost is usually the floor only when no opportunity cost is sacrificed.",
                    "Add opportunity cost when internal transfer displaces outside sales or other contribution.",
                    "Use the outside market price as the normal buying-division ceiling when that benchmark is relevant.",
                ]),
            },
            {
                key: "warning",
                label: "When there is no overlap",
                summary: "A negative range width signals a negotiation problem, not just a calculator result.",
                emphasis: "support",
                tone: "warning",
                content: bullets([
                    "If the selling division's minimum is above the outside benchmark, an internal transfer may not be workable under the stated assumptions.",
                    "Recheck whether the opportunity cost is real and whether the external market price is still the correct benchmark.",
                ]),
            },
        ],
        relatedTools: [
            { path: "/business/make-or-buy-analysis", label: "Make or Buy Decision" },
            { path: "/business/constrained-resource-product-mix", label: "Constrained Resource Product Mix" },
        ],
    },
    "budget-variance-analysis-solve": {
        topicId: "formula-budget-variance-analysis",
        topicTitle: "Budget Variance Analysis",
        intro: "Performance reports are easier to explain when execution variance is separated from the effect of a different activity level.",
        sections: [
            {
                key: "layers",
                label: "Variance layers",
                summary: "Use the right benchmark for each comparison.",
                content: bullets([
                    "Compare actual to flexible budget for spending variance.",
                    "Compare flexible budget to static budget for activity variance.",
                    "Compare actual to static budget for the full gap from plan.",
                ]),
            },
        ],
        relatedTools: [
            { path: "/business/flexible-budget", label: "Flexible Budget" },
            { path: "/business/budgeted-income-statement", label: "Budgeted Income Statement" },
        ],
    },
    "sales-volume-variance-solve": {
        topicId: "formula-sales-volume-variance",
        topicTitle: "Sales Volume Variance",
        intro: "Sales-volume variance isolates the profit effect of selling more or fewer units than planned, using the budgeted contribution margin per unit.",
        sections: [
            {
                key: "logic",
                label: "Volume first, price later",
                summary: "This variance asks what changed because of unit volume, not because of selling price or unit cost changes.",
                content: bullets([
                    "Start with actual units sold minus budgeted units sold.",
                    "Multiply that unit difference by the budgeted contribution margin per unit.",
                    "Interpret a positive result as favorable when the case uses contribution-margin logic.",
                ]),
            },
        ],
        relatedTools: [
            { path: "/business/sales-mix-variance", label: "Sales Mix Variance" },
            { path: "/business/cvp-analysis", label: "CVP Analysis" },
        ],
    },
    "sales-mix-variance-solve": {
        topicId: "formula-sales-mix-variance",
        topicTitle: "Sales Mix Variance",
        intro: "Sales-mix variance isolates the effect of selling a different proportion of products than the budget originally expected.",
        sections: [
            {
                key: "mix",
                label: "Convert mix into equivalent units",
                summary: "The variance is easier when the actual total volume stays visible while the product share changes.",
                content: bullets([
                    "Find the actual mix percentage for the product being analyzed.",
                    "Compare it with the budgeted mix percentage using actual total units sold as the activity base.",
                    "Multiply the equivalent unit difference by the budgeted contribution margin per unit.",
                ]),
            },
        ],
        relatedTools: [
            { path: "/business/sales-volume-variance", label: "Sales Volume Variance" },
            { path: "/business/constrained-resource-product-mix", label: "Constrained Resource Product Mix" },
        ],
    },
    "safety-stock-planner-solve": {
        topicId: "formula-safety-stock-planner",
        topicTitle: "Safety Stock Planner",
        intro: "Safety-stock planning becomes easier when maximum usage and maximum lead time are treated as protection against uncertainty rather than decorative inputs.",
        sections: [
            {
                key: "buffer",
                label: "Build the buffer deliberately",
                summary: "Safety stock bridges the gap between expected demand and a worse-than-average replenishment cycle.",
                content: bullets([
                    "Compute maximum usage during maximum lead time first.",
                    "Compute expected usage during average lead time next.",
                    "Use the difference as safety stock, then add average lead-time demand to read the reorder point.",
                ]),
            },
        ],
        relatedTools: [
            { path: "/operations/eoq-and-reorder-point", label: "EOQ and Reorder Point" },
            { path: "/operations/moving-average-forecast", label: "Moving Average Forecast" },
        ],
    },
    "estate-tax-solve": {
        topicId: "formula-estate-tax",
        topicTitle: "Estate Tax Helper",
        intro: "Estate-tax classroom problems are easier to explain when the app shows the rate assumption openly and separates gross estate from deductions before computing tax due.",
        sections: [
            {
                key: "sequence",
                label: "Separate base from rate",
                summary: "Do not multiply the gross estate immediately.",
                content: bullets([
                    "Start with gross estate.",
                    "Subtract allowable deductions to arrive at net estate.",
                    "Apply the visible estate-tax rate assumption only after the taxable base is clear.",
                ]),
            },
        ],
        relatedTools: [
            { path: "/tax/donors-tax-helper", label: "Donor's Tax Helper" },
            { path: "/tax/tax-compliance-review", label: "Tax Compliance and Incentive Review" },
        ],
    },
    "donors-tax-solve": {
        topicId: "formula-donors-tax",
        topicTitle: "Donor's Tax Helper",
        intro: "Donor's-tax review becomes clearer when the gross gift, exemption logic, and visible rate assumption are kept separate.",
        sections: [
            {
                key: "gift",
                label: "Taxable gift before tax due",
                summary: "The gift amount and the tax due are not the same number.",
                content: bullets([
                    "Begin with the gross gift or transferred property value.",
                    "Subtract the configured exemption or non-taxable portion to read taxable gift.",
                    "Apply the visible donor's-tax rate assumption to the taxable gift only.",
                ]),
            },
        ],
        relatedTools: [
            { path: "/tax/estate-tax-helper", label: "Estate Tax Helper" },
            { path: "/tax/documentary-stamp-tax-helper", label: "Documentary Stamp Tax Helper" },
        ],
    },
    "documentary-stamp-tax-solve": {
        topicId: "formula-documentary-stamp-tax",
        topicTitle: "Documentary Stamp Tax Helper",
        intro: "DST review is easier when the taxable base is converted into taxable units first, then multiplied by the visible rate per unit.",
        sections: [
            {
                key: "units",
                label: "Round into taxable units",
                summary: "Many DST questions depend on the number of chargeable units, not only the peso base.",
                content: bullets([
                    "Divide the taxable base amount by the configured taxable unit size.",
                    "Round up to the next whole taxable unit when the rule requires ceiling treatment.",
                    "Multiply the taxable units by the rate per unit to arrive at DST due.",
                ]),
            },
        ],
        relatedTools: [
            { path: "/tax/estate-tax-helper", label: "Estate Tax Helper" },
            { path: "/tax/tax-compliance-review", label: "Tax Compliance and Incentive Review" },
        ],
    },
    "consignment-settlement-solve": {
        topicId: "formula-consignment-settlement",
        topicTitle: "Consignment Settlement",
        intro: "Consignment settlements are easier when the consignee's commission, advances, and chargeable expenses are laid out as one clean remittance rollforward.",
        sections: [
            {
                key: "settlement",
                label: "Read the remittance like a statement",
                summary: "The consignor cares about the net cash still due after all allowed deductions.",
                content: bullets([
                    "Start with total sales made on behalf of the consignor.",
                    "Compute the consignee commission and add reimbursable expenses.",
                    "Subtract advances already remitted before reading the cash balance still due.",
                ]),
            },
        ],
        relatedTools: [
            { path: "/afar/branch-inventory-loading", label: "Branch Inventory Loading" },
            { path: "/afar/construction-revenue-workspace", label: "Construction Revenue Workspace" },
        ],
    },
    "branch-inventory-loading-solve": {
        topicId: "formula-branch-inventory-loading",
        topicTitle: "Branch Inventory Loading",
        intro: "Branch-home-office inventory questions become easier when the loading on billed price is separated from the inventory carried at branch invoice value.",
        sections: [
            {
                key: "loading",
                label: "Strip out the loading",
                summary: "Branch inventory at billed price usually includes an internal markup that must be removed for cost-based reporting.",
                content: bullets([
                    "Convert the markup on cost into a loading rate on billed price when helpful.",
                    "Multiply billed-price inventory by that loading rate to find the allowance for overvaluation.",
                    "Subtract the loading allowance from billed-price inventory to read inventory at cost.",
                ]),
            },
        ],
        relatedTools: [
            { path: "/afar/consignment-settlement", label: "Consignment Settlement" },
            { path: "/afar/foreign-currency-translation", label: "Foreign Currency Translation Workspace" },
        ],
    },
    "dividend-allocation-solve": {
        topicId: "formula-dividend-allocation",
        topicTitle: "Dividend Allocation",
        intro: "Dividend-allocation problems are easier when preferred requirements are satisfied first before any remaining amount is assigned to common shareholders.",
        sections: [
            {
                key: "priority",
                label: "Preferred first, common second",
                summary: "Cumulative preferred shares may require prior-year arrears before common participates.",
                content: bullets([
                    "Compute the annual preferred dividend from shares, par value, and stated rate.",
                    "Add dividends in arrears when the preferred shares are cumulative and unpaid prior years matter.",
                    "Allocate any remaining declared dividend to common, then divide by common shares for per-share reading.",
                ]),
            },
        ],
        relatedTools: [
            { path: "/far/retained-earnings-rollforward", label: "Retained Earnings Rollforward" },
            { path: "/far/statement-of-changes-in-equity-builder", label: "Statement of Changes in Equity Builder" },
        ],
    },
    "notes-receivable-discounting-solve": {
        topicId: "formula-notes-receivable-discounting",
        topicTitle: "Notes Receivable Discounting",
        intro: "Discounting problems become easier when maturity value and bank discount are separated cleanly.",
        sections: [
            {
                key: "sequence",
                label: "Solve in sequence",
                summary: "Do not jump straight to proceeds.",
                content: bullets([
                    "Find note interest first.",
                    "Build the maturity value next.",
                    "Apply the bank discount to the maturity value for the remaining term before reading proceeds.",
                ]),
            },
        ],
        relatedTools: [{ path: "/accounting/notes-interest", label: "Notes Interest" }],
    },
    "equity-method-investment-solve": {
        topicId: "formula-equity-method-investment",
        topicTitle: "Equity Method Investment",
        intro: "Equity-method questions are usually rollforwards of the investment carrying amount, not cash-flow questions only.",
        sections: [
            {
                key: "logic",
                label: "Core logic",
                summary: "Income increases the investment; dividends reduce it.",
                content: bullets([
                    "Recognize the investor's share of investee income.",
                    "Reduce the investment for dividends received.",
                    "Keep acquisition-date adjustments separate from the basic rollforward if the case adds them.",
                ]),
            },
        ],
        relatedTools: [{ path: "/afar/business-combination-analysis", label: "Business Combination Analysis" }],
    },
    "intercompany-ppe-transfer-solve": {
        topicId: "formula-intercompany-ppe-transfer",
        topicTitle: "Intercompany PPE Transfer",
        intro: "AFAR PPE-transfer cases usually require both the unrealized gain reversal and the excess-depreciation adjustment.",
        sections: [
            {
                key: "elimination",
                label: "What changes each year",
                summary: "The initial gain does not stay fully unrealized forever.",
                content: bullets([
                    "The gain on transfer is unrealized at group level on day one.",
                    "Each year, excess depreciation gradually realizes part of that profit.",
                    "Later periods focus on the remaining unamortized balance and the current year's depreciation adjustment.",
                ]),
            },
        ],
        relatedTools: [{ path: "/afar/intercompany-inventory-profit", label: "Intercompany Inventory Profit" }],
    },
    "moving-average-forecast-solve": {
        topicId: "formula-moving-average-forecast",
        topicTitle: "Moving Average Forecast",
        intro: "Moving averages give quick short-term forecasting support without jumping straight into heavier models.",
        sections: [
            {
                key: "recency",
                label: "Recency weighting",
                summary: "Weighted moving averages let more recent demand matter more.",
                content: bullets([
                    "A simple moving average weights each included period equally.",
                    "A weighted moving average emphasizes more recent demand when conditions are changing.",
                    "Keep the total weight visible so the forecast remains easy to audit and explain.",
                ]),
            },
        ],
        relatedTools: [
            { path: "/operations/eoq-and-reorder-point", label: "EOQ and Reorder Point" },
            { path: "/business/sales-budget", label: "Sales Budget" },
        ],
    },
};

export function getFormulaStudySupport(definitionId: string) {
    return FORMULA_STUDY_SUPPORT[definitionId] ?? null;
}
