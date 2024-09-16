const mongoose = require("mongoose");
const { Schema } = mongoose;

const carePlanSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
  doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  goals: [
    {
      goal: { type: String, required: true },
      targetDate: { type: Date, required: true },
      progress: {
        type: String,
        enum: ["not started", "in progress", "completed"],
        default: "not started",
      },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Pre-save middleware to update the updatedAt field
carePlanSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const CarePlan = mongoose.model("CarePlan", carePlanSchema);
module.exports = CarePlan;
