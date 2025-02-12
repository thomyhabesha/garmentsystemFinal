const db = require('../Config/Db');
const bcrypt = require('bcryptjs');

// Update user account information based on role
const updateUserSettings = async (req, res) => {
  const { username, newUsername, oldPassword, newPassword, role } = req.body;

  try {
    // Determine the table based on the role
    let tableName;
    switch (role) {
      case 'admin':
        tableName = 'admin';
        break;
      case 'productionmgr':
        tableName = 'productionmanager';
        break;
      case 'inventoryMgr':
        tableName = 'inventorymanager';
        break;
      default:
        return res.status(400).json({ message: 'Invalid role provided' });
    }

    // Check if the old password matches the current one
    const [user] = await db
      .promise()
      .query(`SELECT * FROM ${tableName} WHERE username = ?`, [username]);

    if (user.length === 0) {
      return res.status(404).json({ message: `${role} not found` });
    }

    const match = await bcrypt.compare(oldPassword, user[0].password_hash);
    if (!match) {
      return res.status(400).json({ message: 'Incorrect old password' });
    }

    // Hash the new password if provided
    let hashedPassword = oldPassword;
    if (newPassword) {
      hashedPassword = await bcrypt.hash(newPassword, 10);
    }

    // Update the user details
    const query = `
      UPDATE ${tableName}
      SET username = ?, password_hash = ?
      WHERE username = ?;
    `;
    await db
      .promise()
      .query(query, [newUsername || username, hashedPassword, username]);

    return res.status(200).json({ message: `${role} settings updated successfully` });
  } catch (error) {
    console.error(`Error updating ${role} settings:`, error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  updateUserSettings,
};
