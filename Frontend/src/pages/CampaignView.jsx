import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import NavMenu from "../components/NavMenu";
import { api } from "../api";

export default function CampaignView(){
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);

  useEffect(()=>{
    api.getCampaign(id).then(setCampaign).catch(()=>{});
  },[id]);

  if(!campaign) return <div><NavMenu/>Loading...</div>;

  return (
    <div style={{ padding:16 }}>
      <NavMenu />
      <h1>{campaign.title}</h1>
      <p>{campaign.description}</p>
      <p><strong>Requested:</strong> {campaign.amountRequested}</p>
      <p><strong>Collected:</strong> {campaign.amountCollected}</p>
      <p><strong>Progress:</strong> {campaign.progress}</p>
      <Link to={`/donate/${id}`}><button className="btn">Donate</button></Link>
    </div>
  );
}
