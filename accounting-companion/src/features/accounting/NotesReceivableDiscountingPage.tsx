import FormulaSolveWorkspace from "../../components/FormulaSolveWorkspace";
import { notesReceivableDiscountingSolveDefinition } from "../../utils/formulaSolveDefinitions";

export default function NotesReceivableDiscountingPage() {
    return (
        <FormulaSolveWorkspace
            badge="FAR"
            title="Notes Receivable Discounting"
            description="Move from note interest to maturity value, bank discount, and final proceeds when a note receivable is discounted before maturity."
            definition={notesReceivableDiscountingSolveDefinition}
        />
    );
}
