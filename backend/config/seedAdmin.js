const User = require("../models/User");
const logger = require("../utils/logger");

/**
 * Seed a default admin user if one doesn't already exist.
 *
 * Admin Credentials:
 *   Email:    admin@settelinn.com
 *   Password: Admin@123
 */
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists) {
      logger.info(`👑 Admin exists: ${adminExists.email}`);
      return;
    }

    await User.create({
      name: "Admin",
      email: "admin@settelinn.com",
      password: "Admin@123",
      role: "admin",
    });

    logger.info("👑 Default admin created: admin@settelinn.com / Admin@123");
  } catch (error) {
    logger.error(`Admin seed error: ${error.message}`);
  }
};

module.exports = seedAdmin;
