export const ACCOUNT_REFERENCE_DATA = [
    { name: "Cash", type: "Asset", normalBalance: "Debit", statement: "Balance Sheet", section: "Current Assets", aliases: ["cash on hand", "cash in bank"], note: "Cash is a current asset with a normal debit balance." },
    { name: "Accounts Receivable", type: "Asset", normalBalance: "Debit", statement: "Balance Sheet", section: "Current Assets", aliases: ["receivables", "trade receivables", "ar"], note: "Receivables represent amounts due from customers." },
    { name: "Allowance for Doubtful Accounts", type: "Contra Asset", normalBalance: "Credit", statement: "Balance Sheet", section: "Current Assets", aliases: ["allowance", "bad debt allowance", "ada"], note: "Allowance for doubtful accounts is a contra asset that reduces receivables." },
    { name: "Merchandise Inventory", type: "Asset", normalBalance: "Debit", statement: "Balance Sheet", section: "Current Assets", aliases: ["inventory", "stock"], note: "Merchandise inventory is reported as a current asset." },
    { name: "Supplies", type: "Asset", normalBalance: "Debit", statement: "Balance Sheet", section: "Current Assets", aliases: ["office supplies"], note: "Unused supplies are assets until consumed." },
    { name: "Prepaid Insurance", type: "Asset", normalBalance: "Debit", statement: "Balance Sheet", section: "Current Assets", aliases: ["prepaid"], note: "Prepaid insurance is an asset until the coverage expires." },
    { name: "Land", type: "Asset", normalBalance: "Debit", statement: "Balance Sheet", section: "Noncurrent Assets", aliases: ["lot"], note: "Land is a nondepreciable noncurrent asset." },
    { name: "Equipment", type: "Asset", normalBalance: "Debit", statement: "Balance Sheet", section: "Noncurrent Assets", aliases: ["machinery", "tools", "office equipment"], note: "Equipment is a plant asset with a normal debit balance." },
    { name: "Accumulated Depreciation", type: "Contra Asset", normalBalance: "Credit", statement: "Balance Sheet", section: "Noncurrent Assets", aliases: ["accum dep", "accumulated depreciation equipment"], note: "Accumulated depreciation is a contra asset with a normal credit balance." },
    { name: "Accounts Payable", type: "Liability", normalBalance: "Credit", statement: "Balance Sheet", section: "Current Liabilities", aliases: ["payables", "ap"], note: "Accounts payable is a current liability with a normal credit balance." },
    { name: "Notes Payable", type: "Liability", normalBalance: "Credit", statement: "Balance Sheet", section: "Liabilities", aliases: ["note payable"], note: "Notes payable represents written debt obligations." },
    { name: "Unearned Revenue", type: "Liability", normalBalance: "Credit", statement: "Balance Sheet", section: "Current Liabilities", aliases: ["deferred revenue", "unearned income"], note: "Unearned revenue is a liability until earned." },
    { name: "Salaries Payable", type: "Liability", normalBalance: "Credit", statement: "Balance Sheet", section: "Current Liabilities", aliases: ["wages payable"], note: "Accrued salaries payable is a current liability." },
    { name: "Owner's Capital", type: "Equity", normalBalance: "Credit", statement: "Balance Sheet", section: "Equity", aliases: ["capital", "owner capital"], note: "Owner's capital is an equity account with a normal credit balance." },
    { name: "Retained Earnings", type: "Equity", normalBalance: "Credit", statement: "Balance Sheet", section: "Equity", aliases: ["re"], note: "Retained earnings is part of shareholders' equity." },
    { name: "Drawing", type: "Equity", normalBalance: "Debit", statement: "Balance Sheet", section: "Equity", aliases: ["withdrawals"], note: "Drawing is a contra-equity account with a normal debit balance." },
    { name: "Sales Revenue", type: "Revenue", normalBalance: "Credit", statement: "Income Statement", section: "Revenue", aliases: ["sales", "service revenue", "fees earned"], note: "Revenue accounts normally carry credit balances." },
    { name: "Sales Returns and Allowances", type: "Contra Revenue", normalBalance: "Debit", statement: "Income Statement", section: "Revenue", aliases: ["sales returns"], note: "Sales returns and allowances reduces revenue and has a normal debit balance." },
    { name: "Sales Discounts", type: "Contra Revenue", normalBalance: "Debit", statement: "Income Statement", section: "Revenue", aliases: ["discounts allowed"], note: "Sales discounts is a contra revenue account." },
    { name: "Cost of Goods Sold", type: "Expense", normalBalance: "Debit", statement: "Income Statement", section: "Expenses", aliases: ["cogs", "cost of sales"], note: "Cost of goods sold is an expense account with a normal debit balance." },
    { name: "Salaries Expense", type: "Expense", normalBalance: "Debit", statement: "Income Statement", section: "Expenses", aliases: ["wages expense"], note: "Expense accounts normally carry debit balances." },
    { name: "Rent Expense", type: "Expense", normalBalance: "Debit", statement: "Income Statement", section: "Expenses", aliases: ["rental expense"], note: "Rent expense is reported on the income statement." },
    { name: "Utilities Expense", type: "Expense", normalBalance: "Debit", statement: "Income Statement", section: "Expenses", aliases: ["electricity expense", "water expense"], note: "Utilities expense has a normal debit balance." },
    { name: "Interest Expense", type: "Expense", normalBalance: "Debit", statement: "Income Statement", section: "Expenses", aliases: ["finance cost"], note: "Interest expense is an income statement account." },
];
function normalizeText(value) {
    return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}
export function searchAccountReferences(query) {
    const normalizedQuery = normalizeText(query);
    if (!normalizedQuery)
        return ACCOUNT_REFERENCE_DATA.slice(0, 8);
    return ACCOUNT_REFERENCE_DATA.map((entry) => {
        const haystacks = [entry.name, entry.type, entry.section, ...entry.aliases].map(normalizeText);
        let score = 0;
        haystacks.forEach((value) => {
            if (value === normalizedQuery)
                score += 120;
            else if (value.startsWith(normalizedQuery))
                score += 80;
            else if (value.includes(normalizedQuery))
                score += 45;
        });
        return { ...entry, score };
    })
        .filter((entry) => entry.score > 0)
        .sort((left, right) => right.score - left.score || left.name.localeCompare(right.name))
        .slice(0, 8);
}
