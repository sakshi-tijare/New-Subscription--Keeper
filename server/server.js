const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const Subscription = require("./models/Subscription");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");
    
    // Seed initial data if DB is empty
    const count = await Subscription.countDocuments();
    if (count === 0) {
      console.log("Seeding initial subscriptions...");
      const today = new Date();
      const d = (offset) => {
        const date = new Date(today);
        date.setDate(date.getDate() + offset);
        return date.toISOString().split("T")[0];
      };
      
      const sampleSubscriptions = [
        {
          name: "example.com",
          category: "Domain Name",
          url: "https://namecheap.com",
          username: "admin@example.com",
          password: "",
          otpRequired: true,
          notes: "Primary business domain",
          activationDate: d(-330),
          expiryDate: d(35),
          price: 12.99,
          currency: "USD"
        },
        {
          name: "AWS EC2 Production",
          category: "Server",
          url: "https://aws.amazon.com",
          username: "ops@company.com",
          password: "",
          otpRequired: true,
          notes: "t3.large instance - US East",
          activationDate: d(-60),
          expiryDate: d(305),
          price: 89.0,
          currency: "USD"
        },
        {
          name: "Google Workspace Business",
          category: "Google Workspace",
          url: "https://workspace.google.com",
          username: "admin@company.com",
          password: "",
          otpRequired: true,
          notes: "25 user seats",
          activationDate: d(-300),
          expiryDate: d(10),
          price: 300.0,
          currency: "USD"
        },
        {
          name: "Figma Team",
          category: "Software",
          url: "https://figma.com",
          username: "design@company.com",
          password: "",
          otpRequired: false,
          notes: "Design team license",
          activationDate: d(-180),
          expiryDate: d(-5),
          price: 45.0,
          currency: "USD"
        },
        {
          name: "Vercel Pro",
          category: "Cloud Service",
          url: "https://vercel.com",
          username: "dev@company.com",
          password: "",
          otpRequired: false,
          notes: "",
          activationDate: d(-90),
          expiryDate: d(275),
          price: 20.0,
          currency: "USD"
        },
        {
          name: "Netflix Business",
          category: "Streaming",
          url: "https://netflix.com",
          username: "media@company.com",
          password: "",
          otpRequired: false,
          notes: "Premium plan",
          activationDate: d(-25),
          expiryDate: d(5),
          price: 22.99,
          currency: "USD"
        }
      ];
      await Subscription.insertMany(sampleSubscriptions);
      console.log("Seeding completed successfully");
    }
  })
  .catch(err => console.error("MongoDB connection error:", err));

// Routes
app.get("/api/subscriptions", async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/subscriptions", async (req, res) => {
  try {
    const newSubscription = new Subscription(req.body);
    const saved = await newSubscription.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/api/subscriptions/:id", async (req, res) => {
  try {
    const updated = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/api/subscriptions/:id", async (req, res) => {
  try {
    const deleted = await Subscription.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    res.json({ message: "Subscription deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Serve frontend build (dist) in production
const distPath = path.join(__dirname, "..", "dist");
app.use(express.static(distPath));

// Catch-all: send index.html for any unknown route (React Router SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend served at http://localhost:${PORT}`);
});
