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

  // Feature Flags: 3D Hero Mascot Style & Background Style
  const [hero3DStyle, setHero3DStyle] = useState("cyber_bot");
  const [backgroundStyle, setBackgroundStyle] = useState("cyber_grid");
  const [savingFlag, setSavingFlag] = useState(false);
  const [savingBgFlag, setSavingBgFlag] = useState(false);

  useEffect(() => {
    // Fetch global site settings
    api.get("/settings")
      .then((res) => {
        if (res.data?.hero3DStyle !== undefined) {
          setHero3DStyle(res.data.hero3DStyle);
        } else if (res.data?.showGhost !== undefined) {
          setHero3DStyle(res.data.showGhost ? "cyber_bot" : "none");
        }
        if (res.data?.backgroundStyle !== undefined) {
          setBackgroundStyle(res.data.backgroundStyle);
        }
      })
      .catch((err) => console.error("Failed to load settings:", err));
  }, []);

  async function handleSelectHeroStyle(newStyle) {
    if (newStyle === hero3DStyle) return;
    const oldStyle = hero3DStyle;
    setHero3DStyle(newStyle);
    setSavingFlag(true);
    try {
      await api.post("/settings", {
        hero3DStyle: newStyle,
        showGhost: newStyle !== "none",
      });
      const names = {
        cyber_bot: "🤖 Animated 3D Cyber Robot",
        cyber_fox_3d: "🦊 Animated 3D Cyber Fox",
        reaper_3d: "🦊 Animated 3D Cyber Fox",
        canvas_ghost: "👻 Classic 2D Cute Ghost",
        none: "📄 Centered Classic Hero",
      };
      toast.success(`Hero style set to: ${names[newStyle] || newStyle}!`);
    } catch (err) {
      setHero3DStyle(oldStyle);
      toast.error("Failed to update hero style setting.");
    } finally {
      setSavingFlag(false);
    }
  }

  async function handleSelectBackgroundStyle(newBg) {
    if (newBg === backgroundStyle) return;
    const oldBg = backgroundStyle;
    setBackgroundStyle(newBg);
    setSavingBgFlag(true);
    try {
      await api.post("/settings", {
        backgroundStyle: newBg,
      });
      window.dispatchEvent(
        new CustomEvent("webnex:backgroundStyle", { detail: { backgroundStyle: newBg } })
      );
      const bgNames = {
        cyber_grid: "🌐 21st.dev Interactive Cyber Grid & Spotlight",
        warp_speed: "🚀 3D Warp Speed Hyperdrive Vortex",
        classic_particles: "✨ Classic Constellation & Orbiting 3D Halo",
        minimal_dark: "🌑 Minimalist Deep Void Space",
      };
      toast.success(`Background style set to: ${bgNames[newBg] || newBg}!`);
    } catch (err) {
      setBackgroundStyle(oldBg);
      toast.error("Failed to update background setting.");
    } finally {
      setSavingBgFlag(false);
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
        <p className="text-xs font-mono text-mist">Manage your security credentials, hero 3D style, and site configuration.</p>
      </div>

      {/* Feature Flags: 3D Hero Mascot Switcher */}
      <div className="bg-panel border border-edge rounded-2xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-cyan animate-pulse" />
            <h2 className="font-display text-lg font-bold text-paper">Hero 3D Mascot & Experience</h2>
          </div>
          {savingFlag && (
            <span className="font-mono text-[10px] text-cyan animate-pulse">Saving...</span>
          )}
        </div>
        <p className="text-xs text-mist mb-5">Select which 3D visual experience is displayed on the homepage for all visitors.</p>

        <div className="space-y-3">
          {/* Option 1: Animated 3D Cyber Robot (Three.js WebGL) */}
          <div
            onClick={() => !savingFlag && handleSelectHeroStyle("cyber_bot")}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
              hero3DStyle === "cyber_bot" || hero3DStyle === "three_3d" || hero3DStyle === "cyber_3d"
                ? "bg-cyan/15 border-cyan shadow-[0_0_25px_rgba(6,182,212,0.25)]"
                : "bg-void/60 border-edge hover:border-edge/90 hover:bg-panel2"
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-paper">🤖 Animated 3D Cyber Robot</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border bg-cyan/15 text-cyan border-cyan/40">
                  Interactive GLTF 3D
                </span>
                {(hero3DStyle === "cyber_bot" || hero3DStyle === "three_3d" || hero3DStyle === "cyber_3d") && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-600">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-mist mt-1 leading-relaxed">
                Full 3D animated robot character with 7 skeletal animations (Wave, Dance, Jump, Like, Walk, Run, Yes), interactive 3D drag & throw physics, gravity bounce, and auto-cycling.
              </p>
            </div>
            <div className="pt-1">
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  hero3DStyle === "cyber_bot" || hero3DStyle === "three_3d" || hero3DStyle === "cyber_3d" ? "border-cyan bg-cyan" : "border-edge bg-void"
                }`}
              >
                {(hero3DStyle === "cyber_bot" || hero3DStyle === "three_3d" || hero3DStyle === "cyber_3d") && <div className="w-2 h-2 rounded-full bg-void" />}
              </div>
            </div>
          </div>

          {/* Option 2: Animated 3D Cyber Fox */}
          <div
            onClick={() => !savingFlag && handleSelectHeroStyle("cyber_fox_3d")}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
              hero3DStyle === "cyber_fox_3d" || hero3DStyle === "reaper_3d"
                ? "bg-amber-500/15 border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.25)]"
                : "bg-void/60 border-edge hover:border-edge/90 hover:bg-panel2"
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-paper">🦊 Animated 3D Cyber Fox</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border bg-amber-500/15 text-amber-300 border-amber-500/40">
                  Skeletal 3D GLTF
                </span>
                {(hero3DStyle === "cyber_fox_3d" || hero3DStyle === "reaper_3d") && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-600">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-mist mt-1 leading-relaxed">
                Real animated 3D Fox mascot with Survey (look around & tail wag), Walk, and Run animations, interactive 3D drag & throw physics, and multi-point cyber lighting.
              </p>
            </div>
            <div className="pt-1">
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  hero3DStyle === "cyber_fox_3d" || hero3DStyle === "reaper_3d" ? "border-amber-400 bg-amber-400" : "border-edge bg-void"
                }`}
              >
                {(hero3DStyle === "cyber_fox_3d" || hero3DStyle === "reaper_3d") && <div className="w-2 h-2 rounded-full bg-void" />}
              </div>
            </div>
          </div>

          {/* Option 3: Classic 2D Canvas Ghost Mascot */}
          <div
            onClick={() => !savingFlag && handleSelectHeroStyle("canvas_ghost")}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
              hero3DStyle === "canvas_ghost"
                ? "bg-sky-500/15 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.2)]"
                : "bg-void/60 border-edge hover:border-edge/90 hover:bg-panel2"
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-paper">👻 Classic 2D Cute Ghost</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border bg-sky-500/15 text-sky-400 border-sky-500/30">
                  Canvas 2D
                </span>
                {hero3DStyle === "canvas_ghost" && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-600">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-mist mt-1 leading-relaxed">
                Lightweight HTML5 canvas-drawn floating ghost with waving tentacle ruffles and blushing rosy cheeks.
              </p>
            </div>
            <div className="pt-1">
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  hero3DStyle === "canvas_ghost" ? "border-sky-400 bg-sky-400" : "border-edge bg-void"
                }`}
              >
                {hero3DStyle === "canvas_ghost" && <div className="w-2 h-2 rounded-full bg-void" />}
              </div>
            </div>
          </div>

          {/* Option 4: Centered Classic Hero (No Mascot) */}
          <div
            onClick={() => !savingFlag && handleSelectHeroStyle("none")}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
              hero3DStyle === "none"
                ? "bg-mist/15 border-mist shadow-[0_0_20px_rgba(151,151,172,0.2)]"
                : "bg-void/60 border-edge hover:border-edge/90 hover:bg-panel2"
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-paper">📄 Centered Classic Typography Hero</span>
                {hero3DStyle === "none" && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-600">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-mist mt-1 leading-relaxed">
                Minimalist centered headline layout without any 3D character, focusing purely on copy and primary call-to-action buttons.
              </p>
            </div>
            <div className="pt-1">
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  hero3DStyle === "none" ? "border-mist bg-mist" : "border-edge bg-void"
                }`}
              >
                {hero3DStyle === "none" && <div className="w-2 h-2 rounded-full bg-void" />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Flags: Background Style & Aesthetic Switcher */}
      <div className="bg-panel border border-edge rounded-2xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-violet animate-pulse" />
            <h2 className="font-display text-lg font-bold text-paper">Background Style & Ambient Canvas</h2>
          </div>
          {savingBgFlag && (
            <span className="font-mono text-[10px] text-cyan animate-pulse">Saving...</span>
          )}
        </div>
        <p className="text-xs text-mist mb-5">Switch between the 21st.dev interactive cyber grid, classic particles, or minimal dark void.</p>

        <div className="space-y-3">
          {/* Option 1: 21st.dev Interactive Cyber Grid & Spotlight */}
          <div
            onClick={() => !savingBgFlag && handleSelectBackgroundStyle("cyber_grid")}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
              backgroundStyle === "cyber_grid"
                ? "bg-cyan/15 border-cyan shadow-[0_0_25px_rgba(6,182,212,0.25)]"
                : "bg-void/60 border-edge hover:border-edge/90 hover:bg-panel2"
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-paper">🌐 21st.dev Interactive Cyber Grid & Spotlight</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border bg-cyan/15 text-cyan border-cyan/40">
                  New Modern
                </span>
                {backgroundStyle === "cyber_grid" && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-600">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-mist mt-1 leading-relaxed">
                Dynamic proximity-illuminated dot matrix grid, interactive radial cursor spotlight, neural constellation webs, particle mouse repulsion, and ambient aurora orbs.
              </p>
            </div>
            <div className="pt-1">
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  backgroundStyle === "cyber_grid" ? "border-cyan bg-cyan" : "border-edge bg-void"
                }`}
              >
                {backgroundStyle === "cyber_grid" && <div className="w-2 h-2 rounded-full bg-void" />}
              </div>
            </div>
          </div>

          {/* Option 2: 3D Warp Speed Hyperdrive Vortex */}
          <div
            onClick={() => !savingBgFlag && handleSelectBackgroundStyle("warp_speed")}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
              backgroundStyle === "warp_speed"
                ? "bg-violet/15 border-violet shadow-[0_0_25px_rgba(124,108,251,0.25)]"
                : "bg-void/60 border-edge hover:border-edge/90 hover:bg-panel2"
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-paper">🚀 3D Warp Speed Hyperdrive Vortex</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border bg-violet/15 text-violet border-violet/40">
                  Trending Sci-Fi 3D
                </span>
                {backgroundStyle === "warp_speed" && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-600">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-mist mt-1 leading-relaxed">
                320 glowing 3D stars flying toward the camera in true 3D perspective with cyan and violet hyperdrive light streaks and interactive mouse steering warp.
              </p>
            </div>
            <div className="pt-1">
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  backgroundStyle === "warp_speed" ? "border-violet bg-violet" : "border-edge bg-void"
                }`}
              >
                {backgroundStyle === "warp_speed" && <div className="w-2 h-2 rounded-full bg-void" />}
              </div>
            </div>
          </div>

          {/* Option 3: Classic Constellation & Orbiting 3D Ring */}
          <div
            onClick={() => !savingBgFlag && handleSelectBackgroundStyle("classic_particles")}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
              backgroundStyle === "classic_particles"
                ? "bg-violet/15 border-violet shadow-[0_0_25px_rgba(124,108,251,0.25)]"
                : "bg-void/60 border-edge hover:border-edge/90 hover:bg-panel2"
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-paper">✨ Classic Constellation & 3D Halo</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border bg-violet/15 text-violet border-violet/40">
                  Previous Canvas
                </span>
                {backgroundStyle === "classic_particles" && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-600">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-mist mt-1 leading-relaxed">
                Original floating stardust particles with gentle connective constellation lines and orbiting 3D gyroscopic cyan cyber ring (no dot matrix grid).
              </p>
            </div>
            <div className="pt-1">
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  backgroundStyle === "classic_particles" ? "border-violet bg-violet" : "border-edge bg-void"
                }`}
              >
                {backgroundStyle === "classic_particles" && <div className="w-2 h-2 rounded-full bg-void" />}
              </div>
            </div>
          </div>

          {/* Option 3: Minimalist Deep Void Space */}
          <div
            onClick={() => !savingBgFlag && handleSelectBackgroundStyle("minimal_dark")}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
              backgroundStyle === "minimal_dark"
                ? "bg-mist/15 border-mist shadow-[0_0_20px_rgba(151,151,172,0.2)]"
                : "bg-void/60 border-edge hover:border-edge/90 hover:bg-panel2"
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-paper">🌑 Minimalist Deep Void Space</span>
                {backgroundStyle === "minimal_dark" && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-600">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-mist mt-1 leading-relaxed">
                Clean, high-contrast dark void background with subtle top atmospheric gradient blur and zero moving canvas particles.
              </p>
            </div>
            <div className="pt-1">
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  backgroundStyle === "minimal_dark" ? "border-mist bg-mist" : "border-edge bg-void"
                }`}
              >
                {backgroundStyle === "minimal_dark" && <div className="w-2 h-2 rounded-full bg-void" />}
              </div>
            </div>
          </div>
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
