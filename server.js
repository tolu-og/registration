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
