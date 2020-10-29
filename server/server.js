const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// creating app instance
const app = express();

// db connection
mongoose
  .connect(process.env.DATABASE_CLOUD, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("DB connected..."))
  .catch((err) => console.log(err));

//import routes
const authRoutes = require("./routes/auth");

//app middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
// app.use(cors()); // this allows requests from all domains, hence unsafe
app.use(cors({ origin: process.env.CLIENT_URL }));

//route middlewares
app.use("/api", authRoutes);

const port = process.env.PORT;

app.listen(port, () => console.log(`Listening at port ${port}`));
