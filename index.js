//Express Setup
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const apiRoutes = require("./routes/API");
const app = new express();

const PORT = process.env.PORT || 5000;
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

////Express REST APIs: Create Acc, GetBalance, Transfer, getTransaction, TokenName, Symbol, Supply, TokenBalance
app.use("/api", apiRoutes);

//Run
app.listen(PORT, () => {
  console.log(`Up and running at http://localhost:${PORT}/`);
});
