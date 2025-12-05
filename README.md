# CrowdTrust
Secure community crowdfunding Web application Project
-----

**Course:** Electronic Business Development (BINF 503)  
**Semester:** Winter 2025  
**Instructor:** Dr. Nourhan Hamdi  
**Teaching Assistants:** Mr. Nour Gaser, Mr. Omar Alaa

---

## 1. Team Members


| Name | Student ID | GitHub Username |
| :--- | :--- | :--- |
| Habiba Farouk | 13007597 | HabibaFarouk |
| Jamila Riad | 13007552 | jamila-riad |
| Andrew Nabil | 13007493 |AndrewNK1 |
| Matthew Ghaly | 13005022 | matthewghaly |


---

## 2. Project Description
* **Concept:**
CrowdTrust is a secure community crowdfunding mobile/web application that enables users to create verified fundraising campaigns for personal, medical, educational, or community needs. The app differentiates itself by introducing Digital ID verification, fraud detection, and transparent campaign tracking, ensuring donors feel safe and confident when contributing.

Crowdfunding platforms often face issues of fraud, low trust, and lack of transparency. Many donors hesitate to contribute because they cannot verify whether a campaign is legitimate.
     
---

## 3. Feature Breakdown

### 3.1 Full Scope
*List ALL potential features/user stories envisioned for the complete product (beyond just this course).*
* User Authentication
* Request FormUser Authentication (email, phone, OAuth)
* Digital ID Verification
* Campaign Creation & Submission Workflow
* AI Fraud Scanning
* Donation Payments (wallets, cards, Fawry, etc.)
* Campaign Progress Tracking
* Impact Stories, Updates, and Media Uploads
* Donor Rewards / Badges
* Admin Review Panel
* Notifications & Real-Time Updates
* User Profiles & Donation History
* Search, Filters, and Category Browsing
* Wallet / Transactions Module
* Comment and Support System


### 3.2 Selected MVP Use Cases (Course Scope)

1.  **User Authentication** (Registration/Login)
2.  **User Profiles & Donation History**
3.  **Campaign Creation & Submission Workflow**
4.  **Impact Stories, Updates, and Media Uploads**
5.  **Campaign Progress Tracking**



---

## 4. Feature Assignments (Accountability)
*Assign one distinct use case from Section 3.2 to each team member. This member is responsible for the full-stack implementation of this feature.*

| Team Member | Assigned Use Case | Brief Description of Responsibility |
| :--- | :--- | :--- |
| Jamila Riad | **User Authentication** | Register, Login |
| Matthew Ghaly | **User Profiles & Donation History** | Display profile detials and a complete history of all donations|
| Andrew Nabil | **Campaign Creation & Submission Workflow** | Enables users to create fundraising campaigns for review |
| Habiba Farouk | **Campaign Progress Overview** | Displays each campaign’s title, requested amount, collected amount.|
| Habiba Farouk | **Campaign Progress Tracking** | Provides real-time visibility into campaign performance |

---

## 5. Data Model (Initial Schemas)
*Define the initial Mongoose Schemas for your application’s main data models (User, Transaction, Account, etc.). You may use code blocks or pseudo-code.*

### User Schema
```javascript
const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: { type: Date, default: Date.now }
});
```

### Campaign Schema
```javascript
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

```

### Donation Schema
```javascript
const DonationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign", required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});
```
