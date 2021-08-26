module.exports = {
  wallet: {
    createWallet: {
      success: "Wallet has been created and stored in DB.",
      failure: "Failed to create wallet.",
    },
    recoverWallet: {
      success: "The corresponding wallet has been retrieved.",
      failure: "No wallet associated with this wordList",
    },
    createAccount: {
      success: "Account successfully created",
      failure: "Unable to create account",
    },
    signIn: {
      success: "password checks out",
      user_not_found: "Invalid wallet ID",
      failure: "password doesn't match.",
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
    transferTokens: {
      success: "Transfer successful",
      failure:
        "Transfer Failed, either addresses or contract are invalid or there's not enough gas.",
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
