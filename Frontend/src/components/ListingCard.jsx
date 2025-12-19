import React from "react";
import { Link } from "react-router-dom";

export default function ListingCard({ campaign, id }) {
  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title">{campaign.title}</h3>
        <p className="card-desc">{campaign.description?.slice(0, 160)}{campaign.description && campaign.description.length>160?"...":""}</p>
        <p className="muted"><strong>Category:</strong> {campaign.category || "n/a"}</p>
        <p className="muted"><strong>Requested:</strong> {campaign.amountRequested} — <strong>Collected:</strong> {campaign.amountCollected}</p>
        <p className="muted"><strong>Progress:</strong> {campaign.progress}</p>
      </div>
      <div className="card-actions">
        <Link to={`/donate/${id}`}><button className="btn">Donate</button></Link>
        <Link to={`/campaign/${id}`}><button className="btn ghost">View</button></Link>
      </div>
    </div>
  );
}
