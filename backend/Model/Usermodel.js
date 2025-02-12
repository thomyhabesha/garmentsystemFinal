const bcrypt = require('bcryptjs');
const db = require('../Config/Db');

const validRoles = ['admin', 'productionmanager', 'inventorymanager'];

const authenticateUserByRole = (role, username, password, callback) => {
  // Validate the role
  if (!validRoles.includes(role)) {
    return callback('Invalid role', null);
  }

  

  const roleTableMap = {
    admin: 'admin',
    productionmanager: 'productionmanager',
    inventorymanager: 'inventorymanager',
  };

  const tableName = roleTableMap[role];
  const query = `
    SELECT u.UserID, u.Fname, u.Lname, u.email, u.user_role, ${tableName}.password_hash 
    FROM USERS u 
    JOIN ${tableName} ON u.userID = ${tableName}.userID 
    WHERE ${tableName}.username = ?`;

  // Execute the query securely
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Error during authentication:', err);
      return callback('Internal server error', null);
    }

    if (results.length > 0) {
      // Compare the entered password with the stored hashed password
      bcrypt.compare(password, results[0].password_hash, (err, isMatch) => {
        if (err) {
          console.error('Error comparing passwords:', err);
          return callback('Internal server error', null);
        }

        if (isMatch) {
          console.log('Password match successful!');
          const { UserID, Fname, Lname, email, user_role } = results[0];
          callback(null, { UserID, Fname, Lname, email, user_role }); // Return user data
        } else {
          console.log('Password does not match.');
          callback('Invalid username or password', null); // Generic error for security
        }
      });
    } else {
      console.log('No user found with that username.');
      callback('Invalid username or password', null); // Generic error for security
    }
  });
};

module.exports = { authenticateUserByRole };
