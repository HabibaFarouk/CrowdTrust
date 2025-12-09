import express from "express";
import mongoose from "mongoose";
import Campaign from "./Models/CampaignSchema.js";
import Donation from "./Models/DonationSchema.js";
import User from "./Models/UserSchema.js";

const app = express();

// parse JSON and HTML form submissions early so all routes have access to `req.body`
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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


  // Update campaign (simple, server-side). Fields allowed: title, description, amountRequested, category, status
  app.put('/campaigns/:id', async (req, res) => {
    try {
      const campaignId = req.params.id;

      // Validate campaign id format early
      if (!mongoose.isValidObjectId(campaignId)) return res.status(400).json({ error: 'Invalid campaign id format' });

      const { title, description, amountRequested, category} = req.body;

      const update = {};
      if (typeof title !== 'undefined' && title !== null) update.title = String(title);
      if (typeof description !== 'undefined' && description !== null) update.description = String(description);
      if (typeof amountRequested !== 'undefined') {
        const amountNum = Number(amountRequested);
        if (Number.isNaN(amountNum) || amountNum <= 0) return res.status(400).json({ error: 'amountRequested must be a positive number' });
        update.amountRequested = amountNum;
      }
      if (typeof category !== 'undefined' && category !== null) {
        const allowed = ["Medical", "Education", "Community", "Emergency", "Other"];
        update.category = allowed.includes(category) ? category : 'Other';
      }
      
      

      // Prevent empty updates
      if (Object.keys(update).length === 0) return res.status(400).json({ error: 'No valid fields provided for update' });

      const updated = await Campaign.findByIdAndUpdate(campaignId, update, { new: true, runValidators: true });
      if (!updated) return res.status(404).json({ error: 'Campaign not found' });

      return res.json({ message: 'Campaign updated', campaign: updated });
    } catch (err) {
      console.error('Failed to update campaign:', err);
      if (err && err.name === 'ValidationError') {
        const details = Object.keys(err.errors || {}).reduce((acc, key) => { acc[key] = err.errors[key].message; return acc; }, {});
        return res.status(400).json({ error: 'Validation failed', details });
      }
      if (err && err.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid id or data format' });
      }
      return res.status(500).json({ error: 'Failed to update campaign', details: err.message });
    }
  });


  // Delete campaign
  app.delete('/campaigns/:id', async (req, res) => {
    try {
      const campaignId = req.params.id;
      const deleted = await Campaign.findByIdAndDelete(campaignId);
  
      return res.json({ message: 'Campaign deleted' });
    } catch (err) {
      console.error('Failed to delete campaign:', err);
      return res.status(500).json({ error: 'Failed to delete campaign' });
    }
  });

  //Donation CRUD operations
const addDonation = async (donationData) => {
    const donation = await Donation.create(donationData);
    const { campaignId, amount } = donation;
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      campaignId,
      { $inc: { amountCollected: amount } },
      { new: true }
      );
};


app.get("/", (req, res) => {
    res.send("CrowdTrust is running");
});


 //Campign CRUD operations 
 
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


// Create campaign using user id from URL param (user must be signed-in)
app.post('/campaigns/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { title, description, amountRequested, category } = req.body;

    // Required fields
    if (!title || !description || !amountRequested) {
      return res.status(400).json({ error: 'Missing required fields: title, description, amountRequested' });
    }

    // Validate numeric amount
    const amountNum = Number(amountRequested);
    if (Number.isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({ error: 'amountRequested must be a positive number' });
    }

    // Validate userId format first
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: 'Invalid user id format' });
    }

    // Validate user exists (server should set user id from auth in production)
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: 'User not found' });

    // Normalize/validate category against allowed values to avoid Mongoose enum errors
    const allowedCategories = ["Medical", "Education", "Community", "Emergency", "Other"];
    const safeCategory = (typeof category === 'string' && allowedCategories.includes(category)) ? category : 'Other';

    const campaign = await Campaign.create({
      title: String(title),
      description: String(description),
      amountRequested: amountNum,
      category: safeCategory,
      userId
    });

    

    return res.status(201).json({ message: 'Campaign created', campaign });
  } catch (err) {
    console.error('Failed to create campaign (by param):', err);
    // Return validation error details in development to help debugging
    if (err && err.name === 'ValidationError') {
      const details = Object.keys(err.errors || {}).reduce((acc, key) => {
        acc[key] = err.errors[key].message;
        return acc;
      }, {});
      return res.status(400).json({ error: 'Validation failed', details });
    }
    return res.status(500).json({ error: 'Failed to create campaign' });
  }
});






//Donation CRUD operations
app.get("/donations",async(req,res)=>{
     try {
    const donations = await Donation.find()
      .populate("userId", "fullName email")
      .populate("campaignId", "title")
      .lean();
    res.json(
      donations.map(d => ({
        user: d.userId?.fullName || "Unknown User",
        campaign: d.campaignId?.title || "Unknown Campaign",
        amount: d.amount,
        date: d.date
      }))
    );
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch donations" });
  }
});

app.post("/donations", async (req, res) => {
  try {
    await addDonation(req.body);
    return res.json({ message: "Donation added" });
  } catch (err) {
    return res.status(500).json({ error: "Donation failed" });
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
