import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { computeSalesMixBreakEven } from "../../utils/calculatorMath";

type ProductRow = {
    id: string;
    label: string;
    sellingPrice: string;
    variableCost: string;
    mixShare: string;
};

const DEFAULT_PRODUCTS: ProductRow[] = [
    { id: "product-a", label: "Product A", sellingPrice: "", variableCost: "", mixShare: "3" },
    { id: "product-b", label: "Product B", sellingPrice: "", variableCost: "", mixShare: "2" },
];

function nextProductId() {
    return `product-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

export default function SalesMixBreakEvenPage() {
    const [fixedCosts, setFixedCosts] = useState("");
    const [products, setProducts] = useState<ProductRow[]>(DEFAULT_PRODUCTS);

    const result = useMemo(() => {
        if (fixedCosts.trim() === "") return null;

        const parsedFixedCosts = Number(fixedCosts);
        if (Number.isNaN(parsedFixedCosts)) {
            return { error: "Fixed costs must be a valid number." };
        }

        if (parsedFixedCosts <= 0) {
            return { error: "Fixed costs must be greater than zero." };
        }

        const populatedProducts = products.filter(
            (product) =>
                product.label.trim() !== "" ||
                product.sellingPrice.trim() !== "" ||
                product.variableCost.trim() !== "" ||
                product.mixShare.trim() !== ""
        );

        if (populatedProducts.length < 2) {
            return { error: "Enter at least two products to analyze sales mix." };
        }

        const parsedProducts = populatedProducts.map((product) => ({
            label: product.label.trim() || "Product",
            sellingPrice: Number(product.sellingPrice),
            variableCost: Number(product.variableCost),
            mixShare: Number(product.mixShare),
        }));

        if (
            parsedProducts.some(
                (product) =>
                    Number.isNaN(product.sellingPrice) ||
                    Number.isNaN(product.variableCost) ||
                    Number.isNaN(product.mixShare)
            )
        ) {
            return { error: "Each product needs valid selling price, variable cost, and mix share values." };
        }

        if (
            parsedProducts.some(
                (product) =>
                    product.sellingPrice <= 0 ||
                    product.variableCost < 0 ||
                    product.mixShare <= 0
            )
        ) {
            return {
                error: "Selling price and mix share must be greater than zero. Variable cost cannot be negative.",
            };
        }

        if (
            parsedProducts.some(
                (product) => product.sellingPrice - product.variableCost <= 0
            )
        ) {
            return {
                error: "Every product in the mix needs a positive contribution margin to compute a break-even sales mix safely.",
            };
        }

        return computeSalesMixBreakEven({
            fixedCosts: parsedFixedCosts,
            products: parsedProducts,
        });
    }, [fixedCosts, products]);

    function updateProduct(id: string, patch: Partial<ProductRow>) {
        setProducts((current) =>
            current.map((product) => (product.id === id ? { ...product, ...patch } : product))
        );
    }

    function addProduct() {
        setProducts((current) => [
            ...current,
            {
                id: nextProductId(),
                label: "",
                sellingPrice: "",
                variableCost: "",
                mixShare: "1",
            },
        ]);
    }

    function removeProduct(id: string) {
        setProducts((current) => current.filter((product) => product.id !== id));
    }

    return (
        <CalculatorPageLayout
            badge="Managerial & Cost"
            title="Sales Mix Break-even"
            description="Analyze multi-product break-even using a composite sales mix instead of forcing every case into a single-product CVP setup."
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <InputGrid columns={1}>
                            <InputCard
                                label="Fixed Costs"
                                value={fixedCosts}
                                onChange={setFixedCosts}
                                placeholder="180000"
                            />
                        </InputGrid>
                    </SectionCard>

                    <SectionCard>
                        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                            <div>
                                <p className="app-card-title text-base">Product mix</p>
                                <p className="app-body-md mt-2 text-sm">
                                    Enter each product's selling price, variable cost, and relative
                                    mix share. The mix share can be a ratio such as 3:2:1 or a unit
                                    mix weight.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={addProduct}
                                className="app-button-secondary rounded-xl px-4 py-2 text-sm font-medium"
                            >
                                Add product
                            </button>
                        </div>

                        <div className="mt-4 space-y-3">
                            {products.map((product, index) => (
                                <div key={product.id} className="app-subtle-surface rounded-[1.3rem] p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                            Product {index + 1}
                                        </p>
                                        {products.length > 2 ? (
                                            <button
                                                type="button"
                                                onClick={() => removeProduct(product.id)}
                                                className="app-button-ghost rounded-xl px-3 py-1.5 text-xs font-medium"
                                            >
                                                Remove
                                            </button>
                                        ) : null}
                                    </div>
                                    <div className="mt-3">
                                        <InputGrid columns={3}>
                                            <InputCard
                                                label="Label"
                                                value={product.label}
                                                onChange={(value) =>
                                                    updateProduct(product.id, { label: value })
                                                }
                                                placeholder="Product A"
                                            />
                                            <InputCard
                                                label="Selling Price"
                                                value={product.sellingPrice}
                                                onChange={(value) =>
                                                    updateProduct(product.id, {
                                                        sellingPrice: value,
                                                    })
                                                }
                                                placeholder="240"
                                            />
                                            <InputCard
                                                label="Variable Cost"
                                                value={product.variableCost}
                                                onChange={(value) =>
                                                    updateProduct(product.id, {
                                                        variableCost: value,
                                                    })
                                                }
                                                placeholder="150"
                                            />
                                            <InputCard
                                                label="Mix Share"
                                                value={product.mixShare}
                                                onChange={(value) =>
                                                    updateProduct(product.id, { mixShare: value })
                                                }
                                                placeholder="3"
                                            />
                                        </InputGrid>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                </div>
            }
            resultSection={
                result && "error" in result ? (
                    <SectionCard className="app-tone-warning">
                        <p className="app-card-title text-sm">Input notice</p>
                        <p className="app-body-md mt-2 text-sm">{result.error}</p>
                    </SectionCard>
                ) : result ? (
                    <div className="space-y-4">
                        <ResultGrid columns={4}>
                            <ResultCard
                                title="Composite Unit Contribution"
                                value={formatPHP(result.compositeUnitContribution)}
                            />
                            <ResultCard
                                title="Composite Unit Sales"
                                value={formatPHP(result.compositeUnitSales)}
                            />
                            <ResultCard
                                title="Break-even Composite Units"
                                value={result.breakEvenCompositeUnits.toFixed(2)}
                            />
                            <ResultCard
                                title="Break-even Sales"
                                value={formatPHP(result.breakEvenSales)}
                            />
                        </ResultGrid>

                        <SectionCard>
                            <div className="space-y-3">
                                {result.breakEvenUnitsByProduct.map((product) => (
                                    <div
                                        key={product.label}
                                        className="flex flex-col gap-2 rounded-[1.2rem] border app-divider px-4 py-3 md:flex-row md:items-center md:justify-between"
                                    >
                                        <div>
                                            <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                                {product.label}
                                            </p>
                                            <p className="app-helper mt-1 text-xs">
                                                Mix share {product.mixShare.toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="text-sm font-semibold text-[color:var(--app-text)]">
                                            {product.breakEvenUnits.toFixed(2)} units ·{" "}
                                            {formatPHP(product.breakEvenSales)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </SectionCard>
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Break-even composite units = Fixed costs / Contribution margin of one composite sales mix unit."
                        steps={[
                            ...result.rows.map(
                                (row) =>
                                    `${row.label}: selling price ${formatPHP(row.sellingPrice)} - variable cost ${formatPHP(row.variableCost)} = contribution margin ${formatPHP(row.contributionMarginPerUnit)}.`
                            ),
                            `Composite unit contribution = ${formatPHP(result.compositeUnitContribution)}.`,
                            `Composite unit sales = ${formatPHP(result.compositeUnitSales)}.`,
                            `Weighted average contribution margin ratio = ${(result.weightedAverageContributionMarginRatio * 100).toFixed(2)}%.`,
                            `Break-even composite units = ${formatPHP(Number(fixedCosts || 0))} / ${formatPHP(result.compositeUnitContribution)} = ${result.breakEvenCompositeUnits.toFixed(2)}.`,
                            `Break-even sales = ${formatPHP(result.breakEvenSales)}.`,
                        ]}
                        glossary={[
                            {
                                term: "Composite unit",
                                meaning:
                                    "One bundle of sales that follows the assumed mix proportions across all products.",
                            },
                            {
                                term: "Sales mix",
                                meaning:
                                    "The relative proportions in which products are expected to be sold.",
                            },
                            {
                                term: "Weighted average contribution margin ratio",
                                meaning:
                                    "The contribution margin ratio produced by the full composite sales mix rather than by one product alone.",
                            },
                        ]}
                        interpretation={`At the current product mix, the business needs ${result.breakEvenCompositeUnits.toFixed(2)} composite units, or ${formatPHP(result.breakEvenSales)} in sales, to break even. If the sales mix shifts materially, the break-even point should be recalculated because the weighted contribution margin will also change.`}
                        assumptions={[
                            "This model assumes the sales mix stays reasonably stable across the relevant range.",
                            "Fixed costs are treated as constant and variable cost behavior is assumed linear within the analyzed range.",
                        ]}
                        warnings={[
                            "A sales-mix break-even is only as reliable as the assumed mix. If one product becomes dominant, the weighted contribution margin changes and the break-even answer moves with it.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
