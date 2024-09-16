const User = require("../models/userSchema");

const updateLoginStreak = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (user.loginStreak.lastLogin) {
    const lastLoginDate = new Date(user.loginStreak.lastLogin);
    if (lastLoginDate.toDateString() === yesterday.toDateString()) {
      user.loginStreak.count += 1;
    } else if (lastLoginDate.toDateString() !== today.toDateString()) {
      user.loginStreak.count = 1;
    }
  } else {
    user.loginStreak.count = 1;
  }

  user.loginStreak.lastLogin = today;
  await user.save();

  return user.loginStreak;
};

module.exports = updateLoginStreak;
