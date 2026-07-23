import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/ui/Button";

export default function Login() {
  const [email, setEmail] = useState("demo@leadgen.app");
  const [password, setPassword] = useState("DemoPass123!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.18),transparent_30%),linear-gradient(180deg,#020617_0%,#0f172a_100%)] px-4 py-10">
      <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-xl font-semibold text-white">AI</div>
          <h1 className="mt-6 text-2xl font-semibold text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-300">Sign in to access your AI lead workspace.</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error ? <div className="rounded-xl border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</div> : null}
          <label className="block text-sm text-slate-200">
            <span className="mb-1 block">Email</span>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none focus:border-blue-400" required />
          </label>
          <label className="block text-sm text-slate-200">
            <span className="mb-1 block">Password</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none focus:border-blue-400" required />
          </label>
          <Button type="submit" loading={loading} fullWidth>Sign in</Button>
        </form>
      </div>
    </div>
  );
}
