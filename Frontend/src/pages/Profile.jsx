import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavMenu from "../components/NavMenu";
import { api } from "../api";

export default function Profile(){
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  useEffect(()=>{
    api.getProfile(id).then(d=>{ setData(d); setForm(d.user || {}); }).catch(()=>{});
  },[id]);

  async function save(){
    await api.updateProfile(id, form);
    const d = await api.getProfile(id);
    setData(d);
    setEditing(false);
  }

  async function remove(){
    await api.deleteProfile(id);
    localStorage.removeItem("crowd_user");
    navigate("/");
  }

  if(!data) return <div><NavMenu/>Loading profile...</div>;

  return (
    <div style={{ padding: 16 }}>
      <NavMenu />
      <h1>Profile</h1>
      {!editing ? (
        <div>
          <p><strong>Name:</strong> {data.user.fullName}</p>
          <p><strong>Email:</strong> {data.user.email}</p>
          <p><strong>Phone:</strong> {data.user.phone}</p>
          <h3>Donations</h3>
          {data.donations && data.donations.length>0 ? (
            <ul>{data.donations.map((d,i)=>(<li key={i}>{d.amount} — {new Date(d.date).toLocaleString()} — {d.campaignTitle}</li>))}</ul>
          ) : <p>No donations yet.</p>}
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" onClick={()=>setEditing(true)}>Edit</button>
            <button className="btn" onClick={remove}>Delete account</button>
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 8, maxWidth: 420 }}>
          <input value={form.fullName || ""} onChange={e=>setForm({...form, fullName: e.target.value})} />
          <input value={form.email || ""} onChange={e=>setForm({...form, email: e.target.value})} />
          <input value={form.phone || ""} onChange={e=>setForm({...form, phone: e.target.value})} />
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" onClick={save}>Save</button>
            <button className="btn ghost" onClick={()=>setEditing(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
