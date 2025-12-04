import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  amountRequested: { type: Number, required: true },
  amountCollected: { type: Number, default: 0 },
  category: { type: String, enum: ["Medical", "Education", "Community", "Emergency", "Other"] },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

// Virtual for progress
CampaignSchema.virtual("progress").get(function () {
  return ((this.amountCollected / this.amountRequested) * 100).toFixed(2); // e.g., "57.35"
});

// Create model AFTER defining virtual
const Campaign = mongoose.model("Campaign", CampaignSchema);

export default Campaign;

// Fetch campaigns and log with progress
Campaign.find()
  .then(campaigns => {
    campaigns.forEach(c => {
      console.log(`Campaign: ${c.title}`);
      console.log(`Collected: ${c.amountCollected} / ${c.amountRequested} (${c.progress}%)`);
    });
  })
  .catch(err => console.error("Error fetching campaigns:", err));
