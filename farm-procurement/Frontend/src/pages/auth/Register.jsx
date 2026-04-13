import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../utils/roles";

const Register = () => {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", role: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.role) { setError("All fields are required."); return; }
    setLoading(true);
    setError("");
    try {
      await register(form);
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const roleInfo = [
    { icon: "agriculture", role: "FARMER", desc: "Submit & track your harvest" },
    { icon: "search", role: "INSPECTOR", desc: "Grade produce quality" },
    { icon: "inventory_2", role: "PROCUREMENT", desc: "Create purchase orders" },
    { icon: "admin_panel_settings", role: "ADMIN", desc: "Manage users & reports" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined';
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          font-size: 20px;
          line-height: 1;
          display: inline-block;
          vertical-align: middle;
        }

        .reg-page {
          min-height: 100vh;
          display: flex;
          font-family: 'Manrope', sans-serif;
          background: #f5f7f9;
          overflow: hidden;
        }

        .reg-left {
          flex: 0 0 58%;
          background: #006575;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 56px 64px;
        }
        .reg-left-img {
          position: absolute;
          inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          opacity: 0.25;
          mix-blend-mode: overlay;
        }
        .reg-left-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top right, #006575 0%, rgba(0,80,95,0.4) 60%, transparent 100%);
        }
        .reg-left-content { position: relative; z-index: 1; }

        .reg-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .reg-brand-icon {
          width: 42px; height: 42px;
          border-radius: 50%;
          background: linear-gradient(135deg, #006575, #00dcfe);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }
        .reg-brand-name {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.5px;
          color: #f5f7f9;
        }

        .reg-hero {
          font-size: 54px;
          font-weight: 800;
          letter-spacing: -2px;
          line-height: 1.08;
          color: #f5f7f9;
          margin-bottom: 20px;
        }
        .reg-hero .accent { color: #00dcfe; font-style: italic; }
        .reg-sub {
          font-size: 16px;
          color: rgba(0,220,254,0.7);
          font-weight: 500;
          line-height: 1.7;
          max-width: 360px;
          margin-bottom: 40px;
        }

        .role-cards {
          display: flex;
          flex-direction: column;
          gap: 10px;
          position: relative;
          z-index: 1;
        }
        .role-card {
          display: flex;
          align-items: center;
          gap: 14px;
          background: rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 14px 18px;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .role-card-icon {
          width: 36px; height: 36px;
          border-radius: 8px;
          background: rgba(0,220,254,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #00dcfe;
        }
        .role-card-name {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: #f5f7f9;
        }
        .role-card-desc {
          font-size: 12px;
          color: rgba(0,220,254,0.6);
          margin-top: 2px;
        }

        .blob1 {
          position: fixed; top: 0; right: 0;
          width: 280px; height: 280px;
          background: rgba(0,220,254,0.1);
          filter: blur(100px);
          pointer-events: none; z-index: 0;
        }
        .blob2 {
          position: fixed; bottom: 0; left: 0;
          width: 380px; height: 380px;
          background: rgba(0,105,72,0.08);
          filter: blur(130px);
          pointer-events: none; z-index: 0;
        }

        .reg-right {
          flex: 1;
          background: #f5f7f9;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 64px;
          position: relative;
          z-index: 1;
        }
        .reg-form-wrap { width: 100%; max-width: 400px; }

        .reg-form-header { margin-bottom: 40px; }
        .reg-form-title {
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -0.8px;
          color: #2c2f31;
          margin-bottom: 6px;
        }
        .reg-form-sub {
          font-size: 14px;
          font-weight: 500;
          color: #595c5e;
        }

        .reg-field { margin-bottom: 20px; }
        .reg-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #595c5e;
          margin-bottom: 8px;
          margin-left: 2px;
        }
        .reg-input-wrap { position: relative; }
        .reg-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #abadaf;
          pointer-events: none;
        }
        .reg-input, .reg-select {
          width: 100%;
          padding: 15px 16px 15px 44px;
          background: #ffffff;
          border: none;
          border-radius: 12px;
          box-shadow: 0 0 0 1px rgba(116,119,121,0.12);
          font-size: 14px;
          font-weight: 500;
          font-family: 'Manrope', sans-serif;
          color: #2c2f31;
          outline: none;
          transition: box-shadow 0.2s;
          appearance: none;
        }
        .reg-input:focus, .reg-select:focus {
          box-shadow: 0 0 0 2px #006575;
        }
        .reg-input::placeholder { color: rgba(116,119,121,0.5); }

        .reg-error {
          background: #fff0f0;
          border: 1px solid rgba(179,27,37,0.2);
          color: #b31b25;
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .reg-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #006575 0%, #00dcfe 100%);
          color: #00333d;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          font-family: 'Manrope', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 8px 24px rgba(0,101,117,0.2);
          transition: transform 0.15s, opacity 0.15s;
        }
        .reg-btn:hover { transform: scale(0.99); }
        .reg-btn:active { transform: scale(0.97); }
        .reg-btn:disabled { opacity: 0.65; }

        .reg-footer {
          margin-top: 40px;
          text-align: center;
          font-size: 14px;
          color: #595c5e;
          font-weight: 500;
        }
        .reg-footer a {
          color: #006575;
          font-weight: 800;
          text-decoration: none;
          margin-left: 4px;
        }
        .reg-footer a:hover { text-decoration: underline; text-underline-offset: 3px; }
      `}</style>

      <div className="reg-page">
        <div className="blob1" /><div className="blob2" />

        {/* LEFT */}
        <section className="reg-left">
          <img className="reg-left-img"
            src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&q=80"
            alt="Farm fields" />
          <div className="reg-left-overlay" />

          <div className="reg-left-content reg-brand">
            <div className="reg-brand-icon">🌱</div>
            <span className="reg-brand-name">Digital Agronomist</span>
          </div>

          <div className="reg-left-content" style={{ marginTop: "auto", marginBottom: "32px" }}>
            <h1 className="reg-hero">
              Join the <span className="accent">Network</span><br />Today.
            </h1>
            <p className="reg-sub">
              Register your role and start managing agricultural quality,
              procurement, and grading from a single platform.
            </p>

            <div className="role-cards">
              {roleInfo.map((r) => (
                <div className="role-card" key={r.role}>
                  <div className="role-card-icon">
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{r.icon}</span>
                  </div>
                  <div>
                    <div className="role-card-name">{r.role}</div>
                    <div className="role-card-desc">{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RIGHT */}
        <section className="reg-right">
          <div className="reg-form-wrap">
            <div className="reg-form-header">
              <h2 className="reg-form-title">Create Account</h2>
              <p className="reg-form-sub">Fill in your details to request access.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="reg-field">
                <label className="reg-label">Full Name</label>
                <div className="reg-input-wrap">
                  <span className="material-symbols-outlined reg-input-icon">person</span>
                  <input className="reg-input" type="text" placeholder="e.g. Ayesha"
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
              </div>

              <div className="reg-field">
                <label className="reg-label">Email Address</label>
                <div className="reg-input-wrap">
                  <span className="material-symbols-outlined reg-input-icon">alternate_email</span>
                  <input className="reg-input" type="email" placeholder="e.g. ayesh@gmail.com"
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>

              <div className="reg-field">
                <label className="reg-label">Role</label>
                <div className="reg-input-wrap">
                  <span className="material-symbols-outlined reg-input-icon">badge</span>
                  <select className="reg-select" value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}>
                    <option value="">-- Select your role --</option>
                    {Object.values(ROLES).map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              {error && (
                <div className="reg-error">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>error</span>
                  {error}
                </div>
              )}

              <div style={{ paddingTop: "8px" }}>
                <button className="reg-btn" type="submit" disabled={loading}>
                  {loading ? "Creating account..." : "Create Account"}
                  {!loading && <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>}
                </button>
              </div>
            </form>

            <div className="reg-footer">
              Already have an account?
              <Link to="/login">Sign In</Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Register;