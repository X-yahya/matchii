const mongoose = require("mongoose");

const { Schema } = mongoose;

const PlanSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  deliveryDays: { type: Number, required: true },
  revisions: { type: Number, required: false },
  features: { type: [String], required: true }
});

const GigSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: { 
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    plans: [
      PlanSchema
    ],
    coverImage: {
      type: String,
      required: true,
    },
    gallery: {
      type: [String],
    },
    totalStars: {
      type: Number,
      default: 0,
    },
    starNumber: {
      type: Number,
      default: 0,
    },
    sales: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Check if the model already exists before defining it
module.exports = mongoose.models.Gig || mongoose.model("Gig", GigSchema);



