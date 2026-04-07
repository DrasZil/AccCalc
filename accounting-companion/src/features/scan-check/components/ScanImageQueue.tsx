import type { ScanImageItem } from "../types";
import ScanImageCard from "./ScanImageCard";

type ScanImageQueueProps = {
    items: ScanImageItem[];
    onRemove: (id: string) => void;
    onMove: (id: string, direction: -1 | 1) => void;
    onToggleSelected: (id: string) => void;
    onSendToSmartSolver: (item: ScanImageItem) => void;
    onTextChange: (id: string, value: string) => void;
    onReplace: (id: string, file: File) => void;
    onSetActivePreview: (id: string) => void;
};

export default function ScanImageQueue({
    items,
    onRemove,
    onMove,
    onToggleSelected,
    onSendToSmartSolver,
    onTextChange,
    onReplace,
    onSetActivePreview,
}: ScanImageQueueProps) {
    return (
        <div className="grid gap-4 xl:grid-cols-2">
            {items.map((item) => (
                <ScanImageCard
                    key={item.id}
                    item={item}
                    onRemove={() => onRemove(item.id)}
                    onMoveLeft={() => onMove(item.id, -1)}
                    onMoveRight={() => onMove(item.id, 1)}
                    onToggleSelected={() => onToggleSelected(item.id)}
                    onSendToSmartSolver={() => onSendToSmartSolver(item)}
                    onTextChange={(value) => onTextChange(item.id, value)}
                    onReplace={(file) => onReplace(item.id, file)}
                    onSetActivePreview={() => onSetActivePreview(item.id)}
                />
            ))}
        </div>
    );
}

