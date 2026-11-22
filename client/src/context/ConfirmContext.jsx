import { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";
import { AlertTriangle, Trash2, HelpCircle, X } from "lucide-react";

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    variant: "danger", // 'danger' | 'warning' | 'primary'
    resolve: null,
  });

  const cancelButtonRef = useRef(null);

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      setDialogState({
        isOpen: true,
        title: options.title || (options.variant === "primary" ? "Confirm Action" : "Are you sure?"),
        message: typeof options === "string" ? options : options.message || options.description || "",
        confirmText: options.confirmText || (options.variant === "primary" ? "Confirm" : "Delete"),
        cancelText: options.cancelText || "Cancel",
        variant: options.variant || "danger",
        resolve,
      });
    });
  }, []);

  const handleConfirm = () => {
    if (dialogState.resolve) dialogState.resolve(true);
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleCancel = () => {
    if (dialogState.resolve) dialogState.resolve(false);
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  };

  // Keyboard shortcut: Escape to cancel, Enter to confirm
  useEffect(() => {
    if (!dialogState.isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Autofocus cancel button for safety
    setTimeout(() => {
      cancelButtonRef.current?.focus();
    }, 50);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dialogState.isOpen]);

  const isDanger = dialogState.variant === "danger";

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      {dialogState.isOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-void/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto select-none"
          onClick={handleCancel}
          role="dialog"
          aria-modal="true"
        >
          {/* Modal Card */}
          <div
            className={`relative w-full max-w-md max-h-[calc(100vh-2rem)] overflow-y-auto overflow-x-hidden rounded-2xl bg-panel border border-edge shadow-2xl p-6 sm:p-7 text-left border-t-2 ${
              isDanger ? "border-t-rose-500" : "border-t-cyan"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Subtle top ambient glow */}
            <div
              className={`absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-28 rounded-full blur-3xl pointer-events-none opacity-40 ${
                isDanger ? "bg-red-500" : "bg-cyan"
              }`}
            />

            {/* Header row: Icon & Close */}
            <div className="flex items-start justify-between gap-4 relative z-10 mb-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                  isDanger
                    ? "bg-red-500/10 border-red-500/30 text-red-400"
                    : dialogState.variant === "warning"
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                    : "bg-cyan/10 border-cyan/30 text-cyan"
                }`}
              >
                {isDanger ? (
                  <Trash2 size={22} strokeWidth={2} />
                ) : dialogState.variant === "warning" ? (
                  <AlertTriangle size={22} strokeWidth={2} />
                ) : (
                  <HelpCircle size={22} strokeWidth={2} />
                )}
              </div>

              <button
                onClick={handleCancel}
                className="p-1.5 rounded-lg text-mist hover:text-paper hover:bg-white/5 transition"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="relative z-10 space-y-2 mb-6">
              <h3 className="font-display text-lg sm:text-xl font-bold text-paper">
                {dialogState.title}
              </h3>
              <p className="text-sm text-mist leading-relaxed">
                {dialogState.message}
              </p>
            </div>

            {/* Actions */}
            <div className="relative z-10 flex items-center justify-end gap-3 pt-2">
              <button
                ref={cancelButtonRef}
                onClick={handleCancel}
                className="px-4 py-2.5 rounded-xl border border-edge bg-panel/80 hover:bg-panel text-mist hover:text-paper text-sm font-medium transition focus-ring active:scale-[0.98]"
              >
                {dialogState.cancelText}
              </button>

              <button
                onClick={handleConfirm}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-lg active:scale-[0.98] focus-ring ${
                  isDanger
                    ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20"
                    : "bg-grad-primary text-void hover:brightness-110 shadow-cyan/20"
                }`}
              >
                {dialogState.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context;
}
