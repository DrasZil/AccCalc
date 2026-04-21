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
};

export function getFormulaStudySupport(definitionId: string) {
    return FORMULA_STUDY_SUPPORT[definitionId] ?? null;
}
