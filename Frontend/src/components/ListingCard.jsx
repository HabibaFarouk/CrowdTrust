import React, { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function ListingCard({ campaign, id }) {
  const [donations, setDonations] = useState(null);
  const [showDonations, setShowDonations] = useState(false);
  const [loadingDonations, setLoadingDonations] = useState(false);
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
        {showDonations && (
          <div style={{ marginTop: 12 }}>
            <h4 style={{ margin: '8px 0' }}>Donations</h4>
            {loadingDonations ? (
              <div>Loading donations...</div>
            ) : donations && donations.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                {donations.map((d, i) => (
                  <li key={i} style={{ marginBottom: 6 }}>{d.amount} — {new Date(d.date).toLocaleString()}</li>
                ))}
              </ul>
            ) : (
              <div>No donations yet.</div>
            )}
          </div>
        )}
      </div>
      <div className="card-actions">
        <Link to={`/donate/${id}`}><button className="btn">Donate</button></Link>
        <Link to={`/campaign/${id}`}><button className="btn ghost">View</button></Link>
        <button
          className="btn ghost"
          onClick={async () => {
            setLoadingDonations(true);
            try {
              const data = await api.getDonations(id);
              setDonations(Array.isArray(data) ? data : (data?.donations || []));
              setShowDonations(true);
            } catch (err) {
              alert('Failed to fetch donations: ' + (err?.message || err));
            } finally {
              setLoadingDonations(false);
            }
          }}
        >
          Donations
        </button>
        <button
          className="btn ghost"
          onClick={async () => {
            const newTitle = prompt('New title', campaign.title);
            if (!newTitle) return;
            try {
              await api.updateCampaign(id, { title: newTitle });
              alert('Campaign updated');
              window.location.reload();
            } catch (err) {
              alert('Update failed: ' + (err?.message || err));
            }
          }}
        >
          Edit
        </button>
        <button
          className="btn"
          style={{ background: '#c0392b' }}
          onClick={async () => {
            if (!confirm('Delete this campaign?')) return;
            try {
              await api.deleteCampaign(id);
              alert('Campaign deleted');
              window.location.reload();
            } catch (err) {
              alert('Delete failed: ' + (err?.message || err));
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
