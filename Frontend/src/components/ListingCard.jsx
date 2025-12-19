import React from "react";
import { Link } from "react-router-dom";

export default function ListingCard({ campaign, id }) {
  const requested = Number(campaign.amountRequested || 0);
  const collected = Number(campaign.amountCollected || 0);
  const percent = requested > 0 ? Math.min(100, Math.round((collected / requested) * 10000) / 100) : 0;

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title">{campaign.title}</h3>
        <p className="card-desc">{campaign.description?.slice(0, 160)}{campaign.description && campaign.description.length>160?"...":""}</p>
        <p className="muted"><strong>Category:</strong> {campaign.category || "n/a"}</p>
        <p className="muted"><strong>Requested:</strong> {campaign.amountRequested} — <strong>Collected:</strong> {campaign.amountCollected}</p>
        <div className="progress-wrap" aria-hidden="true">
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
        <p className="muted" style={{ marginTop: 6 }}><strong>Progress:</strong> {percent}%</p>
      </div>
      <div className="card-actions">
        <Link to={`/donate/${id}`}><button className="btn">Donate</button></Link>
        <Link to={`/campaign/${id}`}><button className="btn ghost">View</button></Link>
      </div>
    </div>
  );
}
