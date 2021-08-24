const mongoose = require("mongoose");

const walletSchema = mongoose.Schema(
  {
    password: { type: String, required: true },
    wordList: { type: Array, required: true, unique: true },
    wallet: { type: Array, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("wallets", walletSchema);
