const Web3 = require("web3");
const web3 = new Web3(
  "https://ropsten.infura.io/v3/ee4038b62e4e49dbbf5b24a9cb22ffb6"
);
const { Transaction } = require("ethereumjs-tx");
const Tx = Transaction;
const { wallet } = require("../localization/messages");
const { tokenABI, tokenAddress } = require("./token");
const InputDataDecoder = require("ethereum-input-data-decoder");
const decoder = new InputDataDecoder(tokenABI);
const contract = new web3.eth.Contract(tokenABI, tokenAddress);

async function createAccount() {
  try {
    const account = web3.eth.accounts.create();
    if (account) {
      return {
        message: wallet.createAccount.success,
        data: account,
      };
    }
  } catch (e) {
    console.log(e);
    return {
      message: wallet.createAccount.failure,
      data: null,
    };
  }
}

async function getBalance(address) {
  try {
    const response = await web3.eth.getBalance(address);
    if (response) {
      return {
        message: wallet.getBalance.success,
        data: response,
      };
    }
  } catch (e) {
    console.log(e);
    return {
      message: wallet.getBalance.failure,
      data: null,
    };
  }
}

async function transfer(from, to, privKey, amount) {
  try {
    //Create TxObject
    const txCount = await web3.eth.getTransactionCount(from);
    const txObject = {
      nonce: web3.utils.toHex(txCount),
      to: to,
      value: web3.utils.toHex(amount),
      gasLimit: web3.utils.toHex(21000),
      gasPrice: web3.utils.toHex(web3.utils.toWei("10", "gwei")),
    };
    const tx = new Tx(txObject, { chain: "ropsten" });

    //SignTransaction
    const pKey = Buffer.from(privKey, "hex");
    tx.sign(pKey);

    //SerializeTransaction
    const serializedTransaction = tx.serialize();
    const raw = "0x" + serializedTransaction.toString("hex");

    //Send
    const response = await web3.eth.sendSignedTransaction(raw);
    if (response) {
      return { message: wallet.transfer.success, data: response };
    }
  } catch (e) {
    console.log(`Error during wallet.transfer: ${e}`);
    return { message: wallet.transfer.failure, data: null };
  }
}
async function getTransaction(txHash) {
  try {
    const tx = await web3.eth.getTransaction(txHash);

    if (tx) {
      tx.input = decoder.decodeData(tx.input);

      //Make it readable
      const readableData = {
        method: tx.input.method,
      };
      for (let i = 0; i < 2; i++) {
        readableData[`${tx.input.names[i]}`] = tx.input.inputs[i].toString(10);
      }
      readableData._to = "0x" + readableData._to;

      tx.input = readableData;
      return { message: wallet.getTransaction.success, data: tx };
    }
  } catch (e) {
    console.log(e);
    return { message: wallet.getTransaction.failure, data: null };
  }
}

async function getTokenName() {
  try {
    const contractName = await contract.methods.name().call();
    if (contractName) {
      return {
        message: wallet.getTokenName.success,
        data: contractName,
      };
    }
  } catch (e) {
    console.log(e);
    return {
      message: wallet.getTokenName.failure,
      data: null,
    };
  }
}
async function getTokenSymbol() {
  try {
    const contractSymbol = await contract.methods.symbol().call();
    if (contractSymbol) {
      return {
        message: wallet.getTokenSymbol.success,
        data: contractSymbol,
      };
    }
  } catch (e) {
    console.log(e);
    return {
      message: wallet.getTokenSymbol.failure,
      data: null,
    };
  }
}
async function getTokenSupply() {
  try {
    const contractSupply = await contract.methods.totalSupply().call();
    if (contractSupply) {
      return {
        message: wallet.getTokenSupply.success,
        data: contractSupply,
      };
    }
  } catch (e) {
    console.log(e);
    return {
      message: wallet.getTokenSupply.failure,
      data: null,
    };
  }
}
async function getTokenBalance(address) {
  try {
    const contractBalanceWei = await contract.methods.balanceOf(address).call();
    const contractBalance = web3.utils.fromWei(contractBalanceWei, "ether");
    console.log(contractBalance);
    if (contractBalance) {
      return {
        message: wallet.getTokenBalance.success,
        data: contractBalance,
      };
    }
  } catch (e) {
    console.log(e);
    return {
      message: wallet.getTokenBalance.failure,
      data: null,
    };
  }
}

async function transferTokens(from, to, privKey, amount) {
  try {
    //Create TxObject
    amount = web3.utils.toWei(amount, "ether");

    const txCount = await web3.eth.getTransactionCount(from);
    const txObject = {
      nonce: web3.utils.toHex(txCount),
      from: from,
      to: tokenAddress,
      value: "0x0",
      gasLimit: web3.utils.toHex(210000),
      gasPrice: web3.utils.toHex(web3.utils.toWei("10", "gwei")),
      data: contract.methods.transfer(to, amount).encodeABI(),
    };
    const tx = new Tx(txObject, { chain: "ropsten" });

    //SignTransaction
    const pKey = Buffer.from(privKey, "hex");
    tx.sign(pKey);

    //SerializeTransaction
    const serializedTransaction = tx.serialize();
    const raw = "0x" + serializedTransaction.toString("hex");

    //Send
    const response = await web3.eth.sendSignedTransaction(raw);
    console.log(response);
    if (response) {
      return { message: wallet.transferTokens.success, data: response };
    }
  } catch (e) {
    console.log(`Error during wallet.transfer: ${e}`);
    return { message: wallet.transferTokens.failure, data: null };
  }
}

async function test() {
  //MyWallets
  const { accounts } = require("../secrets.json");
  await transferTokens(
    accounts[0].address,
    accounts[1].address,
    accounts[0].private_key,
    "3"
  );
}

module.exports = {
  createAccount,
  transfer,
  getBalance,
  getTransaction,
  getTokenName,
  getTokenSymbol,
  getTokenSupply,
  getTokenBalance,
  transferTokens,
};
