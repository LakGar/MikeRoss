const cron = require("node-cron");
const Task = require("../models/taskSchema"); // Adjust the path as needed
const CarePlan = require("../models/carePlanSchema"); // Adjust the path as needed

// Function to update the status of overdue tasks
const updateOverdueTasks = async () => {
  try {
    const now = new Date();

    // Find tasks that are overdue and not already marked as "overdue"
    const overdueTasks = await Task.find({
      dueDate: { $lt: now },
      status: { $ne: "overdue" },
    });

    // Update the status of overdue tasks
    for (const task of overdueTasks) {
      task.status = "overdue";
      await task.save();
    }

    console.log(`${overdueTasks.length} tasks updated to overdue status`);
  } catch (err) {
    console.error("Error updating overdue tasks:", err);
  }
};

// Function to update the status of overdue care plan goals
const updateOverdueCarePlans = async () => {
  try {
    const now = new Date();

    // Find care plans with overdue goals
    const carePlans = await CarePlan.find({
      "goals.targetDate": { $lt: now },
      "goals.progress": { $ne: "completed" },
    });

    // Update the status of overdue goals
    for (const carePlan of carePlans) {
      carePlan.goals.forEach((goal) => {
        if (goal.targetDate < now && goal.progress !== "completed") {
          goal.progress = "overdue";
        }
      });
      await carePlan.save();
    }

    console.log(`${carePlans.length} care plans updated with overdue goals`);
  } catch (err) {
    console.error("Error updating overdue care plans:", err);
  }
};

// Schedule the job to run every day at midnight
cron.schedule("0 0 * * *", () => {
  console.log("Running scheduled job to update overdue tasks and care plans");
  updateOverdueTasks();
  updateOverdueCarePlans();
});

module.exports = { updateOverdueTasks, updateOverdueCarePlans };
