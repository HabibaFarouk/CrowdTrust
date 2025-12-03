import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign", required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const Donation = mongoose.model("Donation", DonationSchema);

export default Donation;