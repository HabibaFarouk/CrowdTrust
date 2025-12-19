import mongoose from "mongoose";
import Campaign from "./Models/CampaignSchema.js";

const MONGO = "mongodb+srv://habibamfaroukk_db_user:BoqJQLXgJzldvjB3@cluster0.26s4lb0.mongodb.net/CrowdTrust?retryWrites=true&w=majority";

async function main(){
  try{
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected. Fetching campaign count...');
    const count = await Campaign.countDocuments();
    console.log('Campaign documents count:', count);
    const sample = await Campaign.find().limit(5).lean();
    console.log('Sample documents (up to 5):', sample);
    await mongoose.disconnect();
    console.log('Disconnected.');
  }catch(err){
    console.error('DB test failed:', err.message || err);
    process.exit(1);
  }
}

main();
