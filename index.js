import express from "express";
import mongoose from "mongoose";
import Campaign from "./models/CampaignSchema.js";
import Donation from "./models/DonationSchema.js";

const app = express();
const addDonation = async (Donation) => {
    await DonationSchema.insertOne(Donation);
};

app.use(express.json());

app.get("/api/campaigns/",async(req,res)=>{
    const Campaigns = await Campaign.find();
    res.json(Campaigns);
});

app.post("/api/campaigns/",async(req,res)=>{
    const newDonation = req.body;
    await addDonation(newDonation);
    res.json({ message: "Donation added" });
    
});


async function main() {
    // Connect to MongoDB
    await mongoose.connect("mongodb+srv://habibamfaroukk_db_user:BoqJQLXgJzldvjB3@cluster0.26s4lb0.mongodb.net/?appName=Cluster0")
    console.log("Connected to MongoDB");


    // Once database connection is ready, start listening for requests
    app.listen(3000, () => {
        console.log("Server is running on http://localhost:3000");
    });
}

main().catch(err => console.log(err));