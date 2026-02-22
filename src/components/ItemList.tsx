import type { ChartItem } from "../lib/types";
import { ItemEditor } from "./ItemEditor";

interface Props {
  items: ChartItem[];
  onUpdate: (id: string, updates: Partial<Omit<ChartItem, "id">>) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}

const MIN_ITEMS = 3;

export function ItemList({ items, onUpdate, onAdd, onRemove }: Props) {
  return (
    <div className="item-list">
      {items.map((item) => (
        <ItemEditor
          key={item.id}
          item={item}
          onUpdate={onUpdate}
          onRemove={onRemove}
          canDelete={items.length > MIN_ITEMS}
        />
      ))}
      <button className="add-item" onClick={onAdd}>
        + Add Item
      </button>
    </div>
  );
}
