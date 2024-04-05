require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/dbConn.js");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const corsOptions = require("./config/corsOptions.js");
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use("/", express.static(path.join(__dirname, "public")));
app.use("/", require("./routes/root.js"));
app.get("/auth", require("./routes/authRoutes.js"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

mongoose.connection.once("open", () => {
  console.log("connection established");
  app.listen(PORT, () => {
    console.log(`The server listening on Port ${PORT}`);
  });
});
mongoose.connection.on("error", (err) => {
  console.log("there is an error in connection");
});
