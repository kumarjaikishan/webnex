import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role === "admin" ? "/admin" : "/portal");
    } catch {
      setError("Incorrect email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="w-8 h-8 rounded-lg bg-grad-primary" />
          <span className="font-display text-2xl font-bold tracking-tight">Webnex <span className="bg-grad-primary bg-clip-text text-transparent">Labs</span></span>
        </div>
        <h1 className="font-display text-2xl text-paper">Admin & Client Portal Login</h1>
        <p className="text-mist text-sm mt-1">Access Webnex Labs CRM, Invoices & Client Workspace</p>
      </div>

      <div className="bg-panel border border-edge rounded-2xl p-6 sm:p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-mono text-mist uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-void border border-edge px-4 py-3 text-paper focus-ring outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-mist uppercase tracking-wider mb-2">Password</label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl bg-void border border-edge pl-4 pr-12 py-3 text-paper focus-ring outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 p-1.5 text-mist hover:text-cyan transition focus:outline-none"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  /* Eye Slash Icon (Hide) */
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.025 10.025 0 013.122-.863c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
                  </svg>
                ) : (
                  /* Eye Icon (Show) */
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm bg-red-950/30 border border-red-800/40 rounded-lg p-3">{error}</p>}

          <button
            disabled={loading}
            className="w-full px-6 py-3.5 rounded-xl bg-grad-primary text-void font-semibold hover:brightness-110 active:scale-[0.99] transition focus-ring disabled:opacity-50"
          >
            {loading ? "Authenticating…" : "Sign In to Webnex CRM"}
          </button>
        </form>
      </div>
    </div>
  );
}
