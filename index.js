import express from "express";
import Listing from "./models/Listing.js";
import mongoose from "mongoose";
import Campaign from "./models/CampaignSchema.js";

const app = express();

app.use(express.json());

app.get("/api/campaigns",async(req,res)=>{
    const Campaigns = await Campaign.find();
    
    res.json(Campaigns);
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