import express from "express";
import mongoose from "mongoose";
import Campaign from "./Models/CampaignSchema.js";
import Donation from "./Models/DonationSchema.js";
import User from "./Models/UserSchema.js";

const app = express();
//Helper Function 
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
  try {
    const { campaignId, amount } = donationData;
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      throw new Error("Campaign not found");
    }
    const remainingAmount = campaign.amountRequested - campaign.amountCollected;
    if (amount > remainingAmount) {
      throw new Error(
        `Donation exceeds the required amount. Remaining needed: ${remainingAmount}`
      );
    }
    const donation = await Donation.create(donationData);
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      campaignId,
      {
        $inc: { amountCollected: amount },
        ...(amount === remainingAmount && { status: "Completed" })
      },
      { new: true }
    );
    return {
      message: "Donation added successfully",
      donation,
      updatedCampaign
    };
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};



app.use(express.json());

app.get("/", (req, res) => {
    res.send("CrowdTrust is running");
});


 //Campign CRUD operations 
app.get("/campaigns", async (req, res) => {
  try {
    const campaigns = await Campaign.find({ status: "approved" });

    res.json(
      campaigns.map(c => ({
        title: c.title,
        description: c.description,
        category: c.category,
        amountRequested: c.amountRequested,
        amountCollected: c.amountCollected,
        progress: ((c.amountCollected / c.amountRequested) * 100).toFixed(2) + "%"
      }))
    );

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch campaigns" });
  }
});


app.get("/campaigns/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    const response = {
      title: campaign.title,
      amountRequested: campaign.amountRequested,
      amountCollected: campaign.amountCollected,
      progress:
        ((campaign.amountCollected / campaign.amountRequested) * 100).toFixed(2) + "%"
    };

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


//Donation CRUD operations
app.get("/donations/:campaignId", async (req, res) => {
  try {
    const { campaignId } = req.params;
    const donations = await Donation.find({ campaignId });
    if (!donations || donations.length === 0) {
      return res.status(404).json({ error: "No donations found for this campaign" });
    }
    res.json(
      donations.map(d => ({
        amount: d.amount,
        date: d.date
      }))
    );
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch donations" });
  }
});



app.post("/donations/:userId", async (req, res) => {
  try {
    const { campaignId, amount } = req.body;

    if (!campaignId || !amount) {
      return res.status(400).json({ error: "campaignId and amount are required" });
    }
    const { userId } = req.params;
    const result = await addDonation({ userId, campaignId, amount });
    res.json({
      message: "Donation added",
      donation: result.donation,
      updatedCampaign: result.updatedCampaign
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



//User CRUD operations 
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
app.put("/profile/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true } 
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/profile/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




 //MongoDB connect and Connection validation
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
