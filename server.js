const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { hash } = require("crypto");


function createApp() {
    const app = express();
  
    // Middleware
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(express.static(path.join(__dirname, "public")));
  
    // Serve the HTML file
    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "public", "index.html"));
    });

    app.post("/submit", async (req, res) => {
        const { firstName, lastName, email, password, confirmPassword } = req.body;
        const errors = {};
    
        // Check if all fields are present
        if (!firstName) errors.firstName = "First name is required";
        if (!lastName) errors.lastName = "Last name is required";
        if (!email) errors.email = "Email is required";
        if (!password) errors.password = "Password is required";
        if (!confirmPassword) errors.confirmPassword = "Password confirmation is required";
    
        // Email validation
        if (email && !validator.isEmail(email)) {
          errors.email = "Invalid email format";
        }
    
        // Password validation
        if (password) {
          if (password.length < 8 || password.length > 255) {
            errors.password = "Password must be between 8 and 255 characters";
          } else if (!/\d/.test(password)) {
            errors.password = "Password must contain at least one number";
          } else if (!/[!@#$%^&*]/.test(password)) {
            errors.password = "Password must contain at least one special character";
          } else if (
            (firstName && password.toLowerCase().includes(firstName.toLowerCase())) ||
            (lastName && password.toLowerCase().includes(lastName.toLowerCase()))
          ) {
            errors.password = "Password cannot contain your first or last name";
          }
        }
    
        // Password confirmation
        if (password && confirmPassword && password !== confirmPassword) {
          errors.confirmPassword = "Passwords do not match";
        }
    
      
    
      });

  
  
    return app;
  }
  const app = createApp();

  // Only listen if this file is run directly
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  }
  
  module.exports = createApp;
