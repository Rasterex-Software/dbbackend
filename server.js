const express = require("express");
//const session = require("express-session");
//const crypto = require("crypto");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: ["http://localhost:4200", "http://viewserver.rasterex.com:4200", "http://viewserver.rasterex.com"],
  methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  //allowedHeaders: "Content-Type, Authorization",
  //credentials: true,
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

/*app.use(session({
  secret: "viewserver-rasterex-secret-key", // A secret key for signing the session ID cookie
  resave: false, // Forces the session to be saved back to the store
  saveUninitialized: false, // Forces a session that is "uninitialized" to be saved to the store
  genid: function(req) {
    const id = crypto.randomBytes(4).toString("hex");
    // console.log("genid sessionId:", id);
    return id;
  },
  name: "rx.cid", // default is "connect.sid"
  cookie: {
    secure: false, // Set to true if using https
    maxAge: 24 * 60 * 60 * 1000 // Expiration time (e.g., 1 day)
  }
}));*/

console.log("Initializing models...");
const db = require("./app/models");
db.sequelize.sync()
  .then(() => {
    console.log("Synced PostgreSQL database.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// simple route
app.get("/", (req, res) => {
    res.send(`
    <html>
      <head>
        <script>
          setTimeout(() => window.location.href = "/api-docs", 5000);
        </script>
      </head>
      <body style="text-align: center; font-size: 20px">
        <h1>Welcome to user-service</h1>
        <span>Redirecting to <a href="/api-docs">/api-docs</a>...</span>
      </body>
    </html>
  `);
});


console.log("Initializing routes...");
require("./app/routes/routes.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
const server = require("http").createServer(app);

console.log("Initializing swagger...");
require("./swagger.js")(app, `http://localhost:${PORT}`);

console.log("Initializing websocket/room...");
require("./app/collab/room.js")(server, corsOptions);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


/*app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});*/
