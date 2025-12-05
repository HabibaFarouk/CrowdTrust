import express from "express";
import mongoose from "mongoose";
import Campaign from "./Models/CampaignSchema.js";
import Donation from "./Models/DonationSchema.js";
import User from "./Models/UserSchema.js";

const app = express();

const getUserProfileWithDonations = async (userId) => {

  const user = await User.findById(userId).lean();
  if (!user) throw new Error("User not found");

  const donations = await Donation.find({ userId })
    .populate("campaignId", "title")
    .lean();

  return {
    user,
    donations: donations.map(d => ({
      amount: d.amount,
      date: d.createdAt,
      campaignTitle: d.campaignId?.title || "Unknown Campaign"
    }))
  };
};



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

app.get("/campaigns/:id",async(req,res)=>{
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    res.json(
    campaigns.map(c => ({
      title: c.title,
      amountRequested: c.amountRequested,
      amountCollected: c.amountCollected,
      progress: ((c.amountCollected / c.amountRequested) * 100).toFixed(2) + "%"
    }))
  );
});

app.post("/donations", async (req, res) => {
  try {
    await addDonation(req.body);
    return res.json({ message: "Donation added" });
  } catch (err) {
    return res.status(500).json({ error: "Donation failed" });
  }
});

app.get("/profile/:id", async (req, res) => {
  try {
    const data = await getUserProfileWithDonations(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

app.post("/signup", async (req, res) => {
    try {
        const { fullName, email, password, phone } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }
        const newUser = new User({
            fullName,
            email,
            password,
            phone
        });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.password !== password) {
            return res.status(400).json({ message: "Incorrect password" });
        }
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
});

async function main() {
  await mongoose.connect("mongodb+srv://habibamfaroukk_db_user:BoqJQLXgJzldvjB3@cluster0.26s4lb0.mongodb.net/CrowdTrust?retryWrites=true&w=majority");

    console.log("Connected to MongoDB");
    Campaign.find().then(campaigns => {
        console.log("Campaign from MongoDB:", Campaign);
    }).catch(err => {
        console.error("Error fetching Campaign:", err);
    });
    
     User.find().then(users => {
        console.log("Users from MongoDB:", users.length);
        if (users.length > 0) {
          console.log("Sample user:", users[0].fullName, "- ID:", users[0]._id);
        }
    }).catch(err => {
        console.error("Error fetching Users:", err);
    });
    
    // Debug for Donations
    Donation.find().then(donations => {
        console.log("Donations from MongoDB:", donations.length);
        if (donations.length > 0) {
          console.log("Sample donation amount:", donations[0].amount);
        }
    }).catch(err => {
        console.error("Error fetching Donations:", err);
    });
    app.listen(3000, () => {
        console.log("Server is running on http://localhost:3000");
    });
  } 

main().catch(err => console.log(err));
