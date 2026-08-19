import { useState, useEffect } from "react";
import api from "../../api/client.js";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext.jsx";
import { Sparkles, ToggleLeft, ToggleRight } from "lucide-react";

export default function AdminSettings() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  // Feature Flags: 3D Ghost Mascot
  const [showGhost, setShowGhost] = useState(true);
  const [savingFlag, setSavingFlag] = useState(false);

  useEffect(() => {
    // Fetch global site settings
    api.get("/settings")
      .then((res) => {
        if (res.data?.showGhost !== undefined) {
          setShowGhost(res.data.showGhost);
        }
      })
      .catch((err) => console.error("Failed to load settings:", err));
  }, []);

  async function handleToggleGhost() {
    const newValue = !showGhost;
    setShowGhost(newValue);
    setSavingFlag(true);
    try {
      await api.post("/settings", { showGhost: newValue });
      toast.success(newValue ? "3D Ghost Hero enabled for all visitors!" : "Centered Classic Hero enabled for all visitors!");
    } catch (err) {
      setShowGhost(!newValue); // Revert on failure
      toast.error("Failed to update feature flag setting.");
    } finally {
      setSavingFlag(false);
    }
  }

  async function handlePasswordChange(e) {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (newPassword !== confirmPassword) {
      setStatus({ type: "error", message: "New passwords do not match." });
      return;
    }

    if (newPassword.length < 6) {
      setStatus({ type: "error", message: "New password must be at least 6 characters long." });
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      setStatus({ type: "success", message: res.data.message || "Password updated successfully!" });
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to change password. Please verify current password.";
      setStatus({ type: "error", message: errorMsg });
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 max-w-xl">
      <div>
        <h1 className="font-display text-3xl font-bold text-paper mb-2">Admin Settings</h1>
        <p className="text-xs font-mono text-mist">Manage your security credentials, feature flags, and site configuration.</p>
      </div>

      {/* Feature Flags & Hero Display Controls */}
      <div className="bg-panel border border-edge rounded-2xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={16} className="text-cyan animate-pulse" />
          <h2 className="font-display text-lg font-bold text-paper">Feature Flags & Experience</h2>
        </div>
        <p className="text-xs text-mist mb-5">Toggle interactive UI features live for all visitors in real-time.</p>

        <div className="bg-void/60 border border-edge rounded-xl p-4 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-paper">3D Ghost Hero Mascot</span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  showGhost
                    ? "bg-emerald-950/40 text-emerald-300 border-emerald-800/40"
                    : "bg-void text-mist border-edge"
                }`}
              >
                {showGhost ? "ENABLED" : "DISABLED"}
              </span>
            </div>
            <p className="text-xs text-mist mt-1">
              {showGhost
                ? "Showing 2-column Hero with interactive 3D cute rotating ghost mascot to everyone."
                : "Showing centered classic Hero typography layout to everyone."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleGhost}
            disabled={savingFlag}
            className="flex-shrink-0 transition-transform active:scale-95 disabled:opacity-50"
            title="Toggle 3D Ghost Hero"
          >
            {showGhost ? (
              <ToggleRight size={38} className="text-cyan fill-cyan/20" />
            ) : (
              <ToggleLeft size={38} className="text-mist" />
            )}
          </button>
        </div>
      </div>

      {/* Profile Info Card */}
      <div className="bg-panel border border-edge rounded-2xl p-6">
        <h2 className="text-sm font-mono text-cyan uppercase tracking-wider font-semibold mb-4">Account Profile</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center py-2 border-b border-edge/40">
            <span className="text-mist font-mono text-xs">NAME</span>
            <span className="text-paper font-semibold">{user?.name || "Webnex Admin"}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-edge/40">
            <span className="text-mist font-mono text-xs">EMAIL</span>
            <span className="text-paper font-mono text-xs text-cyan">{user?.email || "kumar.jaikishan0@gmail.com"}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-mist font-mono text-xs">ROLE</span>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-cyan/10 text-cyan border border-cyan/30">
              Administrator
            </span>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-panel border border-edge rounded-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-xl font-bold text-paper">Change Password</h2>
            <p className="text-xs text-mist mt-1">Update your admin login password securely.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="text-xs font-mono text-cyan hover:underline"
          >
            {showPass ? "Hide Passwords" : "Show Passwords"}
          </button>
        </div>

        {status.message && (
          <div
            className={`p-3.5 rounded-xl text-sm mb-5 ${
              status.type === "error"
                ? "bg-red-950/30 border border-red-800/40 text-red-400"
                : "bg-emerald-950/30 border border-emerald-800/40 text-emerald-300"
            }`}
          >
            {status.message}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-mist uppercase tracking-wider mb-2">
              Current Password
            </label>
            <input
              type={showPass ? "text" : "password"}
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full rounded-xl bg-void border border-edge px-4 py-3 text-paper focus-ring outline-none transition text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-mist uppercase tracking-wider mb-2">
              New Password
            </label>
            <input
              type={showPass ? "text" : "password"}
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full rounded-xl bg-void border border-edge px-4 py-3 text-paper focus-ring outline-none transition text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-mist uppercase tracking-wider mb-2">
              Confirm New Password
            </label>
            <input
              type={showPass ? "text" : "password"}
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full rounded-xl bg-void border border-edge px-4 py-3 text-paper focus-ring outline-none transition text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 px-6 py-3.5 rounded-xl bg-grad-primary text-void font-semibold hover:brightness-110 active:scale-[0.99] transition focus-ring disabled:opacity-50 text-sm shadow-md"
          >
            {loading ? "Updating Password…" : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
