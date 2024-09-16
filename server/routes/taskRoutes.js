const express = require("express");
const Task = require("../models/taskSchema");
const User = require("../models/userSchema");
const auth = require("../middlewares/auth");
const { default: mongoose } = require("mongoose");

const router = express.Router();

// Add a new task

router.post("/task", auth, async (req, res) => {
  const {
    taskName,
    description,
    assignedTo,
    assignedBy,
    dueDate,
    dueTime,
    durations,
    status,
    priority,
    type,
  } = req.body;
  console.log("Creating Task... ");

  try {
    // Validate required fields
    if (!assignedTo) {
      return res.status(400).json({ message: "AssignedTo field is required" });
    }

    // Fetch assignedTo user details
    const assignedToUser = await User.findById(
      assignedTo,
      "firstName lastName email profilePicture"
    );
    if (!assignedToUser) {
      return res.status(404).json({ message: "AssignedTo user not found" });
    }

    // Fetch assignedBy user details if provided
    let assignedByUser = null;
    if (assignedBy) {
      assignedByUser = await User.findById(
        assignedBy,
        "firstName lastName email profilePicture"
      );
      if (!assignedByUser) {
        return res.status(404).json({ message: "AssignedBy user not found" });
      }
    }

    // Construct the taskData object with limited fields
    const taskData = {
      taskName,
      description,
      assignedTo: assignedToUser._id,
      assignedBy: assignedByUser ? assignedByUser._id : null,
      dueDate,
      dueTime,
      durations,
      status,
      priority,
      type,
    };

    console.log(`taskData: ${JSON.stringify(taskData)}`); // For debugging

    // Create a new task
    const task = new Task(taskData);
    const savedTask = await task.save();

    // Add task to assignedTo user's task list
    if (!assignedToUser.task) assignedToUser.task = [];
    assignedToUser.task.push(savedTask._id);
    await assignedToUser.save();

    // Add task to assignedBy user's task list if applicable
    if (assignedByUser) {
      if (!assignedByUser.task) assignedByUser.task = [];
      assignedByUser.task.push(savedTask._id);
      await assignedByUser.save();
    }

    // Populate the assignedTo and assignedBy fields with user data
    const populatedTask = await savedTask.populate([
      { path: "assignedTo", select: "firstName lastName email profilePicture" },
      { path: "assignedBy", select: "firstName lastName email profilePicture" },
    ]);

    // Respond with the populated task
    res.status(201).json(populatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all tasks// Get all tasks
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find().populate({
      path: "assignedTo assignedBy",
      select: "firstName lastName email profilePicture",
    });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a task by ID
router.get("/task/:id", auth, async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id).populate(
      "assignedTo assignedBy",
      "-password"
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a task by ID
router.put("/task/:id", auth, async (req, res) => {
  const { id } = req.params;
  const {
    taskName,
    description,
    dueDate,
    dueTime,
    durations,
    status,
    priority,
    type,
  } = req.body;
  console.log("taskName: ", taskName);
  console.log("dueDate: ", dueDate);
  console.log("dueTime: ", dueTime);
  console.log("durations: ", durations);
  console.log("status: ", status);
  console.log("priority: ", priority);
  console.log("type: ", type);
  console.log("id: ", id);
  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (taskName) task.taskName = taskName;
    if (description) task.description = description;
    if (dueDate) task.dueDate = dueDate;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (type) task.type = type;
    if (dueTime) task.dueTime = dueTime;
    if (durations) task.durations = durations;

    await task.save();
    console.log(`Task saved ${task}`);
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a task by ID
router.delete("/task/:id", auth, async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get tasks for a specific date
router.get("/date/:date", auth, async (req, res) => {
  const { date } = req.params;

  try {
    const tasks = await Task.find({
      dueDate: {
        $gte: new Date(new Date(date).setHours(0, 0, 0)),
        $lt: new Date(new Date(date).setHours(23, 59, 59)),
      },
    }).populate("assignedTo assignedBy", "-password");
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
