import express from "express";
import mongoose from "mongoose";
import Campaign from "./Models/CampaignSchema.js";
import Donation from "./Models/DonationSchema.js";

const app = express();

const addDonation = async (DonationData) => {
    const donation = await Donation.create(DonationData);
    const { campaignId, amount } = donation;
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      campaignId,
      { $inc: { amountCollected: amount } },
      { new: true }
    );
};


app.use(express.json());

app.get("/api/campaigns/",async(req,res)=>{
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

app.post("/api/campaigns/",async(req,res)=>{
    const newDonation = req.body;
    await addDonation(newDonation);
    res.json({ message: "Donation added" });
    
});


async function main() {
    // Connect to MongoDB
    await mongoose.connect("mongodb+srv://habibamfaroukk_db_user:BoqJQLXgJzldvjB3@cluster0.26s4lb0.mongodb.net/CrowdTrust?retryWrites=true&w=majority")
    console.log("Connected to MongoDB");


    // Once database connection is ready, start listening for requests
    app.listen(3000, () => {
        console.log("Server is running on http://localhost:3000");
    });
}

main().catch(err => console.log(err));