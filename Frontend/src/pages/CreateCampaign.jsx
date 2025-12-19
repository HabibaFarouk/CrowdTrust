import React, { useState } from "react";
import NavMenu from "../components/NavMenu";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

export default function CreateCampaign(){
  const user = JSON.parse(localStorage.getItem("crowd_user")||"null");
  const navigate = useNavigate();
  const [title,setTitle]=useState("");
  const [description,setDescription]=useState("");
  const [amount,setAmount]=useState(0);
  const [category,setCategory]=useState("Other");

  async function submit(e){
    e.preventDefault();
    if(!user) return navigate('/login');
    await api.createCampaign(user.id, { title, description, amountRequested: amount, category });
    navigate('/');
  }

  return (
    <div style={{ padding: 16 }}>
      <NavMenu />
      <h1>Create Campaign</h1>
      <form style={{ display: 'grid', gap: 8, maxWidth: 600 }} onSubmit={submit}>
        <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
        <input placeholder="Amount requested" type="number" value={amount} onChange={e=>setAmount(e.target.value)} />
        <select value={category} onChange={e=>setCategory(e.target.value)}>
          <option>Medical</option>
          <option>Education</option>
          <option>Community</option>
          <option>Emergency</option>
          <option>Other</option>
        </select>
        <button className="btn" type="submit">Create</button>
      </form>
    </div>
  );
}
