const mongoose = require("mongoose");
const { Schema } = mongoose;

const taskSchema = new Schema({
  taskName: { type: String, required: true },
  description: { type: String },
  assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
  assignedBy: { type: Schema.Types.ObjectId, ref: "User" },
  dueDate: { type: Date, required: true },
  dueTime: { type: Date, required: true },
  durations: { type: Number, required: true },
  status: {
    type: String,
    enum: ["due", "in-progress", "completed", "overdue"],
    default: "due",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  type: {
    type: String,
    enum: ["personal", "schedule", "medication"], // Fixed enum definition
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Pre-save middleware to update the updatedAt field
taskSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
