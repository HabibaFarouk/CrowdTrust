import React, { useEffect, useState } from "react";
import NavMenu from "../components/NavMenu";
import ListingCard from "../components/ListingCard";
import { api } from "../api";

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCampaigns().then(data => {
      setCampaigns(data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div><NavMenu />Loading campaigns...</div>;

  return (
    <div className="container">
      <NavMenu />
      <h1>Campaigns</h1>
      {(!campaigns || campaigns.length === 0) ? <p>No campaigns yet.</p> : (
        campaigns.map((c) => (
          <ListingCard key={c._id} campaign={c} id={c._id} />
        ))
      )}
    </div>
  );
}
