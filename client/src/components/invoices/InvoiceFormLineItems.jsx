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
          className="text-xs text-cyan hover:underline font-mono"
        >
          + Add Item
        </button>
      </div>

      {items.map((item, idx) => (
        <div key={idx} className="bg-void/50 p-3 rounded-xl border border-edge space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="block text-[10px] font-mono text-mist uppercase mb-0.5">Item Title</label>
              <input
                type="text"
                placeholder="e.g. Custom Web Application"
                value={item.description}
                onChange={(e) => onItemChange(idx, "description", e.target.value)}
                className="w-full rounded-lg bg-void border border-edge px-3 py-1.5 text-xs focus-ring outline-none text-paper"
                required
              />
            </div>
            <div className="w-16">
              <label className="block text-[10px] font-mono text-mist uppercase mb-0.5 text-center">Qty</label>
              <input
                type="number"
                min="1"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => onItemChange(idx, "quantity", e.target.value)}
                className="w-full rounded-lg bg-void border border-edge px-2 py-1.5 text-xs focus-ring outline-none text-center text-paper"
              />
            </div>
            <div className="w-28">
              <label className="block text-[10px] font-mono text-mist uppercase mb-0.5 text-right">Price (₹)</label>
              <input
                type="number"
                min="0"
                placeholder="Price"
                value={item.price}
                onChange={(e) => onItemChange(idx, "price", e.target.value)}
                className="w-full rounded-lg bg-void border border-edge px-2 py-1.5 text-xs focus-ring outline-none text-right text-paper"
              />
            </div>
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveItem(idx)}
                className="text-mist hover:text-rose-400 text-xs px-1 self-end mb-1.5"
                title="Remove item"
              >
                ✕
              </button>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-mono text-mist uppercase mb-0.5 flex items-center justify-between">
              <span>Sub-description / Bespoke Note</span>
              <span className="text-[9px] text-mist/60 normal-case">(Leave blank to remove)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Bespoke software engineering & digital implementation"
              value={
                item.subDescription !== undefined
                  ? item.subDescription
                  : item.subtitle !== undefined
                  ? item.subtitle
                  : ""
              }
              onChange={(e) => {
                onItemChange(idx, "subDescription", e.target.value);
                onItemChange(idx, "subtitle", e.target.value);
              }}
              className="w-full rounded-lg bg-void/80 border border-edge/80 px-3 py-1.5 text-xs focus-ring outline-none text-paper placeholder:text-mist/40"
            />
          </div>
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
