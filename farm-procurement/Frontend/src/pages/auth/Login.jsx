import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../utils/roles";

const Login = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", role: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.role) { setError("Please fill all fields."); return; }
    setLoading(true);
    setError("");
    try {
      await login(form);
    } catch (err) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; width: 100%; overflow: hidden; }

        .login-page {
          display: flex; width: 100vw; height: 100vh;
          font-family: 'Manrope', sans-serif;
          position: relative; overflow: hidden;
        }

        .bg-farm {
          position: absolute; inset: 0; z-index: 0;
          background-image: url('https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?auto=compress&cs=tinysrgb&w=1600');
          background-size: cover; background-position: center;
        }

        .left-panel {
          position: relative; z-index: 1;
          flex: 0 0 58%; height: 100%;
          display: flex; flex-direction: column;
          justify-content: space-between;
          align-items: center;
          text-align: center;
          padding: 52px 60px;
          background: rgba(0, 60, 40, 0.55);
        }
        .left-panel::before {
          content: '';
          position: absolute; bottom: 0; left: 0; right: 0; height: 40%;
          background: linear-gradient(to top, rgba(0,40,25,0.7) 0%, transparent 100%);
          pointer-events: none; z-index: 0;
        }
        .z1 { position: relative; z-index: 1; width: 100%; }

         .brand { display: flex; align-items: center; justify-content: flex-start; gap: 12px; }
        .brand-icon {
          width: 42px; height: 42px; border-radius: 50%;
          background: linear-gradient(135deg, #00a86b, #7ff3be);
          display: flex; align-items: center; justify-content: center;
          font-size: 19px; box-shadow: 0 2px 14px rgba(0,0,0,0.3);
        }
        .brand-name {
          font-size: 21px; font-weight: 800; color: #fff;
          letter-spacing: -0.5px; text-shadow: 0 1px 6px rgba(0,0,0,0.35);
        }

        .hero { max-width: 520px; margin: 0 auto; }
        .hero-title {
          font-size: 54px; font-weight: 900;
          line-height: 1.08; letter-spacing: -2px;
          color: #fff; margin-bottom: 20px;
          text-shadow: 0 2px 20px rgba(0,0,0,0.35);
        }
        .hero-accent { color: #7ff3be; font-style: italic; }
        .hero-sub {
          font-size: 16px; font-weight: 500; line-height: 1.75;
          color: rgba(255,255,255,0.82);
          text-shadow: 0 1px 6px rgba(0,0,0,0.3);
        }

        .stats {
          display: flex; align-items: flex-end;
          justify-content: center; gap: 36px;
          border-top: 1px solid rgba(255,255,255,0.22);
          padding-top: 28px;
        }
        .stat-item { display: flex; flex-direction: column; align-items: center; }
        .stat-lbl {
          font-size: 9px; font-weight: 800; text-transform: uppercase;
          letter-spacing: 2px; color: rgba(255,255,255,0.5);
          margin-bottom: 8px; text-align: center;
        }
        .stat-val { display: flex; align-items: baseline; gap: 3px; }
        .stat-num {
          font-size: 38px; font-weight: 900; color: #7ff3be; line-height: 1;
          text-shadow: 0 2px 10px rgba(0,0,0,0.25);
        }
        .stat-unit { font-size: 14px; font-weight: 600; color: rgba(127,243,190,0.6); }
        .stat-div { width: 1px; height: 46px; background: rgba(255,255,255,0.18); flex-shrink: 0; }

        .right-panel {
          position: relative; z-index: 1;
          flex: 1; height: 100%; background: #f5f7f9;
          display: flex; align-items: center; justify-content: center;
          padding: 40px 56px;
        }
        .form-wrap { width: 100%; max-width: 390px; }
        .form-title {
          font-size: 29px; font-weight: 800; color: #1a2e1f;
          letter-spacing: -0.8px; margin-bottom: 6px;
        }
        .form-sub { font-size: 14px; color: #595c5e; font-weight: 500; margin-bottom: 36px; }

        .field { margin-bottom: 18px; }
        .field-lbl {
          display: block; font-size: 11px; font-weight: 800;
          color: #595c5e; text-transform: uppercase; letter-spacing: 0.8px;
          margin-bottom: 7px; margin-left: 2px;
        }
        .inp-wrap { position: relative; }
        .inp-icon {
          position: absolute; left: 14px; top: 50%;
          transform: translateY(-50%); font-size: 15px; pointer-events: none;
        }
        .f-input, .f-select {
          width: 100%; padding: 13px 16px 13px 42px;
          background: #fff; border: 1.5px solid rgba(116,119,121,0.15);
          border-radius: 10px; font-size: 14px; font-weight: 500;
          font-family: 'Manrope', sans-serif; color: #2c2f31;
          outline: none; appearance: none;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .f-input:focus, .f-select:focus {
          border-color: #006948; box-shadow: 0 0 0 3px rgba(0,105,72,0.1);
        }
        .f-input::placeholder { color: rgba(116,119,121,0.4); }

        .err {
          background: #fff0f0; border: 1px solid rgba(185,28,28,0.2);
          color: #b91c1c; border-radius: 8px; padding: 11px 14px;
          font-size: 13px; font-weight: 600; margin-bottom: 14px;
          display: flex; align-items: center; gap: 8px;
        }
        .btn-green {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #006948 0%, #52c98a 100%);
          color: #fff; border: none; border-radius: 10px;
          font-size: 15px; font-weight: 800;
          font-family: 'Manrope', sans-serif; cursor: pointer;
          box-shadow: 0 4px 20px rgba(0,105,72,0.3);
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: transform 0.15s, opacity 0.15s; margin-bottom: 10px;
        }
        .btn-green:hover { opacity: 0.93; }
        .btn-green:active { transform: scale(0.98); }
        .btn-green:disabled { opacity: 0.65; }
        .btn-soft {
          width: 100%; padding: 14px; background: #d5e3fc; color: #324053;
          border: none; border-radius: 10px; font-size: 14px; font-weight: 700;
          font-family: 'Manrope', sans-serif; cursor: pointer;
          transition: background 0.2s;
          display: flex; align-items: center; justify-content: center;
        }
        .btn-soft:hover { background: #c3d4f7; }

        .i-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 32px; }
        .i-card { background: #eef1f3; border-radius: 10px; padding: 14px; border: 1px solid rgba(116,119,121,0.07); }
        .i-card-top { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
        .i-card-lbl { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.2px; color: #595c5e; }
        .i-card-txt { font-size: 11px; color: #747779; line-height: 1.5; }

        .glow-tr { position: fixed; top: 0; right: 0; width: 250px; height: 250px; background: rgba(127,243,190,0.12); filter: blur(90px); pointer-events: none; z-index: 2; }
        .glow-bl { position: fixed; bottom: 0; left: 0; width: 350px; height: 350px; background: rgba(0,220,254,0.06); filter: blur(120px); pointer-events: none; z-index: 2; }

        @keyframes fu { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .fu1 { animation: fu 0.45s ease both; }
        .fu2 { animation: fu 0.45s 0.08s ease both; }
        .fu3 { animation: fu 0.45s 0.16s ease both; }
        .fu4 { animation: fu 0.45s 0.24s ease both; }
      `}</style>

      <div className="login-page">
        <div className="bg-farm" />
        <div className="glow-tr" /><div className="glow-bl" />

        <section className="left-panel">
          <div className="z1 brand">
            <div className="brand-icon">🌿</div>
            <span className="brand-name">Pastoral Precision</span>
          </div>

          <div className="z1 hero">
            <h1 className="hero-title">
              Farm Produce<br />
              <span className="hero-accent">Quality &amp; Procurement</span><br />
              Management.
            </h1>
            <p className="hero-sub">
              Streamlining quality grading and procurement workflows from soil to sale.
            </p>
          </div>

          <div className="z1 stats">
            <div className="stat-item">
              <p className="stat-lbl">Quality Threshold</p>
              <div className="stat-val">
                <span className="stat-num">80</span>
                <span className="stat-unit">/100</span>
              </div>
            </div>
            <div className="stat-div" />
            <div className="stat-item">
              <p className="stat-lbl">Active Roles</p>
              <div className="stat-val">
                <span className="stat-num">4</span>
                <span className="stat-unit">Units</span>
              </div>
            </div>
            <div className="stat-div" />
            <div className="stat-item">
              <p className="stat-lbl">System Status</p>
              <div className="stat-val">
                <span className="stat-num" style={{ fontSize: 30 }}>Live</span>
              </div>
            </div>
          </div>
        </section>

        <section className="right-panel">
          <div className="form-wrap">
            <div className="fu1">
              <h2 className="form-title">Welcome Back</h2>
              <p className="form-sub">Access your precision dashboard and logs.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="field fu2">
                <label className="field-lbl">Full Name</label>
                <div className="inp-wrap">
                  <span className="inp-icon">👤</span>
                  <input className="f-input" type="text" placeholder="e.g. Ayesha"
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
              </div>

              <div className="field fu3">
                <label className="field-lbl">Role</label>
                <div className="inp-wrap">
                  <span className="inp-icon">🎭</span>
                  <select className="f-select" value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}>
                    <option value="">-- Select your role --</option>
                    {Object.values(ROLES).map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              {error && <div className="err">⚠️ {error}</div>}

              <div className="fu4">
                <button className="btn-green" type="submit" disabled={loading}>
                  {loading ? "Signing in..." : <>Sign In to Dashboard →</>}
                </button>
                <Link to="/register" style={{ textDecoration: "none" }}>
                  <div className="btn-soft">New here? Create an account</div>
                </Link>
              </div>
            </form>

            <div className="i-cards">
              <div className="i-card">
                <div className="i-card-top"><span>🔒</span><span className="i-card-lbl">Secure Unit</span></div>
                <p className="i-card-txt">Role-based access control for all farm units</p>
              </div>
              <div className="i-card">
                <div className="i-card-top"><span>🌾</span><span className="i-card-lbl">Live Grading</span></div>
                <p className="i-card-txt">Real-time produce quality inspection &amp; approval</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Login;