export default function InvoiceFormPaymentSection({
  showPaymentDetails,
  setShowPaymentDetails,
  upiId,
  setUpiId,
  beneficiaryName,
  setBeneficiaryName,
  bankName,
  setBankName,
  accountNumber,
  setAccountNumber,
  ifscCode,
  setIfscCode,
}) {
  return (
    <div className="bg-void/60 border border-edge rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-edge/60 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">💳</span>
          <span className="text-xs font-mono font-semibold text-cyan uppercase tracking-wider">
            Receiving Account & Dynamic UPI Details
          </span>
        </div>
        <label className="flex items-center gap-2 text-xs font-mono text-mist cursor-pointer">
          <input
            type="checkbox"
            checked={showPaymentDetails}
            onChange={(e) => setShowPaymentDetails(e.target.checked)}
            className="accent-cyan rounded"
          />
          Include on Invoice
        </label>
      </div>

      {showPaymentDetails && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-mono text-mist uppercase mb-1">UPI ID (VPA)</label>
            <input
              type="text"
              placeholder="e.g. 8210539367@fam"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full rounded-lg bg-void border border-edge px-3 py-1.5 text-xs focus-ring outline-none text-paper font-mono text-cyan"
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono text-mist uppercase mb-1">Account Holder / Beneficiary</label>
            <input
              type="text"
              placeholder="Jai Kishan Kumar (Webnex Labs)"
              value={beneficiaryName}
              onChange={(e) => setBeneficiaryName(e.target.value)}
              className="w-full rounded-lg bg-void border border-edge px-3 py-1.5 text-xs focus-ring outline-none text-paper font-mono"
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono text-mist uppercase mb-1">Bank Name</label>
            <input
              type="text"
              placeholder="State Bank of India / HDFC"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full rounded-lg bg-void border border-edge px-3 py-1.5 text-xs focus-ring outline-none text-paper font-mono"
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono text-mist uppercase mb-1">Account Number & IFSC</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="A/C Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-2/3 rounded-lg bg-void border border-edge px-3 py-1.5 text-xs focus-ring outline-none text-paper font-mono"
              />
              <input
                type="text"
                placeholder="IFSC"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                className="w-1/3 rounded-lg bg-void border border-edge px-3 py-1.5 text-xs focus-ring outline-none text-paper font-mono uppercase"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
