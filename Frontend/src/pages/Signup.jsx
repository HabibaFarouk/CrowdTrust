import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavMenu from "../components/NavMenu";
import { api } from "../api";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.signup({ fullName, email, password, phone });
      if (res && res.message) {
        navigate("/login");
      } else {
        setError(res.message || "Signup failed");
      }
    } catch (err) {
      setError(err.message || "Signup error");
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <NavMenu />
      <h1>Sign Up</h1>
      <form onSubmit={submit} style={{ display: "grid", gap: 8, maxWidth: 420 }}>
        <input placeholder="Full name" value={fullName} onChange={e=>setFullName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <input placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} />
        <button className="btn" type="submit">Create account</button>
        {error && <div style={{ color: "#ff8080" }}>{error}</div>}
      </form>
    </div>
  );
}
