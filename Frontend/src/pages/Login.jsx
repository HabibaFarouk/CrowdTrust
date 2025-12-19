import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavMenu from "../components/NavMenu";
import { api } from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.login({ email, password });
      if (res && res.user) {
        localStorage.setItem("crowd_user", JSON.stringify(res.user));
        navigate(`/profile/${res.user.id}`);
      } else {
        setError(res.message || "Login failed");
      }
    } catch (err) {
      setError(err.message || "Login error");
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <NavMenu />
      <h1>Login</h1>
      <form onSubmit={submit} style={{ display: "grid", gap: 8, maxWidth: 380 }}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn" type="submit">Login</button>
        {error && <div style={{ color: "#ff8080" }}>{error}</div>}
      </form>
    </div>
  );
}
