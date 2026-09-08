export default function InvoiceFormLineItems({
  items,
  onAddItem,
  onItemChange,
  onRemoveItem,
  taxPercent,
  setTaxPercent,
  totalAmount,
}) {
  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono text-cyan uppercase tracking-wider">Line Items</label>
        <button
          type="button"
          onClick={onAddItem}
          className="text-xs text-cyan hover:underline"
        >
          + Add Item
        </button>
      </div>

      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2 bg-void/50 p-2.5 rounded-xl border border-edge">
          <input
            type="text"
            placeholder="Item Description"
            value={item.description}
            onChange={(e) => onItemChange(idx, "description", e.target.value)}
            className="flex-1 rounded-lg bg-void border border-edge px-3 py-1.5 text-xs focus-ring outline-none text-paper"
            required
          />
          <input
            type="number"
            min="1"
            placeholder="Qty"
            value={item.quantity}
            onChange={(e) => onItemChange(idx, "quantity", e.target.value)}
            className="w-16 rounded-lg bg-void border border-edge px-2 py-1.5 text-xs focus-ring outline-none text-center text-paper"
          />
          <input
            type="number"
            min="0"
            placeholder="Price (₹)"
            value={item.price}
            onChange={(e) => onItemChange(idx, "price", e.target.value)}
            className="w-28 rounded-lg bg-void border border-edge px-2 py-1.5 text-xs focus-ring outline-none text-right text-paper"
          />
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => onRemoveItem(idx)}
              className="text-mist hover:text-rose-400 text-xs px-1"
              title="Remove item"
            >
              ✕
            </button>
          )}
        </div>
      ))}

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div>
          <label className="block text-xs font-mono text-mist uppercase mb-1">Tax (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={taxPercent}
            onChange={(e) => setTaxPercent(e.target.value)}
            className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none text-paper"
          />
        </div>
        <div className="text-right flex flex-col justify-end">
          <span className="text-xs text-mist">Total Amount</span>
          <span className="font-mono text-xl font-bold text-cyan">₹{Number(totalAmount || 0).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
