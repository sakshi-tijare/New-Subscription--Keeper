const mongoose = require("mongoose");

const RenewalSchema = new mongoose.Schema({
  date: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "USD" },
  paymentProof: { type: String },
  newExpiryDate: { type: String, required: true },
  notes: { type: String }
});

const DocumentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true }
});

const SubscriptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  project: { type: String },
  category: { type: String, required: true },
  url: { type: String },
  username: { type: String },
  password: { type: String },
  otpRequired: { type: Boolean, default: false },
  notes: { type: String },
  activationDate: { type: String, required: true },
  expiryDate: { type: String, required: true },
  price: { type: Number },
  currency: { type: String, default: "USD" },
  documents: [DocumentSchema],
  renewals: [RenewalSchema]
}, {
  timestamps: true
});

// Set toJSON transform to make _id appear as id
SubscriptionSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    if (ret.renewals) {
      ret.renewals = ret.renewals.map(r => {
        r.id = r._id;
        delete r._id;
        return r;
      });
    }
    return ret;
  }
});

module.exports = mongoose.model("Subscription", SubscriptionSchema);
