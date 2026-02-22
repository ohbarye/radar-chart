import type { ChartItem } from "../lib/types";

interface Props {
  item: ChartItem;
  onUpdate: (id: string, updates: Partial<Omit<ChartItem, "id">>) => void;
  onRemove: (id: string) => void;
  canDelete: boolean;
}

export function ItemEditor({ item, onUpdate, onRemove, canDelete }: Props) {
  return (
    <div className="item-editor">
      <input
        type="text"
        className="item-label"
        value={item.label}
        onChange={(e) => onUpdate(item.id, { label: e.target.value })}
        placeholder="Label"
      />
      <input
        type="range"
        className="item-slider"
        min={0}
        max={100}
        value={item.value}
        onChange={(e) =>
          onUpdate(item.id, { value: Number(e.target.value) })
        }
      />
      <span className="item-value">{item.value}</span>
      <button
        className="item-delete"
        onClick={() => onRemove(item.id)}
        disabled={!canDelete}
        title="Delete item"
      >
        &times;
      </button>
    </div>
  );
}
