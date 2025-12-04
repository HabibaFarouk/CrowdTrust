import express from "express";
import mongoose from "mongoose";
import Campaign from "./Models/CampaignSchema.js";
import Donation from "./Models/DonationSchema.js";
import User from "./Models/UserSchema.js";

const app = express();

const addDonation = async (donationData) => {
    const donation = await Donation.create(donationData);
    const { campaignId, amount } = donation;
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      campaignId,
      { $inc: { amountCollected: amount } },
      { new: true }
      );
};


app.use(express.json());

app.get("/", (req, res) => {
    res.send("CrowdTrust is running");
});

app.get("/campaigns",async(req,res)=>{
    const campaigns = await Campaign.find();
    res.json(
    campaigns.map(c => ({
      title: c.title,
      amountRequested: c.amountRequested,
      amountCollected: c.amountCollected,
      progress: ((c.amountCollected / c.amountRequested) * 100).toFixed(2) + "%"
    }))
  );
});

app.post("/donations",async(req,res)=>{
    const newDonation = req.body;
    await addDonation(newDonation).catch(error => res.status(500).json({ error: "Donation failed" }));
    res.json({ message: "Donation added" });
    
});



// Connect to MongoDB
  async function main() {
  await mongoose.connect("mongodb+srv://habibamfaroukk_db_user:BoqJQLXgJzldvjB3@cluster0.26s4lb0.mongodb.net/CrowdTrust?retryWrites=true&w=majority");

    console.log("Connected to MongoDB");
    Campaign.find().then(campaigns => {
        console.log("Campaign from MongoDB:", Campaign);
    }).catch(err => {
        console.error("Error fetching Campaign:", err);
    });
    
    app.listen(3000, () => {
        console.log("Server is running on http://localhost:3000");
    });
  } 

main().catch(err => console.log(err));