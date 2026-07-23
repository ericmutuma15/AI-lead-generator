import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/ui/Button";

export default function Register() {
  const [form, setForm] = useState({ email: "", password: "", full_name: "", business_name: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.18),transparent_30%),linear-gradient(180deg,#020617_0%,#0f172a_100%)] px-4 py-10">
      <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="text-2xl font-semibold text-white">Create your workspace</h1>
        <p className="mt-2 text-sm text-slate-300">Start capturing leads with secure authentication.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error ? <div className="rounded-xl border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</div> : null}
          <input name="full_name" placeholder="Full name" value={form.full_name} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none focus:border-blue-400" required />
          <input name="business_name" placeholder="Business name" value={form.business_name} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none focus:border-blue-400" required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none focus:border-blue-400" required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none focus:border-blue-400" required />
          <Button type="submit" loading={loading} fullWidth>Create account</Button>
        </form>
      </div>
    </div>
  );
}
