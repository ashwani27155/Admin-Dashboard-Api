const express = require("express");
const app = express();
const serverConfig = require("./config/server.config");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const bcrypt = require("bcrypt");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
//setup routes
require("./routes/transaction.routes")(app);
app.listen(serverConfig.PORT, () => {
	console.log("Server is listen on port:", serverConfig.PORT);
});
