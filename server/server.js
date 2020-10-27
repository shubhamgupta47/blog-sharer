const express = require("express");

const app = express();

//import routes
const authRoutes = require("./routes/auth");

//route middlewares
app.use("/api", authRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Listening at port ${port}`));
