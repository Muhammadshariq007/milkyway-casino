// app.js
const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user.routes"); // Correct import for your routes
const gameRoutes = require("./routes/game.routes");
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors')
const http = require('http');
const SpinnerJob = require('./jobs/cron.job');
const path = require('path');
const router = express.Router();



const WebSocketServerSingleton = require('./websocket/ws');
const { createAdmin } = require("./utils/admin");



const server = http.createServer(app);
new WebSocketServerSingleton(server);

app.use(cors({
  origin: process.env.FRONTEND_URL, // Replace with the actual IP and port
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true // Only use if you are sending cookies with requests
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Use the user routes
app.use("/api", userRoutes); // Correct usage
app.use("/api", gameRoutes); // Correct usage

router.get('/users', (req, res) => {
  res.json({ message: 'User data' });
});



// Serve static files from the Vue.js app
app.use(express.static(path.join(__dirname, 'dist')));

// Handle all other requests by returning the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


new SpinnerJob();
createAdmin()
// Start the server
const APP_PORT = process.env.APP_PORT || 3000;
const APP_URL = process.env.APP_URL || "localhost"
server.listen(APP_PORT, () => {
  console.log(`Server is running on ${APP_URL}:${Number(APP_PORT)}`);
});


