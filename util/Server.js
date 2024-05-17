const express = require("express");

const UserRoutes = require("../routes/UserRoutes");
const HabitRoutes = require("../routes/HabitRoutes");
const LogRoutes = require("../routes/LogRoutes");

createServer = () => {
  const app = express();
  app.use(express.json());

  app.use("/api/v1/users", UserRoutes);
  app.use("/api/v1/habits", HabitRoutes);
  app.use("/api/v1/logs", LogRoutes);

  app.get("/", (request, response) => {
    response.status(200).send("Server is UP and Running");
  });
  
  return app;
};

module.exports = { createServer };