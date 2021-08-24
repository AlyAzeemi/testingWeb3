const walletService = require("../services/walletService");
const messages = require("../localization/messages");
const {
  sendResponseWithDataAndMessage,
  errorResponse,
} = require("../methods/response");

async function createWallet(req, res) {}

async function createAccount(req, res) {
  try {
    const response = await walletService.createAccount();
    if (response.message == messages.wallet.createAccount.success) {
      return sendResponseWithDataAndMessage(
        res,
        true,
        response.message,
        response.data,
        200
      );
    } else if (response.message == messages.wallet.createAccount.failure) {
      return sendResponseWithDataAndMessage(
        res,
        false,
        response.message,
        response.data,
        400
      );
    }
  } catch (e) {
    console.log(e);
    return errorResponse(res, "Internal Server Error", 500);
  }
}

async function getBalance(req, res) {
  try {
    if (!req.body.address) {
      res.send("No args given");
    } else {
      const response = await walletService.getBalance(req.body.address);
      if (response.message == messages.wallet.getBalance.success) {
        return sendResponseWithDataAndMessage(
          res,
          true,
          response.message,
          response.data,
          200
        );
      } else if (response.message == messages.wallet.getBalance.failure) {
        return sendResponseWithDataAndMessage(
          res,
          false,
          response.message,
          response.data,
          400
        );
      }
    }
  } catch (e) {
    console.log(e);
    return errorResponse(res, "Internal Server Error", 500);
  }
}

async function transfer(req, res) {
  try {
    const to = req.body.to;
    const from = req.body.from;
    const amount = req.body.amount;
    const privKey = req.body.privKey;

    const response = await walletService.transfer(from, to, privKey, amount);
    if (response.message == messages.wallet.transfer.success) {
      return sendResponseWithDataAndMessage(
        res,
        true,
        response.message,
        response.data,
        200
      );
    } else if (response.message == messages.wallet.transfer.failure) {
      return sendResponseWithDataAndMessage(
        res,
        false,
        response.message,
        response.data,
        400
      );
    }
  } catch (e) {
    console.log(e);
    return errorResponse(res, "Internal Server Error", 500);
  }
}

async function getTransaction(req, res) {
  try {
    const txHash = req.body.txHash;
    if (!txHash) {
      return;
    }

    const response = await walletService.getTransaction(txHash);
    if (response.message == messages.wallet.getTransaction.success) {
      return sendResponseWithDataAndMessage(
        res,
        true,
        response.message,
        response.data,
        200
      );
    }
    if (response.message == messages.wallet.getTransaction.failure) {
      return sendResponseWithDataAndMessage(
        res,
        false,
        response.message,
        response.data,
        400
      );
    }
  } catch (e) {
    console.log(e);
    return errorResponse(res, "Internal server error", 500);
  }
}

async function getTokenName(req, res) {
  try {
    const response = await walletService.getTokenName();
    if (response.message == messages.wallet.getTokenName.success) {
      return sendResponseWithDataAndMessage(
        res,
        true,
        response.message,
        response.data,
        200
      );
    }
    if (response == messages.wallet.getTokenName.failure) {
      return sendResponseWithDataAndMessage(
        res,
        false,
        response.message,
        response.data,
        400
      );
    }
  } catch (e) {
    console.log(e);
    return errorResponse(res, "Internal server error", 500);
  }
}

async function getTokenSymbol(req, res) {
  try {
    const response = await walletService.getTokenSymbol();
    if (response.message == messages.wallet.getTokenSymbol.success) {
      return sendResponseWithDataAndMessage(
        res,
        true,
        response.message,
        response.data,
        200
      );
    }
    if (response == messages.wallet.getTokenSymbol.failure) {
      return sendResponseWithDataAndMessage(
        res,
        false,
        response.message,
        response.data,
        400
      );
    }
  } catch (e) {
    console.log(e);
    return errorResponse(res, "Internal server error", 500);
  }
}

async function getTokenSupply(req, res) {
  try {
    const response = await walletService.getTokenSupply();
    if (response.message == messages.wallet.getTokenSupply.success) {
      return sendResponseWithDataAndMessage(
        res,
        true,
        response.message,
        response.data,
        200
      );
    }
    if (response == messages.wallet.getTokenSupply.failure) {
      return sendResponseWithDataAndMessage(
        res,
        false,
        response.message,
        response.data,
        400
      );
    }
  } catch (e) {
    console.log(e);
    return errorResponse(res, "Internal server error", 500);
  }
}

async function getTokenBalance(req, res) {
  try {
    if (!req.body.address) {
      return "No address given";
    }
    const response = await walletService.getTokenBalance(req.body.address);
    if (response.message == messages.wallet.getTokenBalance.success) {
      return sendResponseWithDataAndMessage(
        res,
        true,
        response.message,
        response.data,
        200
      );
    }
    if (response == messages.wallet.getTokenBalance.failure) {
      return sendResponseWithDataAndMessage(
        res,
        false,
        response.message,
        response.data,
        400
      );
    }
  } catch (e) {
    console.log(e);
    return errorResponse(res, "Internal server error", 500);
  }
}

async function transferTokens(req, res) {
  try {
    const to = req.body.to;
    const from = req.body.from;
    const amount = req.body.amount;
    const privKey = req.body.privKey;

    const response = await walletService.transferTokens(
      from,
      to,
      privKey,
      amount
    );
    if (response.message == messages.wallet.transferTokens.success) {
      return sendResponseWithDataAndMessage(
        res,
        true,
        response.message,
        response.data,
        200
      );
    } else if (response.message == messages.wallet.transferTokens.failure) {
      return sendResponseWithDataAndMessage(
        res,
        false,
        response.message,
        response.data,
        400
      );
    }
  } catch (e) {
    console.log(e);
    return errorResponse(res, "Internal Server Error", 500);
  }
}

module.exports = {
  createAccount,
  getBalance,
  transfer,
  getTransaction,
  getTokenName,
  getTokenSymbol,
  getTokenSupply,
  getTokenBalance,
  transferTokens,
};
