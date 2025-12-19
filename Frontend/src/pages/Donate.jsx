import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavMenu from "../components/NavMenu";
import { api } from "../api";

export default function Donate(){
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [amount, setAmount] = useState(0);
  const navigate = useNavigate();

  useEffect(()=>{
    api.getCampaign(id).then(setCampaign).catch(()=>{});
  },[id]);

  async function submit(e){
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('crowd_user')||'null');
    if(!user) return navigate('/login');
    await api.postDonation(user.id, { campaignId: id, amount });
    navigate(`/profile/${user.id}`);
  }

  if(!campaign) return <div><NavMenu/>Loading campaign...</div>;

  return (
    <div style={{ padding: 16 }}>
      <NavMenu />
      <h1>Donate to {campaign.title}</h1>
      <p>Requested: {campaign.amountRequested} — Collected: {campaign.amountCollected}</p>
      <form onSubmit={submit} style={{ display:'grid', gap:8, maxWidth:320 }}>
        <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount" />
        <button type="submit">Donate</button>
      </form>
    </div>
  );
}
