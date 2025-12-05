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


// Create model AFTER defining virtual
const Campaign = mongoose.model("Campaign", CampaignSchema);

export default Campaign;


test