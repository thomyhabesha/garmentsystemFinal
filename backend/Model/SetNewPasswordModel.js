const db = require('../Config/Db');
const bcrypt = require('bcryptjs');

function updateUserPassword(email, newPassword, role, callback) {
  console.log("Role:", role); // Log the role
  db.query('SELECT UserID FROM users WHERE email = ?', [email], async (err, userResults) => {
    if (err) {
      return callback(err, null);  // Call the callback with error if db query fails
    }
    if (userResults.length === 0) {
      return callback(new Error('Email not found'), null);  // Email not found, return error
    }

    const userId = userResults[0].UserID;
    console.log("UserID:", userId); // Log the userId

    const query = `SELECT UserID FROM ${role} WHERE UserID = ?`;
    db.query(query, [userId], async (err, results) => {
      if (err) {
        return callback(err, null);  // Call the callback with error if db query fails
      }
      console.log("Results from role table:", results); // Log the results from the role table

      if (results.length === 0) {
        return callback(new Error('User is not found in the given table'), null);  // User not found in the role table
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updateQuery = `UPDATE ${role} SET password_hash = ? WHERE UserID = ?`;
      db.query(updateQuery, [hashedPassword, userId], (err, updateResults) => {
        if (err) {
          return callback(err, null);  // Call the callback with error if update query fails
        }
        console.log('Password updated successfully');
        callback(null, 'Password updated successfully');  // Call the callback with success message
      });
    });
  });
}

module.exports = { updateUserPassword };
