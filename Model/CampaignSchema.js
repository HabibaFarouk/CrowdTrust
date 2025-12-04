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

const Campaign = mongoose.model("Campaign", CampaignSchema);
CampaignSchema.virtual("progress").get(function () {
  return ((this.amountCollected / this.amountRequested) * 100).toFixed(2); // e.g., "57.35"
});

 Campaign.find()
      .then(campaigns => {
        campaigns.forEach(c => {
          const progress = ((c.amountCollected / c.amountRequested) * 100).toFixed(2);
          console.log(`Campaign: ${c.title}`);
          console.log(`Collected: ${c.amountCollected} / ${c.amountRequested} (${progress}%)`);
        });
      })
      .catch(err => console.error("Error fetching campaigns:", err));

export default Campaign;