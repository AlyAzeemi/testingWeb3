module.exports = {
  wallet: {
    createAccount: {
      success: "Account successfully created",
      failure: "Unable to create account",
    },
    getBalance: {
      success: "Success",
      failure:
        "Either the given address doesn't exist or network conditions are poor.",
    },
    transfer: {
      success: "Transfer successful",
      failure:
        "Transfer Failed, either addresses are invalid or not enough gas.",
    },
    getTransaction: {
      success: "Transaction received.",
      failure: "Transaction doesn't exist.",
    },
    getTokenName: {
      success: "Name successfully retrieved.",
      failure: "Failed to retrieve token name.",
    },
    getTokenSymbol: {
      success: "Symbol successfully retrieved.",
      failure: "Failed to retrieve token Symbol.",
    },
    getTokenSupply: {
      success: "Supply successfully retrieved.",
      failure: "Failed to retrieve token Supply.",
    },
    getTokenBalance: {
      success: "Balance successfully retrieved.",
      failure:
        "Failed to retrieve balance. Either account address does not exist or network conditions are poor",
    },
  },
};
